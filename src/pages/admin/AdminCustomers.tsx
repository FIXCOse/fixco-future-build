import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          bookings(count),
          invoices(count)
        `)
        .neq('role', 'owner')
        .neq('role', 'admin')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: customerStats } = useQuery({
    queryKey: ['customer-stats'],
    queryFn: async () => {
      const [totalBookings, totalRevenue] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('invoices').select('total_amount').eq('status', 'paid'),
      ]);

      const revenue = totalRevenue.data?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;

      return {
        totalCustomers: customers?.length || 0,
        totalBookings: totalBookings.count || 0,
        totalRevenue: revenue,
      };
    },
    enabled: !!customers,
  });

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'company': return { variant: 'secondary' as const, label: 'Företag' };
      case 'brf': return { variant: 'default' as const, label: 'BRF' };
      default: return { variant: 'outline' as const, label: 'Privat' };
    }
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kunder</h1>
          <p className="text-muted-foreground">Hantera alla kunder i systemet</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{customerStats?.totalCustomers || 0}</p>
                <p className="text-sm text-muted-foreground">Totala kunder</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{customerStats?.totalBookings || 0}</p>
                <p className="text-sm text-muted-foreground">Totala bokningar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{customerStats?.totalRevenue?.toLocaleString() || 0} SEK</p>
                <p className="text-sm text-muted-foreground">Total omsättning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Kunder
            </CardTitle>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök namn, e-post, telefon..."
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
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : customers && customers.length > 0 ? (
            <div className="space-y-4">
              {customers.map((customer) => {
                const userTypeBadge = getUserTypeBadge(customer.user_type || 'private');
                return (
                  <div key={customer.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {customer.first_name && customer.last_name
                            ? `${customer.first_name} ${customer.last_name}`
                            : customer.company_name || customer.email || 'Okänt namn'
                          }
                        </h3>
                        <Badge variant={userTypeBadge.variant}>
                          {userTypeBadge.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {customer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {customer.city}
                          </div>
                        )}
                        <span>
                          Medlem {formatDistanceToNow(new Date(customer.created_at), { 
                            addSuffix: true, 
                            locale: sv 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        <p className="font-medium">{customer.loyalty_points || 0} poäng</p>
                        <p className="text-muted-foreground">{customer.total_spent?.toLocaleString() || 0} SEK</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Inga kunder hittades' : 'Inga kunder att visa'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;