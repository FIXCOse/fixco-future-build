import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Receipt, Plus, Eye, Download, Send, FileText, CheckCircle } from 'lucide-react';
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
          customer:profiles!invoices_customer_id_fkey(first_name, last_name, email),
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

  // Hämta accepterade offerter som inte har fakturor än
  const { data: availableQuotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['available-quotes-for-invoice'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          customer:profiles!quotes_customer_id_fkey(first_name, last_name, email),
          invoices:invoices!invoices_quote_id_fkey(id)
        `)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const createInvoiceFromQuote = async (quote: any) => {
    setCreatingInvoice(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { quoteId: quote.id }
      });

      if (error) throw error;
      
      if (data?.success) {
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

  const availableQuotesFiltered = ((availableQuotes as any[]) || []).filter((q: any) => !q.invoices || q.invoices.length === 0);

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

      {/* Dialog för att välja offert */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Skapa faktura från offert</DialogTitle>
            <DialogDescription>
              Välj en accepterad offert att skapa faktura från. Endast offerter som inte redan har fakturor visas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {quotesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : availableQuotesFiltered.length > 0 ? (
              <div className="space-y-3">
                {availableQuotesFiltered.map((quote) => (
                  <Card 
                    key={quote.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => createInvoiceFromQuote(quote)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accepterad
                            </Badge>
                            <h3 className="font-medium">{quote.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {quote.quote_number}
                            </div>
                            <div>
                              Kund: {quote.customer ? 
                                `${quote.customer.first_name} ${quote.customer.last_name}` : 
                                'Okänd kund'
                              }
                            </div>
                            <div>
                              {quote.total_amount?.toLocaleString()} SEK
                            </div>
                          </div>
                          {quote.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {quote.description.length > 100 
                                ? `${quote.description.substring(0, 100)}...`
                                : quote.description
                              }
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="default" 
                          disabled={creatingInvoice}
                          onClick={(e) => {
                            e.stopPropagation();
                            createInvoiceFromQuote(quote);
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
                  Inga accepterade offerter tillgängliga för fakturering
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Acceptera offerter först för att kunna skapa fakturor från dem
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
                             {invoice.customer?.first_name && invoice.customer?.last_name
                               ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
                               : invoice.customer?.email || 'Okänd kund'
                             }
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
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