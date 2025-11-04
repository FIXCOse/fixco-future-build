import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Eye, Mail, Phone, MapPin, Calendar, TrendingUp, Building2, Home } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { fetchCustomers, fetchCustomerWithDetails, type Customer } from '@/lib/api/customers';
import { CustomerDetailModal } from '@/components/admin/CustomerDetailModal';
import { CustomerTypeFilter } from '@/components/admin/CustomerTypeFilter';
import { supabase } from '@/integrations/supabase/client';
import { useBookingsRealtime } from '@/hooks/useBookingsRealtime';
import { useQuotesRealtime } from '@/hooks/useQuotesRealtime';

type CustomerType = 'all' | 'private' | 'company' | 'brf';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { data: customers, isLoading, refetch: refetchCustomers } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: fetchCustomers,
  });

  const { data: customerDetails, refetch: refetchCustomerDetails } = useQuery({
    queryKey: ['customer-details', selectedCustomerId],
    queryFn: () => selectedCustomerId ? fetchCustomerWithDetails(selectedCustomerId) : null,
    enabled: !!selectedCustomerId,
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['customer-stats'],
    queryFn: async () => {
      const [customersCount, bookingsCount, quotesCount, revenueData] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('quotes_new').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('total_spent')
      ]);

      const totalRevenue = revenueData.data?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0;

      return {
        totalCustomers: customersCount.count || 0,
        totalBookings: bookingsCount.count || 0,
        totalQuotes: quotesCount.count || 0,
        totalRevenue
      };
    }
  });

  // Realtime updates
  const handleRealtimeUpdate = useCallback(() => {
    refetchCustomers();
    refetchStats();
    if (selectedCustomerId) {
      refetchCustomerDetails();
    }
  }, [refetchCustomers, refetchStats, refetchCustomerDetails, selectedCustomerId]);

  useBookingsRealtime(handleRealtimeUpdate);
  useQuotesRealtime(handleRealtimeUpdate);

  // Calculate counts per type
  const customerCounts = {
    all: customers?.length || 0,
    private: customers?.filter(c => c.customer_type === 'private' || !c.customer_type).length || 0,
    company: customers?.filter(c => c.customer_type === 'company').length || 0,
    brf: customers?.filter(c => c.customer_type === 'brf').length || 0,
  };

  const filteredCustomers = customers?.filter(customer => {
    // Filter by customer type
    if (customerType !== 'all') {
      if (customerType === 'private' && customer.customer_type !== 'private' && customer.customer_type !== null) {
        return false;
      }
      if (customerType === 'company' && customer.customer_type !== 'company') {
        return false;
      }
      if (customerType === 'brf' && customer.customer_type !== 'brf') {
        return false;
      }
    }

    // Filter by search term
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.city?.toLowerCase().includes(search) ||
      customer.company_name?.toLowerCase().includes(search) ||
      customer.brf_name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kunder</h1>
          <p className="text-muted-foreground">Alla kunder som någonsin bokat en tjänst</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalCustomers || 0}</p>
                <p className="text-sm text-muted-foreground">Totala kunder</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
                <p className="text-sm text-muted-foreground">Bokningar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Mail className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalQuotes || 0}</p>
                <p className="text-sm text-muted-foreground">Offerter</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats?.totalRevenue || 0).toLocaleString()} kr</p>
                <p className="text-sm text-muted-foreground">Total omsättning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kundlista
              </CardTitle>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Sök namn, e-post, telefon, stad, företag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <CustomerTypeFilter
              value={customerType}
              onChange={setCustomerType}
              counts={customerCounts}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{customer.name}</h3>
                      
                      {/* Customer Type Badge */}
                      {customer.customer_type === 'company' && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          <Building2 className="h-3 w-3 mr-1" />
                          Företag
                        </Badge>
                      )}
                      {customer.customer_type === 'brf' && (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                          <Building2 className="h-3 w-3 mr-1" />
                          BRF
                        </Badge>
                      )}
                      {(customer.customer_type === 'private' || !customer.customer_type) && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <Home className="h-3 w-3 mr-1" />
                          Privat
                        </Badge>
                      )}
                      
                      {/* Booking Count Badge */}
                      {customer.booking_count && customer.booking_count > 0 && (
                        <Badge variant="secondary">
                          {customer.booking_count} {customer.booking_count === 1 ? 'bokning' : 'bokningar'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      )}
                      {customer.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {customer.city}
                        </div>
                      )}
                      {customer.last_booking_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Senaste bokning {formatDistanceToNow(new Date(customer.last_booking_at), { 
                            addSuffix: true, 
                            locale: sv 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{(customer.total_spent || 0).toLocaleString()} kr</p>
                    <p className="text-xs text-muted-foreground">
                      Kund sedan {new Date(customer.created_at).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">
                {searchTerm ? 'Inga kunder hittades' : 'Inga kunder än'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm 
                  ? 'Försök med en annan sökterm' 
                  : 'Kunder skapas automatiskt när någon bokar en tjänst'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDetailModal
        open={!!selectedCustomerId}
        onOpenChange={(open) => !open && setSelectedCustomerId(null)}
        customer={customerDetails?.customer || null}
        bookings={customerDetails?.bookings || []}
        quotes={customerDetails?.quotes || []}
      />
    </div>
  );
};

export default AdminCustomers;
