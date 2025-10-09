import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  History, 
  Calendar, 
  MapPin, 
  Clock,
  DollarSign,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface BookingHistory {
  id: string;
  service_name: string;
  service_variant?: string;
  scheduled_date: string;
  scheduled_time_start?: string;
  scheduled_time_end?: string;
  final_price: number;
  status: string;
  description?: string;
  created_at: string;
  rot_eligible: boolean;
  rut_eligible: boolean;
  property?: {
    name: string;
    address: string;
    city: string;
  };
}

const HistoryPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadBookingHistory();
    }
  }, [user?.id]);

  const loadBookingHistory = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          service_name,
          service_variant,
          scheduled_date,
          scheduled_time_start,
          scheduled_time_end,
          final_price,
          status,
          description,
          created_at,
          rot_eligible,
          rut_eligible,
          property_id
        `)
        .eq('customer_id', user!.id)
        .in('status', ['completed', 'cancelled'])
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      // Note: New bookings structure doesn't have property_id directly
      // It's stored in payload if needed
      setBookings(data as any || []);
    } catch (error) {
      console.error('Error loading booking history:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda bokningshistorik",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookAgain = (booking: BookingHistory) => {
    // Navigate to booking page with prefilled data
    const params = new URLSearchParams({
      service: booking.service_name,
      variant: booking.service_variant || '',
      property: booking.property?.name || ''
    });
    
    window.location.href = `/boka-hembesok?${params.toString()}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Slutförd';
      case 'cancelled': return 'Avbruten';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property?.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const bookingDate = parseISO(booking.scheduled_date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          matchesDate = bookingDate >= lastMonth && bookingDate < new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last_3_months':
          const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          matchesDate = bookingDate >= last3Months;
          break;
        case 'last_year':
          const lastYear = new Date(now.getFullYear() - 1, 0, 1);
          matchesDate = bookingDate >= lastYear;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalSpent = filteredBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + booking.final_price, 0);

  const rotRutSavings = filteredBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => {
      let savings = 0;
      if (booking.rot_eligible) savings += booking.final_price * 0.3;
      if (booking.rut_eligible) savings += booking.final_price * 0.5;
      return sum + Math.min(savings, booking.final_price * 0.5); // Cap at 50% of total
    }, 0);

  if (!profile) {
    return <div>Laddar...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Historik | Mitt Fixco</title>
        <meta name="description" content="Se din bokningshistorik och tidigare tjänster" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <DashboardHeader profile={profile} />

        <div>
          <h2 className="text-2xl font-bold">Bokningshistorik</h2>
          <p className="text-muted-foreground">Se dina tidigare bokningar och tjänster</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totalt spenderat</p>
                  <p className="text-2xl font-bold">{totalSpent.toLocaleString('sv-SE')} kr</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ROT/RUT sparat</p>
                  <p className="text-2xl font-bold text-green-600">{rotRutSavings.toLocaleString('sv-SE')} kr</p>
                </div>
                <Badge className="h-8 w-8 p-0 flex items-center justify-center">%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slutförda tjänster</p>
                  <p className="text-2xl font-bold">{filteredBookings.filter(b => b.status === 'completed').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtrera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Sök tjänster, adresser..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla statusar</SelectItem>
                  <SelectItem value="completed">Slutförd</SelectItem>
                  <SelectItem value="cancelled">Avbruten</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tidsperiod" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla datum</SelectItem>
                  <SelectItem value="last_month">Senaste månaden</SelectItem>
                  <SelectItem value="last_3_months">Senaste 3 månaderna</SelectItem>
                  <SelectItem value="last_year">Senaste året</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Bokningar ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <History className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {bookings.length === 0 ? 'Ingen historik ännu' : 'Inga matchande bokningar'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {bookings.length === 0 
                    ? 'Dina slutförda bokningar kommer att visas här'
                    : 'Prova att ändra filter eller sökterm'
                  }
                </p>
                {bookings.length === 0 && (
                  <Link to="/boka-hembesok">
                    <Button>
                      Boka din första tjänst
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">
                          {booking.service_name}
                          {booking.service_variant && (
                            <span className="text-muted-foreground"> - {booking.service_variant}</span>
                          )}
                        </h3>
                        {booking.description && (
                          <p className="text-sm text-muted-foreground mt-1">{booking.description}</p>
                        )}
                      </div>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {format(parseISO(booking.scheduled_date), 'd MMM yyyy', { locale: sv })}
                        </span>
                      </div>

                      {booking.scheduled_time_start && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>
                            {booking.scheduled_time_start}
                            {booking.scheduled_time_end && ` - ${booking.scheduled_time_end}`}
                          </span>
                        </div>
                      )}

                      {booking.property && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span className="truncate">
                            {booking.property.name || `${booking.property.address}, ${booking.property.city}`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span className="font-medium">{booking.final_price.toLocaleString('sv-SE')} kr</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {booking.rot_eligible && (
                        <Badge variant="outline">ROT-berättigad</Badge>
                      )}
                      {booking.rut_eligible && (
                        <Badge variant="outline">RUT-berättigad</Badge>
                      )}
                    </div>

                    {booking.status === 'completed' && (
                      <div className="mt-4 pt-3 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBookAgain(booking)}
                          className="flex items-center"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Boka igen
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HistoryPage;