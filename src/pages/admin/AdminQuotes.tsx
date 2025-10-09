import { useCallback, useState, useEffect } from "react";
import { fetchQuotesNew, deleteQuoteNew, type QuoteNewRow } from "@/lib/api/quotes-new";
import { useQuotesRealtime } from "@/hooks/useQuotesRealtime";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Copy, Mail, MessageSquare } from "lucide-react";
import { QuoteFormModal } from "@/components/admin/QuoteFormModal";
import { supabase } from "@/integrations/supabase/client";

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteNewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteNewRow | null>(null);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const loadQuotes = useCallback(async () => {
    try {
      const params: any = {};
      
      if (statusFilter !== "all") {
        params.status = [statusFilter];
      }
      
      if (searchTerm) {
        params.q = searchTerm;
      }
      const { data } = await fetchQuotesNew(params);
      setQuotes(data || []);
    } catch (error) {
      console.error("Error loading quotes:", error);
      toast.error('Kunde inte ladda offerter');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);
  
  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  // Realtime updates
  useQuotesRealtime(() => {
    loadQuotes();
  });

  // Handle new quote highlight
  useEffect(() => {
    const newId = searchParams.get('new');
    if (newId && quotes.some(q => q.id === newId)) {
      setHighlightedId(newId);
      setTimeout(() => {
        const element = document.getElementById(`quote-${newId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      setTimeout(() => setHighlightedId(null), 3000);
    }
  }, [searchParams, quotes]);

  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Utkast',
      sent: 'Skickad',
      viewed: 'Visad',
      change_requested: 'Ändring begärd',
      accepted: 'Accepterad',
      declined: 'Avvisad',
      expired: 'Utgången'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-300';
      case 'viewed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-300';
      case 'change_requested':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300';
      case 'expired':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      await deleteQuoteNew(id);
      toast.success('Offert raderad');
      loadQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Kunde inte ta bort offert');
    }
  };

  const handleEditQuote = (quote: QuoteNewRow) => {
    setSelectedQuote(quote);
    setModalOpen(true);
  };

  const handleNewQuote = () => {
    setSelectedQuote(null);
    setModalOpen(true);
  };

  const handleCopyPublicLink = (token: string) => {
    const url = `${window.location.origin}/q/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Publik länk kopierad!');
  };

  const handleSendQuote = async (quote: QuoteNewRow) => {
    try {
      const { error } = await supabase.functions.invoke('send-quote-email-new', {
        body: {
          quoteId: quote.id,
          customerEmail: quote.customer?.email,
          customerName: quote.customer?.name
        }
      });

      if (error) throw error;

      toast.success('Offert skickad!');
      loadQuotes();
    } catch (error: any) {
      console.error('Error sending quote:', error);
      toast.error(error.message || 'Kunde inte skicka offert');
    }
  };

  const handleViewMessages = async (quote: QuoteNewRow) => {
    try {
      const { data, error } = await supabase
        .from('quote_messages')
        .select('*')
        .eq('quote_id', quote.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
      setSelectedQuote(quote);
      setMessagesModalOpen(true);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast.error('Kunde inte ladda meddelanden');
    }
  };


  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.title?.toLowerCase().includes(searchLower) ||
      quote.number?.toLowerCase().includes(searchLower) ||
      quote.customer?.name?.toLowerCase().includes(searchLower) ||
      quote.customer?.email?.toLowerCase().includes(searchLower)
    );
  });

  const quoteCounts = {
    all: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    viewed: quotes.filter(q => q.status === 'viewed').length,
    change_requested: quotes.filter(q => q.status === 'change_requested').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    declined: quotes.filter(q => q.status === 'declined').length,
    expired: quotes.filter(q => q.status === 'expired').length,
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
          <Button onClick={handleNewQuote}>
            <Plus className="h-4 w-4 mr-2" />
            Ny offert
          </Button>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8">
          <TabsTrigger value="all">Alla ({quoteCounts.all})</TabsTrigger>
          <TabsTrigger value="draft">Utkast ({quoteCounts.draft})</TabsTrigger>
          <TabsTrigger value="sent">Skickade ({quoteCounts.sent})</TabsTrigger>
          <TabsTrigger value="viewed">Visade ({quoteCounts.viewed})</TabsTrigger>
          <TabsTrigger value="change_requested">Ändring ({quoteCounts.change_requested})</TabsTrigger>
          <TabsTrigger value="accepted">Accepterade ({quoteCounts.accepted})</TabsTrigger>
          <TabsTrigger value="declined">Avvisade ({quoteCounts.declined})</TabsTrigger>
          <TabsTrigger value="expired">Utgångna ({quoteCounts.expired})</TabsTrigger>
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
                <Card 
                  key={quote.id}
                  id={`quote-${quote.id}`}
                  className={highlightedId === quote.id ? 'ring-2 ring-primary' : ''}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {quote.title}
                        </CardTitle>
                        <CardDescription>
                          Kund: {quote.customer?.name || 'Okänd'} 
                          {quote.customer?.email && ` (${quote.customer.email})`}
                        </CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusDisplayName(quote.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Offertnummer</p>
                        <p className="text-muted-foreground">{quote.number}</p>
                      </div>
                      <div>
                        <p className="font-medium">Totalt belopp</p>
                        <p className="text-muted-foreground">
                          {quote.total_sek.toLocaleString()} kr
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Giltig till</p>
                        <p className="text-muted-foreground">
                          {quote.valid_until ? format(new Date(quote.valid_until), 'PPP', { locale: sv }) : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Skapad</p>
                        <p className="text-muted-foreground">
                          {format(new Date(quote.created_at), 'PPP', { locale: sv })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditQuote(quote)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Redigera
                      </Button>
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => handleSendQuote(quote)}
                        disabled={quote.status !== 'draft'}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Skicka
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCopyPublicLink(quote.public_token)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Kopiera publik länk
                      </Button>
                      {quote.status === 'change_requested' && (
                        <Button size="sm" variant="secondary" onClick={() => handleViewMessages(quote)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Meddelanden
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

      <QuoteFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        quote={selectedQuote}
        onSuccess={() => loadQuotes()}
      />

      <Dialog open={messagesModalOpen} onOpenChange={setMessagesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Meddelanden från kund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Inga meddelanden</p>
            ) : (
              messages.map((msg) => (
                <Card key={msg.id}>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-2">{msg.message}</p>
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.files.map((fileUrl: string, idx: number) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(fileUrl, '_blank')}
                          >
                            Bilaga {idx + 1}
                          </Button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(msg.created_at), 'PPP HH:mm', { locale: sv })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}