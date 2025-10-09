import { useCallback, useState, useEffect } from "react";
import { fetchQuoteRequests } from "@/lib/api/quote-requests";
import { useQuoteRequestsRealtime } from "@/hooks/useQuoteRequestsRealtime";
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
import { Trash2, FileText, Mail } from "lucide-react";
import type { QuoteRequestRow } from "@/lib/api/quote-requests";

export default function AdminQuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const loadQuoteRequests = useCallback(async () => {
    try {
      const params: any = {};
      if (statusFilter !== "all") {
        params.status = [statusFilter];
      }
      if (searchTerm) {
        params.q = searchTerm;
      }
      const { data } = await fetchQuoteRequests(params);
      console.log('Loaded quote requests:', data?.length || 0, 'requests');
      setQuoteRequests(data as any);
    } catch (error) {
      console.error("Error loading quote requests:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useQuoteRequestsRealtime(loadQuoteRequests);
  
  useEffect(() => {
    loadQuoteRequests();
  }, [loadQuoteRequests]);

  const getStatusBadgeVariiant = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'quoted':
        return 'secondary';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      new: 'Ny',
      quoted: 'Offerterad', 
      accepted: 'Accepterad',
      rejected: 'Avvisad'
    };
    return statusMap[status] || status;
  };

  const handleDeleteQuoteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Offertförfrågning borttagen');
      loadQuoteRequests();
    } catch (error) {
      console.error('Error deleting quote request:', error);
      toast.error('Kunde inte ta bort offertförfrågning');
    }
  };

  const handleCreateQuote = (request: QuoteRequestRow) => {
    navigate('/admin/quotes/new', {
      state: {
        fromBooking: {
          ...request,
          type: 'quote_request'
        }
      }
    });
  };

  const handleContactCustomer = (request: QuoteRequestRow) => {
    const email = request.email || request.customer?.email;
    if (email) {
      const subject = `Angående din offertförfrågning - ${request.service_name || request.service_id}`;
      const body = `Hej ${request.name || request.customer?.first_name},\n\nTack för din offertförfrågning. Vi återkommer snart med mer information.\n\nMed vänliga hälsningar,\nFixco`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status uppdaterad');
      loadQuoteRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const filteredQuoteRequests = quoteRequests.filter(request => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      request.service_id?.toLowerCase().includes(searchLower) ||
      request.service_name?.toLowerCase().includes(searchLower) ||
      request.name?.toLowerCase().includes(searchLower) ||
      request.email?.toLowerCase().includes(searchLower) ||
      request.message?.toLowerCase().includes(searchLower) ||
      request.description?.toLowerCase().includes(searchLower) ||
      request.customer?.first_name?.toLowerCase().includes(searchLower) ||
      request.customer?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  const requestCounts = {
    all: quoteRequests.length,
    new: quoteRequests.filter(r => r.status === 'new').length,
    quoted: quoteRequests.filter(r => r.status === 'quoted').length,
    accepted: quoteRequests.filter(r => r.status === 'accepted').length,
    rejected: quoteRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Offertförfrågningar</h1>
        <p className="text-muted-foreground mt-2">
          Hantera alla offertförfrågningar från kunder
        </p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Alla ({requestCounts.all})
          </TabsTrigger>
          <TabsTrigger value="new">
            Nya ({requestCounts.new})
          </TabsTrigger>
          <TabsTrigger value="quoted">
            Offerterade ({requestCounts.quoted})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepterade ({requestCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Avvisade ({requestCounts.rejected})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 mb-6">
          <Input
            placeholder="Sök offertförfrågningar..."
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
          ) : filteredQuoteRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga offertförfrågningar hittades" : "Inga offertförfrågningar ännu"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredQuoteRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {request.service_name || request.service_id}
                        </CardTitle>
                        <CardDescription>
                          Kund: {request.name} ({request.email})
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={request.status} onValueChange={(value) => handleStatusChange(request.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Ny</SelectItem>
                            <SelectItem value="in_progress">Pågående</SelectItem>
                            <SelectItem value="completed">Slutförd</SelectItem>
                            <SelectItem value="cancelled">Avbruten</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      {request.address && (
                        <p className="text-muted-foreground">
                          📍 {request.address}, {request.postal_code} {request.city}
                        </p>
                      )}
                      {request.rot_rut_type && (
                        <p className="text-muted-foreground">
                          💰 {request.rot_rut_type}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        📅 {format(new Date(request.created_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                    
                    {(request.description || request.message) && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm">{request.description || request.message}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => handleCreateQuote(request)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Skapa offert
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleContactCustomer(request)}>
                        <Mail className="h-4 w-4 mr-1" />
                        Kontakta kund
                      </Button>
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
                              Detta kommer att ta bort offertförfrågningen permanent. Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteQuoteRequest(request.id)}>
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