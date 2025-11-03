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
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  const [bookingDataForQuote, setBookingDataForQuote] = useState<any>(null);

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
    // Find booking in data
    const bookingItem = data.find(d => d.booking.id === bookingId);
    if (!bookingItem) {
      toast.error('Kunde inte hitta bokning');
      return;
    }

    // Check if quote already exists
    if (bookingItem.quote) {
      toast.error('En offert finns redan för denna förfrågan');
      return;
    }

    // Set booking data and open modal with prefilled data
    setBookingDataForQuote({
      id: bookingItem.booking.id,
      payload: bookingItem.booking.payload,
      customer_id: bookingItem.booking.customer_id
    });
    setEditQuoteId(null);
    setQuoteModalOpen(true);
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
          onClick={() => navigate('/admin/bookings-trash')}
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
                onRefresh={refresh}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
