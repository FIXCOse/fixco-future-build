import { useCallback, useState, useEffect } from "react";
import { fetchBookings } from "@/lib/api/bookings";
import { useBookingsRealtime } from "@/hooks/useBookingsRealtime";
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
import { Trash2, Eye, FileText } from "lucide-react";
import type { BookingRow } from "@/lib/api/bookings";

type BookingWithQuote = BookingRow & {
  hasQuote?: boolean;
  quoteId?: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingWithQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

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
      // Filter out deleted bookings
      const activeBookings = (data || []).filter((b: any) => !b.deleted_at);
      
      // Check if each booking has a quote (with comprehensive error handling)
      const bookingsWithQuotes = await Promise.all(
        activeBookings.map(async (booking) => {
          try {
            const { data: quote, error: quoteError } = await supabase
              .from('quotes_new')
              .select('id')
              .eq('request_id', booking.id)
              .maybeSingle();
            
            // Ignore query errors, just mark as no quote
            if (quoteError) {
              console.warn('Error checking quote for booking:', booking.id, quoteError.message);
              return {
                ...booking,
                hasQuote: false,
                quoteId: undefined
              } as BookingWithQuote;
            }
            
            return {
              ...booking,
              hasQuote: !!quote,
              quoteId: quote?.id
            } as BookingWithQuote;
          } catch (err) {
            console.warn('Exception checking quote for booking:', booking.id, err);
            return {
              ...booking,
              hasQuote: false,
              quoteId: undefined
            } as BookingWithQuote;
          }
        })
      );
      
      setBookings(bookingsWithQuotes);
    } catch (error) {
      console.error("Error loading bookings:", error);
      // Fallback: try to load bookings directly from supabase without quote checking
      try {
        const { data: fallbackData } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        
        const activeBookings = (fallbackData || [])
          .filter((b: any) => !b.deleted_at)
          .map(b => ({ ...b, hasQuote: false, quoteId: undefined } as BookingWithQuote));
        
        setBookings(activeBookings);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setBookings([]);
      }
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

  const handleDeleteBooking = async (id: string) => {
    try {
      // New bookings table doesn't have deleted_at, so we just delete
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Bokning raderad');
      loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Kunde inte ta bort bokning');
    }
  };

  const handleCreateQuote = (booking: BookingRow) => {
    navigate('/admin/quotes/new', { 
      state: { 
        fromBooking: {
          ...booking,
          type: 'booking'
        }
      }
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus as any })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status uppdaterad');
      loadBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.service_id?.toLowerCase().includes(searchLower) ||
      booking.service_name?.toLowerCase().includes(searchLower) ||
      booking.description?.toLowerCase().includes(searchLower) ||
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bokningar</h1>
            <p className="text-muted-foreground mt-2">
              Hantera alla bokningar från kunder
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/bookings/trash')}>
            <Trash2 className="h-4 w-4 mr-2" />
            Papperskorg
          </Button>
        </div>
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
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {booking.service_name || booking.service_id}
                        </CardTitle>
                        <CardDescription>
                          Kund: {booking.name} ({booking.email})
                          {(booking as any).mode && (
                            <Badge variant="outline" className="ml-2">
                              {(booking as any).mode === 'book' ? 'Bokning' : 'Offertförfrågan'}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={booking.status} onValueChange={(value) => handleStatusChange(booking.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Väntande</SelectItem>
                            <SelectItem value="confirmed">Bekräftad</SelectItem>
                            <SelectItem value="in_progress">Pågående</SelectItem>
                            <SelectItem value="completed">Slutförd</SelectItem>
                            <SelectItem value="cancelled">Avbokad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      {booking.address && (
                        <p className="text-muted-foreground">
                          📍 {booking.address}, {booking.postal_code} {booking.city}
                        </p>
                      )}
                      {booking.hourly_rate && (
                        <p className="text-muted-foreground">
                          💵 {booking.price_type === 'hourly' ? `${booking.hourly_rate} kr/h` : `${booking.hourly_rate} kr`}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        📅 {format(new Date(booking.created_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                    
                    {booking.description && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {(() => {
                            try {
                              const parsed = JSON.parse(booking.description);
                              return parsed.beskrivning || parsed.description || booking.description;
                            } catch {
                              return booking.description;
                            }
                          })()}
                        </p>
                      </div>
                    )}

                    {booking.internal_notes && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="font-medium text-sm">Interna anteckningar:</p>
                        <p className="text-sm text-muted-foreground mt-1">{booking.internal_notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Visa detaljer
                      </Button>
                      {booking.hasQuote ? (
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => navigate(`/admin/quotes/new?request=${booking.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Visa offert
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleCreateQuote(booking)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Skapa offert
                        </Button>
                      )}
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
                              Detta kommer att ta bort bokningen permanent. Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteBooking(booking.id)}>
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