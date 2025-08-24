import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, Eye, FileText, MapPin, User } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          customer:profiles!bookings_customer_id_fkey(first_name, last_name, email, phone),
          property:properties(address, city, postal_code)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`service_name.ilike.%${searchTerm}%`);
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
      case 'confirmed': return 'default' as const;
      case 'pending': return 'secondary' as const;
      case 'in_progress': return 'default' as const;
      case 'completed': return 'default' as const;
      case 'cancelled': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending': return 'Väntande';
      case 'confirmed': return 'Bekräftad';
      case 'in_progress': return 'Pågående';
      case 'completed': return 'Avslutad';
      case 'cancelled': return 'Avbruten';
      default: return status;
    }
  };

  const statusCounts = bookings?.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bokningar</h1>
          <p className="text-muted-foreground">Hantera alla bokningar i systemet</p>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">Alla ({bookings?.length || 0})</TabsTrigger>
          <TabsTrigger value="pending">Väntande ({statusCounts.pending || 0})</TabsTrigger>
          <TabsTrigger value="confirmed">Bekräftade ({statusCounts.confirmed || 0})</TabsTrigger>
          <TabsTrigger value="in_progress">Pågående ({statusCounts.in_progress || 0})</TabsTrigger>
          <TabsTrigger value="completed">Avslutade ({statusCounts.completed || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Bokningar
                </CardTitle>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Sök tjänst, kund..."
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
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{booking.service_name}</h3>
                          <Badge variant={getStatusBadgeVariant(booking.status)}>
                            {getStatusDisplayName(booking.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>
                              {booking.customer?.first_name && booking.customer?.last_name
                                ? `${booking.customer.first_name} ${booking.customer.last_name}`
                                : booking.customer?.email || 'Okänd kund'
                              }
                            </span>
                          </div>
                          {booking.property && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.property.address}, {booking.property.city}</span>
                            </div>
                          )}
                          <span>{booking.base_price?.toLocaleString()} SEK</span>
                          <span>
                            {formatDistanceToNow(new Date(booking.created_at), { 
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
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                          Skapa offert
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Inga bokningar hittades' : 'Inga bokningar att visa'}
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

export default AdminBookings;