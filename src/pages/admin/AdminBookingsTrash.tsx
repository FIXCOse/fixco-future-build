import { useCallback, useState, useEffect } from "react";
import { useBookingsRealtime } from "@/hooks/useBookingsRealtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AdminBack from "@/components/admin/AdminBack";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, RotateCcw } from "lucide-react";
import type { BookingRow } from "@/lib/api/bookings";

export default function AdminBookingsTrash() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadDeletedBookings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      
      console.log('Loaded deleted bookings:', data?.length || 0, 'bookings');
      setBookings(data as any);
    } catch (error) {
      console.error("Error loading deleted bookings:", error);
      toast.error('Kunde inte ladda papperskorgen');
    } finally {
      setLoading(false);
    }
  }, []);

  useBookingsRealtime(loadDeletedBookings);
  
  useEffect(() => {
    loadDeletedBookings();
  }, [loadDeletedBookings]);

  const handleRestoreBooking = async (id: string) => {
    try {
      const { error } = await supabase.rpc('restore_booking', { p_booking_id: id });

      if (error) throw error;
      
      toast.success('Bokning återställd');
      loadDeletedBookings();
    } catch (error) {
      console.error('Error restoring booking:', error);
      toast.error('Kunde inte återställa bokning');
    }
  };

  const handlePermanentlyDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase.rpc('permanently_delete_booking', { p_booking_id: id });

      if (error) throw error;
      
      toast.success('Bokning permanent raderad');
      loadDeletedBookings();
    } catch (error) {
      console.error('Error permanently deleting booking:', error);
      toast.error('Kunde inte ta bort bokning permanent');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .not('deleted_at', 'is', null);

      if (error) throw error;
      
      toast.success('Papperskorgen tömd');
      loadDeletedBookings();
    } catch (error) {
      console.error('Error emptying trash:', error);
      toast.error('Kunde inte tömma papperskorgen');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.service_name?.toLowerCase().includes(searchLower) ||
      (booking.contact_name || booking.name)?.toLowerCase().includes(searchLower) ||
      (booking.contact_email || booking.email)?.toLowerCase().includes(searchLower)
    );
  });

  const getDaysUntilDeletion = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const deletionDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((deletionDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return daysLeft;
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Papperskorg - Bokningar</h1>
            <p className="text-muted-foreground mt-2">
              Raderade bokningar tas bort permanent efter 30 dagar
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/bookings')}>
              Tillbaka
            </Button>
            {bookings.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Töm papperskorg
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Detta kommer att permanent radera alla bokningar i papperskorgen. Denna åtgärd kan inte ångras.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEmptyTrash}>
                      Töm papperskorg
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <Input
          placeholder="Sök bokningar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

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
              {searchTerm ? "Inga bokningar hittades" : "Papperskorgen är tom"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const daysLeft = getDaysUntilDeletion(booking.deleted_at!);
            return (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {booking.service_name}
                      </CardTitle>
                      <CardDescription>
                        Kontakt: {booking.contact_name || booking.name} ({booking.contact_email || booking.email})
                      </CardDescription>
                      <CardDescription className="text-xs mt-2">
                        Raderad {formatDistanceToNow(new Date(booking.deleted_at!), { addSuffix: true, locale: sv })}
                        {daysLeft > 0 && (
                          <span className="ml-2 text-orange-600 font-medium">
                            • Raderas permanent om {daysLeft} dag{daysLeft !== 1 ? 'ar' : ''}
                          </span>
                        )}
                        {daysLeft <= 0 && (
                          <span className="ml-2 text-red-600 font-medium">
                            • Kommer att raderas inom kort
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-muted-foreground capitalize">{booking.status}</p>
                    </div>
                    <div>
                      <p className="font-medium">Adress</p>
                      <p className="text-muted-foreground">
                        {booking.address || 'Ej angivet'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Skapad</p>
                      <p className="text-muted-foreground">
                        {format(new Date(booking.created_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="default" onClick={() => handleRestoreBooking(booking.id)}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Återställ
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Radera permanent
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Detta kommer att permanent radera bokningen. Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handlePermanentlyDeleteBooking(booking.id)}>
                            Radera permanent
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
