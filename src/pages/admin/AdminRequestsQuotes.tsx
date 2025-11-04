import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminBack from "@/components/admin/AdminBack";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Trash2, Search } from "lucide-react";
import { useRequestsQuotes } from "@/hooks/useRequestsQuotes";
import { RequestQuoteCard } from "@/components/admin/RequestQuoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QuoteFormModal } from "@/components/admin/QuoteFormModal";
import { JobCreationDialog } from "@/components/admin/JobCreationDialog";
import InvoicePreviewDialog from "@/components/admin/InvoicePreviewDialog";
import { createCustomer } from "@/lib/api/customers";
import { createInvoiceFromJob } from "@/lib/api/invoices";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminRequestsQuotes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "requests";
  
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [jobCreationModalOpen, setJobCreationModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  const [bookingDataForQuote, setBookingDataForQuote] = useState<any>(null);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [selectedJobForInvoice, setSelectedJobForInvoice] = useState<any>(null);

  // Filter based on tab
  const statusFilter = [activeTab];

  const { data, loading, refresh } = useRequestsQuotes(statusFilter);

  const filteredData = data.filter(item => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const serviceName = (item.booking.payload?.service_name || item.booking.service_slug || '').toLowerCase();
    const customerName = (item.customer?.name || item.booking.payload?.name || '').toLowerCase();
    const customerEmail = (item.customer?.email || item.booking.payload?.email || '').toLowerCase();
    const quoteNumber = (item.quote?.number || '').toLowerCase();
    
    return serviceName.includes(searchLower) ||
           customerName.includes(searchLower) ||
           customerEmail.includes(searchLower) ||
           quoteNumber.includes(searchLower);
  });

  const counts = {
    requests: data.filter(item => !item.quote && item.booking.status === 'new').length,
    quotes: data.filter(item => !!item.quote).length,
    archived: data.filter(item => ['completed', 'cancelled'].includes(item.booking.status)).length,
  };

  const handleCreateQuote = async (bookingId: string) => {
    const bookingItem = data.find(d => d.booking.id === bookingId);
    if (!bookingItem) {
      toast.error('Kunde inte hitta bokning');
      return;
    }

    if (bookingItem.quote) {
      toast.error('En offert finns redan för denna förfrågan');
      return;
    }

    const payload = bookingItem.booking.payload || {};
    const customerEmail = payload.email || payload.contact_email;

    if (!customerEmail) {
      toast.error('Kundens email saknas i bokningen');
      return;
    }

    try {
      let customerId = bookingItem.customer?.id;
      
      if (!customerId) {
        // Sök efter befintlig kund via email
        const { data: existingCustomers } = await supabase
          .from('customers')
          .select('id')
          .ilike('email', customerEmail)
          .limit(1);
        
        if (existingCustomers && existingCustomers.length > 0) {
          customerId = existingCustomers[0].id;
          console.log('[handleCreateQuote] Hittade befintlig kund:', customerId);
        } else {
          // Skapa ny kund automatiskt
          const customerName = payload.name || payload.contact_name || 'Okänd kund';
          const customerPhone = payload.phone || payload.contact_phone;
          const customerAddress = payload.address;
          const postalCode = payload.postal_code || payload.postalCode;
          const city = payload.city;
          
          const newCustomerData = {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress,
            postalCode: postalCode,
            city: city
          };
          
          console.log('[handleCreateQuote] Skapar ny kund:', newCustomerData);
          const createdCustomer = await createCustomer(newCustomerData);
          customerId = createdCustomer.id;
          toast.success('Kund skapad automatiskt');
        }
      }

      // Öppna modal med färdig kunddata
      setBookingDataForQuote({
        id: bookingItem.booking.id,
        payload: payload,
        customer_id: customerId
      });
      setEditQuoteId(null);
      setQuoteModalOpen(true);

    } catch (error) {
      console.error('[handleCreateQuote] Error:', error);
      toast.error('Kunde inte förbereda offert');
    }
  };

  const handleEditQuote = (quoteId: string) => {
    setEditQuoteId(quoteId);
    setBookingDataForQuote(null);
    setQuoteModalOpen(true);
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-quote-email-new', {
        body: { quoteId }
      });

      if (error) throw error;

      toast.success('Offert skickad till kund!');
      refresh();
    } catch (error: any) {
      console.error('Error sending quote:', error);
      toast.error('Kunde inte skicka offert');
    }
  };

  const handleViewPdf = (quoteId: string) => {
    const item = data.find(d => d.quote?.id === quoteId);
    if (!item?.quote) return;
    const publicUrl = `${window.location.origin}/q/${item.quote.public_token}`;
    window.open(publicUrl, '_blank');
  };

  const handleCreateInvoice = async (quoteId: string) => {
    try {
      const { data: invoiceData, error } = await supabase.functions.invoke('create-invoice-from-quote', {
        body: { quoteId }
      });

      if (error) throw error;

      toast.success('Faktura skapad!');
      refresh();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Kunde inte skapa faktura');
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/admin/invoices?id=${invoiceId}`);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: { invoiceId }
      });

      if (error) throw error;

      toast.success('Faktura skickad till kund!');
      refresh();
    } catch (error: any) {
      console.error('Error sending invoice:', error);
      toast.error('Kunde inte skicka faktura');
    }
  };

  const handleCopyLink = async (quoteId: string) => {
    const item = data.find(d => d.quote?.id === quoteId);
    if (!item?.quote) return;

    const publicUrl = `${window.location.origin}/q/${item.quote.public_token}`;
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Länk kopierad!');
  };

  const handleCreateJob = async (quoteId: string) => {
    const item = data.find(d => d.quote?.id === quoteId);
    if (!item?.quote) {
      toast.error('Kunde inte hitta offert');
      return;
    }

    if (item.job) {
      toast.error('Ett jobb finns redan för denna offert');
      return;
    }

    setSelectedQuoteId(quoteId);
    setJobCreationModalOpen(true);
  };

  const handleCreateInvoiceFromJob = (jobId: string, customerId: string) => {
    const item = data.find(d => d.job?.id === jobId);
    if (!item || !item.job) {
      toast.error('Kunde inte hitta jobb');
      return;
    }

    setSelectedJobForInvoice({
      job: item.job,
      timeLogs: item.timeLogs || [],
      materialLogs: item.materialLogs || [],
      expenseLogs: item.expenseLogs || [],
      customer: item.customer,
      booking: item.booking,
    });
    setInvoicePreviewOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Förfrågan raderad');
      refresh();
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast.error('Kunde inte radera förfrågan');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBack />
          <h1 className="text-3xl font-bold mt-2">Förfrågningar & Offerter</h1>
          <p className="text-muted-foreground">Hantera kundförfrågningar och skapa offerter</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/bookings/trash')}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Visa papperskorg
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList>
          <TabsTrigger value="requests">
            Nya förfrågningar {counts.requests > 0 && `(${counts.requests})`}
          </TabsTrigger>
          <TabsTrigger value="quotes">
            Offerter {counts.quotes > 0 && `(${counts.quotes})`}
          </TabsTrigger>
          <TabsTrigger value="archived">
            Arkiv {counts.archived > 0 && `(${counts.archived})`}
          </TabsTrigger>
        </TabsList>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök förfrågningar, kunder, offertnummer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value="requests" className="space-y-6 mt-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px]" />
              </div>
            ))
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Inga nya förfrågningar</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <RequestQuoteCard
                key={item.booking.id}
                item={item}
                onCreateQuote={handleCreateQuote}
                onEditQuote={handleEditQuote}
                onSendQuote={handleSendQuote}
                onViewPdf={handleViewPdf}
                onDeleteBooking={(id) => setDeleteId(id)}
                onCopyLink={handleCopyLink}
                onCreateInvoice={handleCreateInvoice}
                onViewInvoice={handleViewInvoice}
                onSendInvoice={handleSendInvoice}
                onCreateJob={handleCreateJob}
                onCreateInvoiceFromJob={handleCreateInvoiceFromJob}
                onRefresh={refresh}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6 mt-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px]" />
              </div>
            ))
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Inga offerter</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <RequestQuoteCard
                key={item.booking.id}
                item={item}
                onCreateQuote={handleCreateQuote}
                onEditQuote={handleEditQuote}
                onSendQuote={handleSendQuote}
                onViewPdf={handleViewPdf}
                onDeleteBooking={(id) => setDeleteId(id)}
                onCopyLink={handleCopyLink}
                onCreateInvoice={handleCreateInvoice}
                onViewInvoice={handleViewInvoice}
                onSendInvoice={handleSendInvoice}
                onCreateJob={handleCreateJob}
                onCreateInvoiceFromJob={handleCreateInvoiceFromJob}
                onRefresh={refresh}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-6 mt-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px]" />
              </div>
            ))
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Inget i arkivet</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <RequestQuoteCard
                key={item.booking.id}
                item={item}
                onCreateQuote={handleCreateQuote}
                onEditQuote={handleEditQuote}
                onSendQuote={handleSendQuote}
                onViewPdf={handleViewPdf}
                onDeleteBooking={(id) => setDeleteId(id)}
                onCopyLink={handleCopyLink}
                onCreateInvoice={handleCreateInvoice}
                onViewInvoice={handleViewInvoice}
                onSendInvoice={handleSendInvoice}
                onCreateJob={handleCreateJob}
                onCreateInvoiceFromJob={handleCreateInvoiceFromJob}
                onRefresh={refresh}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <JobCreationDialog
        open={jobCreationModalOpen}
        onOpenChange={setJobCreationModalOpen}
        quoteId={selectedQuoteId || ''}
        quoteData={data.find(d => d.quote?.id === selectedQuoteId)?.quote}
        onSuccess={() => {
          setJobCreationModalOpen(false);
          setSelectedQuoteId(null);
          refresh();
        }}
      />

      <QuoteFormModal
        open={quoteModalOpen}
        onOpenChange={(open) => {
          setQuoteModalOpen(open);
          if (!open) {
            setEditQuoteId(null);
            setBookingDataForQuote(null);
          }
        }}
        quote={editQuoteId ? data.find(d => d.quote?.id === editQuoteId)?.quote : undefined}
        bookingData={bookingDataForQuote}
        onSuccess={() => {
          setQuoteModalOpen(false);
          setEditQuoteId(null);
          setBookingDataForQuote(null);
          setSearchParams({ tab: 'quotes' });
          refresh();
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera förfrågan?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta kommer att flytta förfrågan till papperskorgen. Du kan återställa den senare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking}>
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedJobForInvoice && (
        <InvoicePreviewDialog
          open={invoicePreviewOpen}
          onOpenChange={setInvoicePreviewOpen}
          job={selectedJobForInvoice.job}
          timeLogs={selectedJobForInvoice.timeLogs}
          materialLogs={selectedJobForInvoice.materialLogs}
          expenseLogs={selectedJobForInvoice.expenseLogs}
          onInvoiceCreated={() => {
            setInvoicePreviewOpen(false);
            setSelectedJobForInvoice(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
