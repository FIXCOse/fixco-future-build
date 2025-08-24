import { useCallback, useState, useEffect } from "react";
import { fetchBookings } from "@/lib/api/bookings";
import { useBookingsRealtime } from "@/hooks/useBookingsRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import type { BookingRow } from "@/lib/api/bookings";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadBookings = useCallback(async () => {
    try {
      const params: any = {};
      if (statusFilter !== "all") {
        params.status = [statusFilter];
      }
      if (searchTerm) {
        params.q = searchTerm;
      }
      const { data } = await fetchBookings(params);
      console.log('Loaded bookings:', data?.length || 0, 'bookings');
      setBookings(data as any);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useBookingsRealtime(loadBookings);
  
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.service_id?.toLowerCase().includes(searchLower) ||
      booking.name?.toLowerCase().includes(searchLower) ||
      booking.email?.toLowerCase().includes(searchLower) ||
      booking.customer?.first_name?.toLowerCase().includes(searchLower) ||
      booking.customer?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  const bookingCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    in_progress: bookings.filter(b => b.status === 'in_progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bokningar</h1>
        <p className="text-muted-foreground mt-2">
          Hantera alla bokningar från kunder
        </p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Alla ({bookingCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Väntande ({bookingCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Bekräftade ({bookingCounts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            Pågående ({bookingCounts.in_progress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Slutförda ({bookingCounts.completed})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 mb-6">
          <Input
            placeholder="Sök bokningar..."
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
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga bokningar hittades" : "Inga bokningar ännu"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {booking.service_id}
                        </CardTitle>
                        <CardDescription>
                          Kund: {booking.name} ({booking.email})
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {getStatusDisplayName(booking.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Adress</p>
                        <p className="text-muted-foreground">
                          {booking.address ? `${booking.address}, ${booking.postal_code} ${booking.city}` : 'Ej angiven'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Pristyp</p>
                        <p className="text-muted-foreground">
                          {booking.price_type === 'hourly' ? 'Per timme' : booking.price_type === 'fixed' ? 'Fast pris' : booking.price_type}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Pris</p>
                        <p className="text-muted-foreground">
                          {booking.hourly_rate ? `${booking.hourly_rate} kr/h` : 'Ej angivet'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Skapad</p>
                        <p className="text-muted-foreground">
                          {format(new Date(booking.created_at), 'PPP', { locale: sv })}
                        </p>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm">Anteckningar:</p>
                        <p className="text-sm text-muted-foreground mt-1">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Visa detaljer</Button>
                      <Button size="sm" variant="outline">Skapa offert</Button>
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