import { useCallback, useState, useEffect } from "react";
import { useQuoteRequestsRealtime } from "@/hooks/useQuoteRequestsRealtime";
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
import type { QuoteRequestRow } from "@/lib/api/quote-requests";

export default function AdminQuoteRequestsTrash() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadDeletedQuoteRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded deleted quote requests:', data?.length || 0, 'requests');
      setQuoteRequests(data as any);
    } catch (error) {
      console.error("Error loading deleted quote requests:", error);
      toast.error('Kunde inte ladda papperskorgen');
    } finally {
      setLoading(false);
    }
  }, []);

  useQuoteRequestsRealtime(loadDeletedQuoteRequests);
  
  useEffect(() => {
    loadDeletedQuoteRequests();
  }, [loadDeletedQuoteRequests]);

  const handleRestoreQuoteRequest = async (id: string) => {
    try {
      const { error } = await supabase.rpc('restore_quote_request', { p_quote_request_id: id });

      if (error) throw error;
      
      toast.success('Offertförfrågning återställd');
      loadDeletedQuoteRequests();
    } catch (error) {
      console.error('Error restoring quote request:', error);
      toast.error('Kunde inte återställa offertförfrågning');
    }
  };

  const handlePermanentlyDeleteQuoteRequest = async (id: string) => {
    try {
      const { error } = await supabase.rpc('permanently_delete_quote_request', { p_quote_request_id: id });

      if (error) throw error;
      
      toast.success('Offertförfrågning permanent raderad');
      loadDeletedQuoteRequests();
    } catch (error) {
      console.error('Error permanently deleting quote request:', error);
      toast.error('Kunde inte ta bort offertförfrågning permanent');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .not('deleted_at', 'is', null);

      if (error) throw error;
      
      toast.success('Papperskorgen tömd');
      loadDeletedQuoteRequests();
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
    }
  };

  const filteredQuoteRequests = quoteRequests.filter(request => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      request.service_name?.toLowerCase().includes(searchLower) ||
      (request.contact_name || request.name)?.toLowerCase().includes(searchLower) ||
      (request.contact_email || request.email)?.toLowerCase().includes(searchLower)
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
            <h1 className="text-3xl font-bold">Papperskorg - Offertförfrågningar</h1>
            <p className="text-muted-foreground mt-2">
              Raderade offertförfrågningar tas bort permanent efter 30 dagar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/quote-requests')}>
              Tillbaka
            </Button>
            {quoteRequests.length > 0 && (
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
                      Detta kommer att permanent radera alla offertförfrågningar i papperskorgen. Denna åtgärd kan inte ångras.
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
          placeholder="Sök offertförfrågningar..."
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
      ) : filteredQuoteRequests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? "Inga offertförfrågningar hittades" : "Papperskorgen är tom"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuoteRequests.map((request) => {
            const daysLeft = getDaysUntilDeletion(request.deleted_at!);
            return (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {request.service_name}
                      </CardTitle>
                      <CardDescription>
                        Kontakt: {request.contact_name || request.name} ({request.contact_email || request.email})
                      </CardDescription>
                      <CardDescription className="text-xs mt-2">
                        Raderad {formatDistanceToNow(new Date(request.deleted_at!), { addSuffix: true, locale: sv })}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-muted-foreground capitalize">{request.status}</p>
                    </div>
                    <div>
                      <p className="font-medium">Adress</p>
                      <p className="text-muted-foreground">
                        {request.address || 'Ej angivet'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Skapad</p>
                      <p className="text-muted-foreground">
                        {format(new Date(request.created_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="default" onClick={() => handleRestoreQuoteRequest(request.id)}>
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
                            Detta kommer att permanent radera offertförfrågningen. Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handlePermanentlyDeleteQuoteRequest(request.id)}>
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
