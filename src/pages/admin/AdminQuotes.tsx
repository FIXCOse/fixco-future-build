import { useCallback, useState, useEffect } from "react";
import { fetchQuotes } from "@/lib/api/quotes";
import { useQuotesRealtime } from "@/hooks/useQuotesRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye, Edit, Download, Send, Plus } from "lucide-react";
import type { QuoteRow } from "@/lib/api/quotes";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const loadQuotes = useCallback(async () => {
    try {
      const params: any = {};
      if (statusFilter !== "all") {
        params.status = [statusFilter];
      }
      if (searchTerm) {
        params.q = searchTerm;
      }
      const { data } = await fetchQuotes(params);
      console.log('Loaded quotes:', data?.length || 0, 'quotes');
      setQuotes(data as any);
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useQuotesRealtime(loadQuotes);
  
  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Utkast',
      sent: 'Skickad',
      accepted: 'Accepterad',
      rejected: 'Avvisad'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Offert borttagen');
      loadQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Kunde inte ta bort offert');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus as any })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status uppdaterad');
      loadQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const handleViewQuote = (quote: QuoteRow) => {
    navigate(`/admin/quotes/${quote.id}`);
  };

  const handleEditQuote = (quote: QuoteRow) => {
    navigate(`/admin/quotes/${quote.id}/edit`);
  };

  const handleDownloadPDF = async (quote: QuoteRow) => {
    try {
      toast.info('PDF-generering startar...');
      // TODO: Implement PDF generation
      console.log('Downloading PDF for quote:', quote.id);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Kunde inte ladda ner PDF');
    }
  };

  const handleSendQuote = async (quote: QuoteRow) => {
    try {
      const customerEmail = quote.customer?.email;
      const customerName = `${quote.customer?.first_name || ''} ${quote.customer?.last_name || ''}`.trim();
      
      if (!customerEmail) {
        toast.error('Ingen e-postadress finns för kunden');
        return;
      }

      toast.info('Skickar e-post...');
      
      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          quoteId: quote.id,
          customerEmail: customerEmail,
          customerName: customerName || undefined
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success('Offert skickad via e-post!');
        loadQuotes();
      } else {
        throw new Error(data?.error || 'Okänt fel vid skickning av e-post');
      }
    } catch (error: any) {
      console.error('Error sending quote:', error);
      toast.error(error.message || 'Kunde inte skicka offert');
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.title?.toLowerCase().includes(searchLower) ||
      quote.quote_number?.toLowerCase().includes(searchLower) ||
      quote.customer?.first_name?.toLowerCase().includes(searchLower) ||
      quote.customer?.last_name?.toLowerCase().includes(searchLower) ||
      quote.customer?.email?.toLowerCase().includes(searchLower)
    );
  });

  const quoteCounts = {
    all: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length,
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Offerter</h1>
            <p className="text-muted-foreground mt-2">
              Hantera alla offerter från systemet
            </p>
          </div>
          <Button onClick={() => navigate('/admin/quotes/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Ny offert
          </Button>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Alla ({quoteCounts.all})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Utkast ({quoteCounts.draft})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Skickade ({quoteCounts.sent})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepterade ({quoteCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Avvisade ({quoteCounts.rejected})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 mb-6">
          <Input
            placeholder="Sök offerter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <TabsContent value={statusFilter}>
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga offerter hittades" : "Inga offerter ännu"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {quote.title}
                        </CardTitle>
                        <CardDescription>
                          Kund: {quote.customer?.first_name} {quote.customer?.last_name} ({quote.customer?.email})
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={quote.status} onValueChange={(value) => handleStatusChange(quote.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Utkast</SelectItem>
                            <SelectItem value="sent">Skickad</SelectItem>
                            <SelectItem value="accepted">Accepterad</SelectItem>
                            <SelectItem value="rejected">Avvisad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Offertnummer</p>
                        <p className="text-muted-foreground">
                          {quote.quote_number}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Totalt belopp</p>
                        <p className="text-muted-foreground">
                          {quote.total_amount ? `${quote.total_amount.toLocaleString()} SEK` : 'Ej angivet'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Giltig till</p>
                        <p className="text-muted-foreground">
                          {quote.valid_until ? format(new Date(quote.valid_until), 'PPP', { locale: sv }) : 'Ej angivet'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Skapad</p>
                        <p className="text-muted-foreground">
                          {format(new Date(quote.created_at), 'PPP', { locale: sv })}
                        </p>
                      </div>
                    </div>
                    
                    {quote.description && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">Beskrivning:</p>
                        <p className="text-sm text-muted-foreground mt-1">{quote.description}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button size="sm" onClick={() => handleViewQuote(quote)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Visa detaljer
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditQuote(quote)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Redigera
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadPDF(quote)}>
                        <Download className="h-4 w-4 mr-1" />
                        Ladda ner PDF
                      </Button>
                      {quote.status === 'draft' && (
                        <Button size="sm" onClick={() => handleSendQuote(quote)}>
                          <Send className="h-4 w-4 mr-1" />
                          Skicka offert
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Ta bort
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Detta kommer att ta bort offerten permanent. Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteQuote(quote.id)}>
                              Ta bort
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}