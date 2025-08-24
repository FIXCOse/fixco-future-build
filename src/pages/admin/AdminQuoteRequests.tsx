import { useCallback, useState, useEffect } from "react";
import { fetchQuoteRequests } from "@/lib/api/quote-requests";
import { useQuoteRequestsRealtime } from "@/hooks/useQuoteRequestsRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import type { QuoteRequestRow } from "@/lib/api/quote-requests";

export default function AdminQuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const filteredQuoteRequests = quoteRequests.filter(request => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      request.service_id?.toLowerCase().includes(searchLower) ||
      request.name?.toLowerCase().includes(searchLower) ||
      request.email?.toLowerCase().includes(searchLower) ||
      request.message?.toLowerCase().includes(searchLower) ||
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
                      <div>
                        <CardTitle className="text-lg">
                          {request.service_id}
                        </CardTitle>
                        <CardDescription>
                          Kund: {request.customer?.first_name} {request.customer?.last_name} ({request.email})
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariiant(request.status)}>
                        {getStatusDisplayName(request.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="font-medium">Adress</p>
                        <p className="text-muted-foreground">
                          {request.address ? `${request.address}, ${request.postal_code} ${request.city}` : 'Ej angiven'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">ROT/RUT</p>
                        <p className="text-muted-foreground">
                          {request.rot_rut_type || 'Ej angivet'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Skapad</p>
                        <p className="text-muted-foreground">
                          {format(new Date(request.created_at), 'PPP', { locale: sv })}
                        </p>
                      </div>
                    </div>
                    
                    {request.message && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">Projektbeskrivning:</p>
                        <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Skapa offert</Button>
                      <Button size="sm" variant="outline">Kontakta kund</Button>
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