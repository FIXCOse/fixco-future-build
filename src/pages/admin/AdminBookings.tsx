import { useCallback, useState, useEffect } from "react";
import { fetchBookings } from "@/lib/api/bookings";
import { fetchQuoteRequests } from "@/lib/api/quote-requests";
import { useBookingsRealtime } from "@/hooks/useBookingsRealtime";
import { useQuoteRequestsRealtime } from "@/hooks/useQuoteRequestsRealtime";
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
import { Trash2, Eye, FileText, Filter } from "lucide-react";
import type { BookingRow } from "@/lib/api/bookings";
import type { QuoteRequestRow } from "@/lib/api/quote-requests";

type CombinedItem = (BookingRow | QuoteRequestRow) & { item_type: 'booking' | 'quote_request' };

export default function AdminBookings() {
  const [items, setItems] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const params: any = {};
      if (statusFilter !== "all") {
        params.status = [statusFilter];
      }
      if (searchTerm) {
        params.q = searchTerm;
      }

      const combined: CombinedItem[] = [];

      // Load bookings if type filter allows
      if (typeFilter === "all" || typeFilter === "booking") {
        const { data: bookingsData } = await fetchBookings(params);
        const activeBookings = (bookingsData || []).filter((b: any) => !b.deleted_at);
        combined.push(...activeBookings.map((b: any) => ({ ...b, item_type: 'booking' as const })));
      }

      // Load quote requests if type filter allows
      if (typeFilter === "all" || typeFilter === "quote_request") {
        const { data: quoteRequestsData } = await fetchQuoteRequests(params);
        const activeQuoteRequests = (quoteRequestsData || []).filter((q: any) => !q.deleted_at);
        combined.push(...activeQuoteRequests.map((q: any) => ({ ...q, item_type: 'quote_request' as const })));
      }

      // Sort by created_at descending
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('Loaded items:', combined.length, 'items (bookings + quote requests)');
      setItems(combined);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, typeFilter]);

  useBookingsRealtime(loadData);
  useQuoteRequestsRealtime(loadData);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleDelete = async (id: string, type: 'booking' | 'quote_request') => {
    try {
      const table = type === 'booking' ? 'bookings' : 'quote_requests';
      const { error } = await supabase
        .from(table)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`${type === 'booking' ? 'Bokning' : 'Offertförfrågan'} flyttad till papperskorgen`);
      loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Kunde inte ta bort');
    }
  };

  const handleCreateQuote = (item: CombinedItem) => {
    navigate('/admin/quotes/new', { 
      state: { 
        fromBooking: {
          ...item,
          type: item.item_type
        }
      }
    });
  };

  const handleStatusChange = async (id: string, newStatus: string, type: 'booking' | 'quote_request') => {
    try {
      const table = type === 'booking' ? 'bookings' : 'quote_requests';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus as any })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status uppdaterad');
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.service_id?.toLowerCase().includes(searchLower) ||
      item.service_name?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.name?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      ('contact_name' in item && item.contact_name?.toLowerCase().includes(searchLower)) ||
      ('contact_email' in item && item.contact_email?.toLowerCase().includes(searchLower)) ||
      item.customer?.first_name?.toLowerCase().includes(searchLower) ||
      item.customer?.last_name?.toLowerCase().includes(searchLower)
    );
  });

  const itemCounts = {
    all: items.length,
    pending: items.filter(b => b.status === 'pending' || b.status === 'new').length,
    confirmed: items.filter(b => b.status === 'confirmed').length,
    in_progress: items.filter(b => b.status === 'in_progress').length,
    completed: items.filter(b => b.status === 'completed').length,
  };

  const typeCounts = {
    all: items.length,
    booking: items.filter(i => i.item_type === 'booking').length,
    quote_request: items.filter(i => i.item_type === 'quote_request').length,
  };

  return (
    <div className="container py-6">
      <AdminBack />
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bokningar & Offertförfrågningar</h1>
            <p className="text-muted-foreground mt-2">
              Hantera alla förfrågningar från kunder
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/bookings/trash')}>
            <Trash2 className="h-4 w-4 mr-2" />
            Papperskorg
          </Button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-64">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla typer ({typeCounts.all})</SelectItem>
            <SelectItem value="booking">Bokningar ({typeCounts.booking})</SelectItem>
            <SelectItem value="quote_request">Offertförfrågningar ({typeCounts.quote_request})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Alla ({itemCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Nya ({itemCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Bekräftade ({itemCounts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            Pågående ({itemCounts.in_progress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Slutförda ({itemCounts.completed})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 mb-6">
          <Input
            placeholder="Sök förfrågningar..."
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
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga förfrågningar hittades" : "Inga förfrågningar ännu"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            {item.service_name || item.service_id}
                          </CardTitle>
                          <Badge variant={item.item_type === 'booking' ? 'default' : 'secondary'}>
                            {item.item_type === 'booking' ? 'Bokning' : 'Offertförfrågan'}
                          </Badge>
                        </div>
                        <CardDescription>
                          Kund: {item.name || ('contact_name' in item && item.contact_name)} ({item.email || ('contact_email' in item && item.contact_email)})
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value, item.item_type)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Väntande</SelectItem>
                            <SelectItem value="new">Ny</SelectItem>
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
                      {item.address && (
                        <p className="text-muted-foreground">
                          📍 {item.address}, {item.postal_code} {item.city}
                        </p>
                      )}
                      {'hourly_rate' in item && item.hourly_rate && (
                        <p className="text-muted-foreground">
                          💵 {('price_type' in item && item.price_type === 'hourly') ? `${item.hourly_rate} kr/h` : `${item.hourly_rate} kr`}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        📅 {format(new Date(item.created_at), 'PPP', { locale: sv })}
                      </p>
                    </div>
                    
                    {item.description && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {(() => {
                            try {
                              const parsed = JSON.parse(item.description);
                              return parsed.beskrivning || parsed.description || item.description;
                            } catch {
                              return item.description;
                            }
                          })()}
                        </p>
                      </div>
                    )}

                    {'message' in item && item.message && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                        <p className="font-medium text-sm">Meddelande:</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                      </div>
                    )}

                    {'internal_notes' in item && item.internal_notes && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="font-medium text-sm">Interna anteckningar:</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.internal_notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      {item.item_type === 'booking' && (
                        <Button size="sm" onClick={() => navigate(`/admin/bookings/${item.id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Visa detaljer
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleCreateQuote(item)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Skapa offert
                      </Button>
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
                              Detta kommer att ta bort {item.item_type === 'booking' ? 'bokningen' : 'offertförfrågan'}. Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id, item.item_type)}>
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