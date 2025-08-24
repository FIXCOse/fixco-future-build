import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Plus, Eye, Download, Send, Edit } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const AdminQuotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Real-time subscription for quote updates
  useEffect(() => {
    const channel = supabase
      .channel('quotes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        () => {
          // Invalidate and refetch quotes when any quote changes
          queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['admin-quotes', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          customer:profiles!quotes_customer_id_fkey(first_name, last_name, email),
          property:properties(address, city),
          booking:bookings(service_name)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`quote_number.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default' as const;
      case 'sent': return 'secondary' as const;
      case 'rejected': return 'destructive' as const;
      case 'draft': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'draft': return 'Utkast';
      case 'sent': return 'Skickad';
      case 'accepted': return 'Accepterad';
      case 'rejected': return 'Nekad';
      default: return status;
    }
  };

  const statusCounts = quotes?.reduce((acc, quote) => {
    acc[quote.status] = (acc[quote.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const acceptanceRate = quotes?.length 
    ? ((statusCounts.accepted || 0) / quotes.length * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Offerter</h1>
          <p className="text-muted-foreground">Hantera alla offerter i systemet</p>
        </div>
        <Link to="/admin/quotes/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ny offert
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quotes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Totala offerter</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.accepted || 0}</p>
                <p className="text-sm text-muted-foreground">Accepterade</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{acceptanceRate}%</p>
                <p className="text-sm text-muted-foreground">Acceptansgrad</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {quotes?.reduce((sum, q) => sum + (q.total_amount || 0), 0).toLocaleString() || 0} SEK
                </p>
                <p className="text-sm text-muted-foreground">Totalt värde</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Alla ({quotes?.length || 0})</TabsTrigger>
          <TabsTrigger value="draft">Utkast ({statusCounts.draft || 0})</TabsTrigger>
          <TabsTrigger value="sent">Skickade ({statusCounts.sent || 0})</TabsTrigger>
          <TabsTrigger value="accepted">Accepterade ({statusCounts.accepted || 0})</TabsTrigger>
          <TabsTrigger value="rejected">Nekade ({statusCounts.rejected || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Offerter
                </CardTitle>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Sök offertnummer, titel..."
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
              ) : quotes && quotes.length > 0 ? (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{quote.quote_number}</h3>
                          <Badge variant={getStatusBadgeVariant(quote.status)}>
                            {getStatusDisplayName(quote.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {quote.customer?.first_name && quote.customer?.last_name
                              ? `${quote.customer.first_name} ${quote.customer.last_name}`
                              : quote.customer?.email || 'Okänd kund'
                            }
                          </span>
                          <span>{quote.title}</span>
                          <span>{quote.total_amount?.toLocaleString()} SEK</span>
                          <span>
                            {formatDistanceToNow(new Date(quote.created_at), { 
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {quote.status === 'draft' && (
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
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Inga offerter hittades' : 'Inga offerter att visa'}
                  </p>
                  <Link to="/admin/quotes/new">
                    <Button className="mt-4 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Skapa första offerten
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminQuotes;