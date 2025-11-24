import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminBack from "@/components/admin/AdminBack";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Plus } from "lucide-react";
import { useRequestsQuotes } from "@/hooks/useRequestsQuotes";
import { RequestQuoteCard } from "@/components/admin/RequestQuoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QuoteFormModal } from "@/components/admin/QuoteFormModal";
import { JobCreationDialog } from "@/components/admin/JobCreationDialog";
import { AdvancedInvoiceEditor } from "@/components/admin/AdvancedInvoiceEditor";
import { createCustomer } from "@/lib/api/customers";
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
import { Badge } from "@/components/ui/badge";

export default function AdminQuotesUnified() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "requests";
  const subFilter = searchParams.get("status") || "all";
  
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [jobCreationModalOpen, setJobCreationModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [editQuoteId, setEditQuoteId] = useState<string | null>(null);
  const [bookingDataForQuote, setBookingDataForQuote] = useState<any>(null);
  const [advancedInvoiceOpen, setAdvancedInvoiceOpen] = useState(false);
  const [advancedInvoiceJobData, setAdvancedInvoiceJobData] = useState<any>(null);

  // Fetch all data without filtering - we'll do client-side filtering
  const { data: allData, loading, refresh } = useRequestsQuotes([]);

  // Listen for ?new=true query param to open quote modal
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      handleNewQuote();
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  // Client-side filtering based on active tab
  const filteredByTab = useMemo(() => {
    switch (activeTab) {
      case "requests":
        // Bookings without quotes, status = new
        return allData.filter(item => !item.quote && item.booking.status === 'new');
      
      case "active":
        // Quotes with active statuses
        const activeStatuses = ['draft', 'sent', 'viewed', 'change_requested'];
        let activeItems = allData.filter(item => 
          item.quote && activeStatuses.includes(item.quote.status)
        );
        
        // Sub-filter by status
        if (subFilter !== "all") {
          activeItems = activeItems.filter(item => item.quote?.status === subFilter);
        }
        return activeItems;
      
      case "completed":
        // Quotes with completed statuses
        const completedStatuses = ['accepted', 'declined', 'expired'];
        let completedItems = allData.filter(item => 
          item.quote && completedStatuses.includes(item.quote.status)
        );
        
        // Sub-filter by status
        if (subFilter !== "all") {
          completedItems = completedItems.filter(item => item.quote?.status === subFilter);
        }
        return completedItems;
      
      case "jobs":
        // Items with jobs and/or invoices
        return allData.filter(item => item.job || item.invoice);
      
      case "archived":
        // Completed/cancelled bookings
        return allData.filter(item => ['completed', 'cancelled'].includes(item.booking.status));
      
      default:
        return allData;
    }
  }, [allData, activeTab, subFilter]);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!search) return filteredByTab;
    
    const searchLower = search.toLowerCase();
    return filteredByTab.filter(item => {
      const serviceName = (item.booking.payload?.service_name || item.booking.service_slug || '').toLowerCase();
      const customerName = (item.customer?.name || item.booking.payload?.name || '').toLowerCase();
      const customerEmail = (item.customer?.email || item.booking.payload?.email || '').toLowerCase();
      const quoteNumber = (item.quote?.number || '').toLowerCase();
      
      return serviceName.includes(searchLower) ||
             customerName.includes(searchLower) ||
             customerEmail.includes(searchLower) ||
             quoteNumber.includes(searchLower);
    });
  }, [filteredByTab, search]);

  // Calculate counts for badges
  const counts = useMemo(() => {
    return {
      requests: allData.filter(item => !item.quote && item.booking.status === 'new').length,
      active: allData.filter(item => 
        item.quote && ['draft', 'sent', 'viewed', 'change_requested'].includes(item.quote.status)
      ).length,
      draft: allData.filter(item => item.quote?.status === 'draft').length,
      sent: allData.filter(item => item.quote?.status === 'sent').length,
      viewed: allData.filter(item => item.quote?.status === 'viewed').length,
      change_requested: allData.filter(item => item.quote?.status === 'change_requested').length,
      completed: allData.filter(item => 
        item.quote && ['accepted', 'declined', 'expired'].includes(item.quote.status)
      ).length,
      accepted: allData.filter(item => item.quote?.status === 'accepted').length,
      declined: allData.filter(item => item.quote?.status === 'declined').length,
      expired: allData.filter(item => item.quote?.status === 'expired').length,
      jobs: allData.filter(item => item.job || item.invoice).length,
      archived: allData.filter(item => ['completed', 'cancelled'].includes(item.booking.status)).length,
    };
  }, [allData]);

  const handleCreateQuote = async (bookingId: string) => {
    const bookingItem = allData.find(d => d.booking.id === bookingId);
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
        const { data: existingCustomers } = await supabase
          .from('customers')
          .select('id')
          .ilike('email', customerEmail)
          .limit(1);
        
        if (existingCustomers && existingCustomers.length > 0) {
          customerId = existingCustomers[0].id;
        } else {
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
          
          const createdCustomer = await createCustomer(newCustomerData);
          customerId = createdCustomer.id;
          toast.success('Kund skapad automatiskt');
        }
      }

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

  const handleNewQuote = () => {
    setEditQuoteId(null);
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

  const handleViewPdf = async (quoteId: string) => {
    try {
      toast.loading('Genererar PDF med senaste designen...');
      const { data, error } = await supabase.functions.invoke('generate-pdf-from-quote', {
        body: { quoteId }
      });

      if (error) throw error;

      toast.dismiss();
      toast.success('PDF genererad!');
      
      console.log('Edge function response:', data);
      
      if (data?.pdfUrl) {
        console.log('Opening PDF:', data.pdfUrl);
        const newWindow = window.open(data.pdfUrl, '_blank');
        
        // Fallback om popup blockeras
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          toast.info('Öppnar PDF...');
          window.location.href = data.pdfUrl;
        }
      }
      
      refresh();
    } catch (error: any) {
      toast.dismiss();
      console.error('Error generating quote PDF:', error);
      toast.error('Kunde inte generera PDF');
    }
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
    const item = allData.find(d => d.quote?.id === quoteId);
    if (!item?.quote) return;

    const publicUrl = `${window.location.origin}/q/${item.quote.number}/${item.quote.public_token}`;
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Länk kopierad!');
  };

  const handleCopyInvoiceLink = async (invoiceId: string) => {
    const item = allData.find(d => d.invoice?.id === invoiceId);
    if (!item?.invoice || !(item.invoice as any).public_token) {
      toast.error('Ingen publik token finns för denna faktura');
      return;
    }

    const publicUrl = `${window.location.origin}/invoice/${(item.invoice as any).public_token}`;
    await navigator.clipboard.writeText(publicUrl);
    toast.success('Fakturalänk kopierad!');
  };

  const handleCreateJob = async (quoteId: string) => {
    const item = allData.find(d => d.quote?.id === quoteId);
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
    const item = allData.find(d => d.job?.id === jobId);
    if (!item || !item.job) {
      toast.error('Kunde inte hitta jobb');
      return;
    }

    const jobData = {
      id: item.job.id,
      title: (item.job as any).title || item.booking.service_slug || 'Ej angivet',
      customer_id: customerId,
      customer: item.customer ? {
        id: customerId,
        name: item.customer.name,
        email: item.customer.email,
        phone: item.customer.phone
      } : item.booking.payload ? {
        id: customerId,
        name: item.booking.payload.name || item.booking.payload.contact_name || 'Okänd',
        email: item.booking.payload.email || item.booking.payload.contact_email,
        phone: item.booking.payload.phone || item.booking.payload.contact_phone
      } : undefined,
      totalHours: item.totalHours || 0,
      hourlyRate: (item.job as any).hourly_rate || 950,
      totalMaterialCost: item.totalMaterialCost || 0,
      totalExpenses: item.totalExpenses || 0,
      pricing_mode: (item.job as any).pricing_mode,
      fixed_price: (item.job as any).fixed_price
    };

    setAdvancedInvoiceJobData(jobData);
    setAdvancedInvoiceOpen(true);
  };

  const handleCreateInvoiceSubmit = async (invoicePayload: any) => {
    try {
      const { data: invoiceData, error } = await supabase.functions.invoke('create-invoice-from-job', {
        body: invoicePayload
      });

      if (error) throw error;

      toast.success('Faktura skapad!');
      setAdvancedInvoiceOpen(false);
      setAdvancedInvoiceJobData(null);
      refresh();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      throw error;
    }
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

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const setSubFilterParam = (status: string) => {
    setSearchParams({ tab: activeTab, status });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBack />
          <h1 className="text-3xl font-bold mt-2">Offerter & Jobb</h1>
          <p className="text-muted-foreground">Hantera hela arbetsflödet från förfrågan till faktura</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewQuote}>
            <Plus className="h-4 w-4 mr-2" />
            Ny offert
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/quotes/trash')}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Papperskorg
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="requests">
            Förfrågningar {counts.requests > 0 && <Badge variant="secondary" className="ml-2">{counts.requests}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="active">
            Aktiva offerter {counts.active > 0 && <Badge variant="secondary" className="ml-2">{counts.active}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Avslutade {counts.completed > 0 && <Badge variant="secondary" className="ml-2">{counts.completed}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="jobs">
            Jobb & Fakturor {counts.jobs > 0 && <Badge variant="secondary" className="ml-2">{counts.jobs}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="archived">
            Arkiv {counts.archived > 0 && <Badge variant="secondary" className="ml-2">{counts.archived}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* Sub-filters for Active quotes */}
        {activeTab === "active" && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={subFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("all")}
            >
              Alla ({counts.active})
            </Button>
            <Button
              variant={subFilter === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("draft")}
            >
              Utkast ({counts.draft})
            </Button>
            <Button
              variant={subFilter === "sent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("sent")}
            >
              Skickade ({counts.sent})
            </Button>
            <Button
              variant={subFilter === "viewed" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("viewed")}
            >
              Visade ({counts.viewed})
            </Button>
            <Button
              variant={subFilter === "change_requested" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("change_requested")}
            >
              Ändring begärd ({counts.change_requested})
            </Button>
          </div>
        )}

        {/* Sub-filters for Completed quotes */}
        {activeTab === "completed" && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={subFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("all")}
            >
              Alla ({counts.completed})
            </Button>
            <Button
              variant={subFilter === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("accepted")}
            >
              Accepterade ({counts.accepted})
            </Button>
            <Button
              variant={subFilter === "declined" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("declined")}
            >
              Avvisade ({counts.declined})
            </Button>
            <Button
              variant={subFilter === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setSubFilterParam("expired")}
            >
              Utgångna ({counts.expired})
            </Button>
          </div>
        )}

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök förfrågningar, kunder, offertnummer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Inga poster att visa</p>
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
                onCopyInvoiceLink={handleCopyInvoiceLink}
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
        quoteData={allData.find(d => d.quote?.id === selectedQuoteId)?.quote}
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
            setBookingDataForQuote(null);
            setEditQuoteId(null);
          }
        }}
        quote={editQuoteId ? allData.find(d => d.quote?.id === editQuoteId)?.quote as any : null}
        bookingData={bookingDataForQuote}
        onSuccess={() => {
          setQuoteModalOpen(false);
          setBookingDataForQuote(null);
          setEditQuoteId(null);
          refresh();
        }}
      />

      <AdvancedInvoiceEditor
        open={advancedInvoiceOpen}
        onOpenChange={setAdvancedInvoiceOpen}
        jobData={advancedInvoiceJobData}
        onCreateInvoice={handleCreateInvoiceSubmit}
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
