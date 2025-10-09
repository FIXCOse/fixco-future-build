import { useCallback, useState, useEffect } from "react";
import { fetchQuotes } from "@/lib/api/quotes";
import { useQuotesRealtime } from "@/hooks/useQuotesRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, RotateCcw } from "lucide-react";
import type { QuoteRow } from "@/lib/api/quotes";

export default function AdminQuotesTrash() {
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadDeletedQuotes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*, customer:profiles!quotes_customer_id_fkey(*)')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded deleted quotes:', data?.length || 0, 'quotes');
      setQuotes(data as any);
    } catch (error) {
      console.error("Error loading deleted quotes:", error);
      toast.error('Kunde inte ladda papperskorgen');
    } finally {
      setLoading(false);
    }
  }, []);

  useQuotesRealtime(loadDeletedQuotes);
  
  useEffect(() => {
    loadDeletedQuotes();
  }, [loadDeletedQuotes]);

  const handleRestoreQuote = async (id: string) => {
    try {
      const { error } = await supabase.rpc('restore_quote', { p_quote_id: id });

      if (error) throw error;
      
      toast.success('Offert återställd');
      loadDeletedQuotes();
    } catch (error) {
      console.error('Error restoring quote:', error);
      toast.error('Kunde inte återställa offert');
    }
  };

  const handlePermanentlyDeleteQuote = async (id: string) => {
    try {
      const { error } = await supabase.rpc('permanently_delete_quote', { p_quote_id: id });

      if (error) throw error;
      
      toast.success('Offert permanent raderad');
      loadDeletedQuotes();
    } catch (error) {
      console.error('Error permanently deleting quote:', error);
      toast.error('Kunde inte ta bort offert permanent');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const { data, error } = await supabase.rpc('empty_quotes_trash');

      if (error) throw error;
      
      toast.success(`${data || 0} offerter permanent raderade`);
      loadDeletedQuotes();
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
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

  const getDaysUntilDeletion = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const deletionDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deletionDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return daysLeft;
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Papperskorg - Offerter</h1>
            <p className="text-muted-foreground mt-2">
              Raderade offerter tas bort permanent efter 30 dagar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/quotes')}>
              Tillbaka till offerter
            </Button>
            {quotes.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
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
      </div>

      <div className="mt-4 mb-6">
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
          {filteredQuotes.map((quote) => {
            const daysLeft = getDaysUntilDeletion(quote.deleted_at!);
            return (
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
                      <CardDescription className="text-xs mt-2">
                        Raderad {formatDistanceToNow(new Date(quote.deleted_at!), { addSuffix: true, locale: sv })}
                        {daysLeft > 0 && (
                          <span className="ml-2 text-orange-600 font-medium">
                            • Raderas permanent om {daysLeft} dag{daysLeft !== 1 ? 'ar' : ''}
                          </span>
                        )}
                        {daysLeft <= 0 && (
                          <span className="ml-2 text-red-600 font-medium">
                            • Kommer att raderas inom kort
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="default" onClick={() => handleRestoreQuote(quote.id)}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Återställ
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Radera permanent
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
                            Radera permanent
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
