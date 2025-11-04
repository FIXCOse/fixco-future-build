import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Calendar, FileText, Receipt, CreditCard, ExternalLink, Building2, Home } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useBookingsRealtime } from '@/hooks/useBookingsRealtime';
import { useQuotesRealtime } from '@/hooks/useQuotesRealtime';
import { fetchCustomerWithDetails } from '@/lib/api/customers';
import type { Customer } from '@/lib/api/customers';

type CustomerDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  bookings: any[];
  quotes: any[];
};

export function CustomerDetailModal({ 
  open, 
  onOpenChange, 
  customer: initialCustomer, 
  bookings: initialBookings, 
  quotes: initialQuotes 
}: CustomerDetailModalProps) {
  const [customer, setCustomer] = React.useState(initialCustomer);
  const [bookings, setBookings] = React.useState(initialBookings);
  const [quotes, setQuotes] = React.useState(initialQuotes);
  
  // Realtime updates
  const reloadCustomerData = React.useCallback(async () => {
    if (!customer?.id) return;
    
    try {
      const data = await fetchCustomerWithDetails(customer.id);
      setCustomer(data.customer);
      setBookings(data.bookings);
      setQuotes(data.quotes);
    } catch (error) {
      console.error('Error reloading customer data:', error);
    }
  }, [customer?.id]);

  useBookingsRealtime(reloadCustomerData);
  useQuotesRealtime(reloadCustomerData);
  
  // Update state when props change
  React.useEffect(() => {
    setCustomer(initialCustomer);
    setBookings(initialBookings);
    setQuotes(initialQuotes);
  }, [initialCustomer, initialBookings, initialQuotes]);
  
  if (!customer) return null;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      'new': { variant: 'default', label: 'Ny' },
      'pending': { variant: 'secondary', label: 'Väntande' },
      'confirmed': { variant: 'default', label: 'Bekräftad' },
      'completed': { variant: 'default', label: 'Slutförd' },
      'cancelled': { variant: 'destructive', label: 'Avbruten' },
      'draft': { variant: 'outline', label: 'Utkast' },
      'sent': { variant: 'secondary', label: 'Skickad' },
      'accepted': { variant: 'default', label: 'Accepterad' },
      'declined': { variant: 'destructive', label: 'Avböjd' }
    };
    return statusMap[status] || { variant: 'outline', label: status };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{customer.name}</h2>
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
              </div>
              <p className="text-sm text-muted-foreground">Kundnummer: {customer.id.slice(0, 8)}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontaktinformation</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">E-post:</span>
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Telefon:</span>
                    <span>{customer.phone}</span>
                  </div>
                )}
                
                {/* Company-specific fields */}
                {customer.customer_type === 'company' && customer.company_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Företag:</span>
                    <span>{customer.company_name}</span>
                  </div>
                )}
                
                {/* BRF-specific fields */}
                {customer.customer_type === 'brf' && customer.brf_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">BRF:</span>
                    <span>{customer.brf_name}</span>
                  </div>
                )}
                
                {/* Org number for company/BRF */}
                {(customer.customer_type === 'company' || customer.customer_type === 'brf') && customer.org_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Org.nummer:</span>
                    <span>{customer.org_number}</span>
                  </div>
                )}
                
                {/* Personnummer for private customers */}
                {(customer.customer_type === 'private' || !customer.customer_type) && customer.personnummer && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Personnummer:</span>
                    <span>{customer.personnummer}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {customer.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Adress:</p>
                      <p>{customer.address}</p>
                      {customer.postal_code && customer.city && (
                        <p>{customer.postal_code} {customer.city}</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Kund sedan:</span>
                  <span>
                    {formatDistanceToNow(new Date(customer.created_at), { 
                      addSuffix: true, 
                      locale: sv 
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <p className="text-2xl font-bold">{customer.booking_count || 0}</p>
                  <p className="text-sm text-muted-foreground">Bokningar</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Receipt className="h-8 w-8 text-green-500" />
                  <p className="text-2xl font-bold">{quotes.length}</p>
                  <p className="text-sm text-muted-foreground">Offerter</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <CreditCard className="h-8 w-8 text-purple-500" />
                  <p className="text-2xl font-bold">{(customer.total_spent || 0).toLocaleString()} kr</p>
                  <p className="text-sm text-muted-foreground">Total spenderat</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings & Quotes */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookings">
                Bokningar ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="quotes">
                Offerter ({quotes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4 mt-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const status = getStatusBadge(booking.status || 'pending');
                  return (
                    <Link 
                      key={booking.id}
                      to={`/admin/bookings/${booking.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">
                                  {booking.service_name || booking.service_slug || 'Bokning'}
                                </h4>
                                <Badge variant={status.variant}>{status.label}</Badge>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(booking.created_at).toLocaleDateString('sv-SE', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              {booking.payload?.description && (
                                <p className="text-sm mt-2">{booking.payload.description}</p>
                              )}
                            </div>
                            {booking.payload?.final_price && (
                              <div className="text-right">
                                <p className="text-lg font-bold">{booking.payload.final_price.toLocaleString()} kr</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga bokningar</p>
              )}
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4 mt-4">
              {quotes.length > 0 ? (
                quotes.map((quote) => {
                  const status = getStatusBadge(quote.status || 'draft');
                  return (
                    <Link 
                      key={quote.id}
                      to={`/admin/quotes/new?id=${quote.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{quote.title}</h4>
                                <Badge variant={status.variant}>{status.label}</Badge>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Offert {quote.number} • {new Date(quote.created_at).toLocaleDateString('sv-SE')}
                              </p>
                              {quote.valid_until && (
                                <p className="text-sm text-muted-foreground">
                                  Giltig till: {new Date(quote.valid_until).toLocaleDateString('sv-SE')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{quote.total_sek.toLocaleString()} kr</p>
                              {quote.rot_deduction_sek > 0 && (
                                <p className="text-sm text-green-600">
                                  ROT/RUT: -{quote.rot_deduction_sek.toLocaleString()} kr
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">Inga offerter</p>
              )}
            </TabsContent>
          </Tabs>

          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interna anteckningar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
