import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ArrowLeft, FileText, Edit, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { BookingRow } from '@/lib/api/bookings';

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.log('[BookingDetail] No ID provided');
      return;
    }

    console.log('[BookingDetail] Fetching booking:', id);

    const fetchBooking = async () => {
      try {
        console.log('[BookingDetail] Starting fetch...');
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        console.log('[BookingDetail] Query result:', { data, error });

        if (error) {
          console.error('[BookingDetail] Query error:', error);
          throw error;
        }
        
        if (!data) {
          console.warn('[BookingDetail] No booking found');
          toast.error('Bokning hittades inte');
          navigate('/admin/bookings');
          return;
        }

        console.log('[BookingDetail] Raw booking data:', data);
        console.log('[BookingDetail] Payload:', data.payload);

        // Extract data from payload and merge with top-level fields
        const payload = (data.payload || {}) as Record<string, any>;
        const enrichedData = {
          ...data,
          service_name: payload.service_name || payload.serviceName || data.service_slug,
          service_id: payload.service_id || data.service_slug,
          description: payload.description || payload.beskrivning || '',
          address: payload.address || payload.adress || '',
          city: payload.city || payload.stad || '',
          postal_code: payload.postal_code || payload.postnummer || '',
          name: payload.name || payload.namn || payload.contact_name || '',
          email: payload.email || payload.epost || payload.contact_email || '',
          phone: payload.phone || payload.telefon || payload.contact_phone || '',
          price_type: payload.price_type || payload.priceType || 'hourly',
          hourly_rate: payload.hourly_rate || payload.hourlyRate || 0,
          hours_estimated: payload.hours_estimated || payload.hoursEstimated || 0,
          rot_rut_type: payload.rot_rut_type || payload.rotRutType || '',
          internal_notes: payload.internal_notes || payload.internalNotes || '',
          images: payload.images || [],
        };
        
        console.log('[BookingDetail] Enriched data:', enrichedData);
        setBooking(enrichedData as any);
      } catch (error) {
        console.error('[BookingDetail] Fetch error:', error);
        toast.error('Kunde inte ladda bokning');
        navigate('/admin/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleCreateQuote = () => {
    if (!booking) return;
    navigate('/admin/quotes/new', {
      state: {
        fromBooking: booking,
        customer_id: booking.customer_id,
        service_name: booking.service_name || booking.service_id,
        description: booking.description,
        address: booking.address,
        postal_code: booking.postal_code,
        city: booking.city
      }
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'in_progress':
        return 'outline';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Väntande',
      confirmed: 'Bekräftad',
      in_progress: 'Pågående',
      completed: 'Slutförd',
      cancelled: 'Avbokad'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p className="text-sm">Laddar bokning ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg font-semibold mb-2">Bokning hittades inte</p>
            <p className="text-sm text-muted-foreground mb-4">ID: {id}</p>
            <Button onClick={() => navigate('/admin/bookings')}>
              Tillbaka till bokningar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/admin/bookings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till bokningar
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bokningsdetaljer</h1>
            <p className="text-muted-foreground mt-2">
              Bokning #{booking.id.slice(0, 8)}
            </p>
          </div>
          <Badge variant={getStatusBadgeVariant(booking.status)}>
            {getStatusDisplayName(booking.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle>Tjänsteinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Tjänst</p>
              <p className="text-muted-foreground">{booking.service_name || booking.service_id}</p>
            </div>
            
            {booking.description && (
              <div>
                <p className="font-medium">Beskrivning</p>
                <p className="text-muted-foreground">{booking.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Pristyp</p>
                <p className="text-muted-foreground">
                  {booking.price_type === 'hourly' ? 'Per timme' : 
                   booking.price_type === 'fixed' ? 'Fast pris' : 
                   booking.price_type}
                </p>
              </div>
              <div>
                <p className="font-medium">Timpris</p>
                <p className="text-muted-foreground">
                  {booking.hourly_rate ? `${booking.hourly_rate} kr/h` : 'Ej angivet'}
                </p>
              </div>
            </div>

            {booking.hours_estimated && (
              <div>
                <p className="font-medium">Uppskattade timmar</p>
                <p className="text-muted-foreground">{booking.hours_estimated} h</p>
              </div>
            )}

            {booking.rot_rut_type && (
              <div>
                <p className="font-medium">ROT/RUT</p>
                <p className="text-muted-foreground">{booking.rot_rut_type.toUpperCase()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Kundinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Namn</p>
              <p className="text-muted-foreground">
                {booking.name || 
                 (booking.customer ? `${booking.customer.first_name} ${booking.customer.last_name}` : 'Ej angivet')}
              </p>
            </div>

            <div>
              <p className="font-medium">E-post</p>
              <p className="text-muted-foreground">{booking.email || 'Ej angiven'}</p>
            </div>

            <div>
              <p className="font-medium">Telefon</p>
              <p className="text-muted-foreground">{booking.phone || 'Ej angiven'}</p>
            </div>

            <div>
              <p className="font-medium">Adress</p>
              <p className="text-muted-foreground">
                {booking.address ? 
                  `${booking.address}, ${booking.postal_code} ${booking.city}` : 
                  'Ej angiven'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Internal Notes */}
        {booking.internal_notes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Interna anteckningar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{booking.internal_notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Attached Images */}
        {booking.images && booking.images.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Bifogade bilder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {booking.images.map((imageUrl: string, index: number) => (
                  <a
                    key={index}
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted hover:border-primary transition-colors"
                  >
                    <img
                      src={imageUrl}
                      alt={`Bifogad bild ${index + 1}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bokningsinformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-medium">Skapad</p>
                <p className="text-muted-foreground">
                  {format(new Date(booking.created_at), 'PPP', { locale: sv })}
                </p>
              </div>
              {booking.updated_at && (
                <div>
                  <p className="font-medium">Senast uppdaterad</p>
                  <p className="text-muted-foreground">
                    {format(new Date(booking.updated_at), 'PPP', { locale: sv })}
                  </p>
                </div>
              )}
              <div>
                <p className="font-medium">Källa</p>
                <p className="text-muted-foreground">
                  {booking.created_by ? 'Användare' : 'Gäst'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-2">
        <Button onClick={handleCreateQuote}>
          <FileText className="h-4 w-4 mr-2" />
          Skapa offert
        </Button>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Redigera bokning
        </Button>
      </div>
    </div>
  );
}