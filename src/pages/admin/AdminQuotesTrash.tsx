import { useCallback, useState, useEffect } from "react";
import { fetchQuotesNew, restoreQuoteNew, permanentlyDeleteQuoteNew, emptyQuotesTrash, type QuoteNewRow } from "@/lib/api/quotes-new";
import { useQuotesRealtime } from "@/hooks/useQuotesRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { toast } from "sonner";
import { Trash2, RotateCcw, Trash } from "lucide-react";

export default function AdminQuotesTrash() {
  const [quotes, setQuotes] = useState<QuoteNewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadQuotes = useCallback(async () => {
    try {
      const { data } = await fetchQuotesNew({ 
        includeDeleted: true 
      });
      // Filter to only show deleted quotes
      const deletedQuotes = data.filter((q: any) => q.deleted_at !== null);
      setQuotes(deletedQuotes);
    } catch (error) {
      console.error("Error loading deleted quotes:", error);
      toast.error('Kunde inte ladda raderade offerter');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  useQuotesRealtime(() => {
    loadQuotes();
  });

  const handleRestoreQuote = async (id: string) => {
    try {
      await restoreQuoteNew(id);
      toast.success('Offert återställd');
      loadQuotes();
    } catch (error) {
      console.error('Error restoring quote:', error);
      toast.error('Kunde inte återställa offert');
    }
  };

  const handlePermanentlyDeleteQuote = async (id: string) => {
    try {
      await permanentlyDeleteQuoteNew(id);
      toast.success('Offert permanent raderad');
      loadQuotes();
    } catch (error) {
      console.error('Error permanently deleting quote:', error);
      toast.error('Kunde inte radera offert permanent');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const count = await emptyQuotesTrash();
      toast.success(`${count} offerter raderade permanent`);
      loadQuotes();
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
    }
  };

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

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Papperskorg - Offerter</h1>
            <p className="text-muted-foreground mt-2">
              Raderade offerter ({quotes.length})
            </p>
          </div>
          {quotes.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Töm papperskorg
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Detta kommer att permanent radera alla offerter i papperskorgen. Denna åtgärd kan inte ångras.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEmptyTrash}>
                    Töm papperskorg
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Sök offerter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

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
              {searchTerm ? "Inga offerter hittades" : "Papperskorgen är tom"}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
                    <p className="font-medium">Raderad</p>
                    <p className="text-muted-foreground">
                      {(quote as any).deleted_at ? format(new Date((quote as any).deleted_at), 'PPP', { locale: sv }) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Skapad</p>
                    <p className="text-muted-foreground">
                      {format(new Date(quote.created_at), 'PPP', { locale: sv })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleRestoreQuote(quote.id)}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Återställ
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Ta bort permanent
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Detta kommer att permanent radera offerten. Denna åtgärd kan inte ångras.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handlePermanentlyDeleteQuote(quote.id)}>
                          Ta bort permanent
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
    </div>
  );
}
