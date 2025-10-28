import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Receipt, Plus, Eye, Download, Send, FileText, CheckCircle, Trash2, TrendingUp, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminInvoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['admin-invoices', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          customer:customers!invoices_customer_id_fkey(id, name, email),
          booking:bookings(service_name),
          quote:quotes(quote_number, title)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`invoice_number.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Hämta statistik för fakturor
  const { data: invoiceStats } = useQuery({
    queryKey: ['invoice-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_invoice_statistics');
      if (error) throw error;
      return data;
    },
  });

  // Hämta slutförda jobb som inte har fakturor än
  const { data: availableJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['available-jobs-for-invoice'],
    queryFn: async () => {
      // Hämta jobb
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'completed')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      if (!jobs || jobs.length === 0) return [];
      
      // Hämta kundinformation separat
      const customerIds: string[] = [...new Set(jobs.map((j: any) => j.customer_id).filter(Boolean))];
      const { data: customers } = await supabase
        .from('customers')
        .select('id, name, email')
        .in('id', customerIds);
      
      const customerMap = new Map((customers || []).map((c: any) => [c.id, c]));
      
      // Lägg till kundinfo (enkel implementation utan filtrering av redan fakturerade)
      const jobsWithDetails = jobs.map((job: any) => ({
        ...job,
        customers: customerMap.get(job.customer_id) || { name: 'Okänd kund' }
      }));
      
      return jobsWithDetails;
    },
  });

  const createInvoiceFromJob = async (job: any) => {
    setCreatingInvoice(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-invoice-from-job', {
        body: { 
          jobId: job.id,
          customerId: job.customer_id
        }
      });

      if (error) throw error;
      
      if (data?.success || data?.invoice) {
        toast.success('Faktura skapad framgångsrikt!');
        setShowQuoteDialog(false);
        // Refresh invoices list
        window.location.reload();
      } else {
        throw new Error(data?.error || 'Kunde inte skapa faktura');
      }
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Kunde inte skapa faktura');
    } finally {
      setCreatingInvoice(false);
    }
  };

  // Åtgärder för fakturor
  const previewInvoice = async (invoice: any) => {
    try {
      if (invoice.pdf_url) {
        const { data, error } = await supabase.storage
          .from('invoices')
          .createSignedUrl(invoice.pdf_url, 60 * 60);
        if (error) throw error;
        if (data?.signedUrl) window.open(data.signedUrl, '_blank');
        return;
      }
      // Fallback: rendera enkel HTML-klientvy
      const win = window.open('', '_blank');
      if (win) {
        const items = (invoice.line_items || []).map((item: any) => {
          const qty = Number(item.quantity ?? 1);
          const unit = Number(item.unit_price ?? (item.amount != null ? Number(item.amount) / qty : 0));
          const total = Number(item.total_price ?? item.amount ?? unit * qty);
          return `<tr><td>${item.description || 'Arbete'}</td><td>${qty}</td><td style="text-align:right">${unit.toLocaleString('sv-SE')} kr</td><td style="text-align:right">${total.toLocaleString('sv-SE')} kr</td></tr>`;
        }).join('');
        win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${invoice.invoice_number}</title></head><body><h2>Faktura ${invoice.invoice_number}</h2><table style="width:100%;border-collapse:collapse" border="1"><thead><tr><th>Beskrivning</th><th>Antal</th><th>Enhetspris</th><th>Total</th></tr></thead><tbody>${items}</tbody></table><h3 style="text-align:right">Att betala: ${(Number(invoice.total_amount)||0).toLocaleString('sv-SE')} kr</h3></body></html>`);
        win.document.close();
      }
    } catch (e) {
      console.error(e);
      toast.error('Kunde inte förhandsvisa fakturan');
    }
  };

  const downloadInvoice = async (invoice: any) => {
    try {
      if (invoice.pdf_url) {
        const { data, error } = await supabase.storage
          .from('invoices')
          .createSignedUrl(invoice.pdf_url, 60 * 60);
        if (error) throw error;
        if (data?.signedUrl) {
          const a = document.createElement('a');
          a.href = data.signedUrl;
          a.download = `${invoice.invoice_number}.html`;
          a.click();
        }
        return;
      }
      // Fallback: ladda ner genererad HTML
      const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoice_number}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      toast.error('Kunde inte ladda ner faktura');
    }
  };

  const sendInvoice = async (invoice: any) => {
    try {
      toast.info('Skickar faktura...');
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: { invoiceId: invoice.id }
      });
      if (error) throw error;
      if (data?.success) {
        toast.success('Faktura skickad via e-post!');
      } else if (data?.previewHtml) {
        const win = window.open('', '_blank');
        if (win) { win.document.write(String(data.previewHtml)); win.document.close(); }
        toast.warning('Förhandsvisning öppnad (e-post ej skickad).');
      } else {
        toast.error(data?.error || 'Kunde inte skicka faktura');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Kunde inte skicka faktura');
    }
  };

  const markAsPaid = async (invoice: any) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid' as any, paid_at: new Date().toISOString() })
        .eq('id', invoice.id);
      if (error) throw error;
      toast.success('Fakturan markerad som betald');
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error('Kunde inte markera som betald');
    }
  };

  const deleteInvoice = async (invoice: any) => {
    if (!confirm(`Är du säker på att du vill radera faktura ${invoice.invoice_number}?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoice.id);
      if (error) throw error;
      toast.success('Faktura raderad');
      window.location.reload();
    } catch (e) {
      console.error(e);
      toast.error('Kunde inte radera faktura');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default' as const;
      case 'sent': return 'secondary' as const;
      case 'overdue': return 'destructive' as const;
      case 'draft': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'draft': return 'Utkast';
      case 'sent': return 'Skickad';
      case 'paid': return 'Betald';
      case 'overdue': return 'Förfallen';
      default: return status;
    }
  };

  const statusCounts = invoices?.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fakturor</h1>
          <p className="text-muted-foreground">Hantera alla fakturor i systemet</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowQuoteDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Ny faktura
        </Button>
      </div>

      {/* Statistics Overview */}
      {invoiceStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Totalt värde</p>
                <p className="text-lg font-bold">{parseInt((invoiceStats as any).paid_amount).toLocaleString()} SEK</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Väntande betalning</p>
                <p className="text-lg font-bold">{parseInt((invoiceStats as any).pending_amount).toLocaleString()} SEK</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Förfallna</p>
                <p className="text-lg font-bold">{parseInt((invoiceStats as any).overdue_amount).toLocaleString()} SEK</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Betalda</p>
                <p className="text-lg font-bold">{parseInt((invoiceStats as any).paid_count)} st</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dialog för att välja offert */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Skapa faktura från jobb</DialogTitle>
            <DialogDescription>
              Välj ett slutfört jobb att skapa faktura från. Endast slutförda jobb som inte redan har fakturor visas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {jobsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : availableJobs && availableJobs.length > 0 ? (
              <div className="space-y-3">
                {availableJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => createInvoiceFromJob(job)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Slutfört
                            </Badge>
                            <h3 className="font-medium">{job.title || 'Inget titel'}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Jobb ID: {job.id.substring(0, 8)}...
                            </div>
                            <div>
                              Kund: {job.customers ? job.customers.name : 'Okänd kund'}
                            </div>
                            <div>
                              {job.pricing_mode === 'fixed' && job.fixed_price ? 
                                `${job.fixed_price.toLocaleString()} SEK` : 
                                'Timpris'
                              }
                            </div>
                            <div className="text-xs">
                              Skapad: {new Date(job.created_at).toLocaleDateString('sv-SE')}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="default" 
                          disabled={creatingInvoice}
                          onClick={(e) => {
                            e.stopPropagation();
                            createInvoiceFromJob(job);
                          }}
                        >
                          {creatingInvoice ? 'Skapar...' : 'Skapa faktura'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Inga slutförda jobb tillgängliga för fakturering
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Slutför jobb först för att kunna skapa fakturor från dem
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Alla ({invoices?.length || 0})</TabsTrigger>
          <TabsTrigger value="draft">Utkast ({statusCounts.draft || 0})</TabsTrigger>
          <TabsTrigger value="sent">Skickade ({statusCounts.sent || 0})</TabsTrigger>
          <TabsTrigger value="overdue">Förfallna ({statusCounts.overdue || 0})</TabsTrigger>
          <TabsTrigger value="paid">Betalda ({statusCounts.paid || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Fakturor
                </CardTitle>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Sök fakturanummer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : invoices && invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Receipt className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{invoice.invoice_number}</h3>
                          <Badge variant={getStatusBadgeVariant(invoice.status)}>
                            {getStatusDisplayName(invoice.status)}
                          </Badge>
                        </div>
                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
                           <span>
                             {invoice.customer?.name || invoice.customer?.email || 'Okänd kund'}
                           </span>
                           <span>{invoice.total_amount?.toLocaleString()} SEK</span>
                           {invoice.quote && (
                             <span className="flex items-center gap-1">
                               <FileText className="h-3 w-3" />
                               Från offert {invoice.quote.quote_number}
                             </span>
                           )}
                           <span>
                             {formatDistanceToNow(new Date(invoice.created_at), { 
                               addSuffix: true, 
                               locale: sv 
                             })}
                           </span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => previewInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => downloadInvoice(invoice)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'paid' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => sendInvoice(invoice)}>
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => markAsPaid(invoice)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => deleteInvoice(invoice)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Inga fakturor hittades' : 'Inga fakturor att visa'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminInvoices;