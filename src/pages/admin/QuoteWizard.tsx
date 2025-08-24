import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Search, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { createQuote } from '@/lib/api/quotes';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BookingOrRequest {
  id: string;
  status: string;
  service_name: string;
  service_id?: string;
  base_price?: number;
  hourly_rate?: number;
  total_amount?: number;
  type: 'booking' | 'quote_request';
  customer_id?: string;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  description?: string;
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const QuoteWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [bookingsAndRequests, setBookingsAndRequests] = useState<BookingOrRequest[]>([]);
  const [selectedItem, setSelectedItem] = useState<BookingOrRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [quoteData, setQuoteData] = useState({
    hours: 8,
    hourlyRate: 650,
    materialCost: 0,
    discountPercent: 0,
    discountAmount: 0,
    rotRutType: '',
    rotRutPercent: 50,
    vatPercent: 25,
    showPricesIncVat: true,
    notes: ''
  });

  // Load both bookings and quote requests
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch existing quotes to filter out already processed requests
        const { data: existingQuotes, error: quotesError } = await supabase
          .from('quotes')
          .select('id');

        if (quotesError) throw quotesError;

        // Fetch bookings that haven't been turned into quotes yet
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            customer:profiles!bookings_customer_id_fkey(first_name, last_name, email)
          `)
          .in('status', ['pending', 'confirmed', 'in_progress']) // Only non-completed bookings
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Fetch quote requests that are still new or in progress
        const { data: quoteRequests, error: requestsError } = await supabase
          .from('quote_requests')
          .select('*')
          .in('status', ['new', 'processing']) // Only non-quoted requests
          .order('created_at', { ascending: false});

        if (requestsError) throw requestsError;

        console.log('Loaded bookings:', bookings?.length, 'bookings');
        console.log('Loaded quote requests:', quoteRequests?.length, 'requests');

        // Combine and format data
        const combinedData: BookingOrRequest[] = [
          ...(bookings || []).map((booking: any) => ({
            id: booking.id,
            status: booking.status,
            service_name: booking.service_name || booking.service_id,
            service_id: booking.service_id,
            base_price: booking.base_price || booking.hourly_rate,
            hourly_rate: booking.hourly_rate,
            type: 'booking' as const,
            customer_id: booking.customer_id,
            name: booking.name,
            email: booking.email,
            address: booking.address,
            city: booking.city,
            postal_code: booking.postal_code,
            description: booking.description,
            customer: booking.customer
          })),
          ...(quoteRequests || []).map((request: any) => ({
            id: request.id,
            status: request.status,
            service_name: request.service_name || request.service_id,
            service_id: request.service_id,
            hourly_rate: request.hourly_rate,
            type: 'quote_request' as const,
            customer_id: request.customer_id,
            name: request.contact_name || request.name,
            email: request.contact_email || request.email,
            address: request.address,
            city: request.city,
            postal_code: request.postal_code,
            description: request.description,
            customer: null // Will be handled separately if needed
          }))
        ];

        setBookingsAndRequests(combinedData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Kunde inte ladda data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle data from navigation state
  useEffect(() => {
    const stateBooking = location.state?.fromBooking;
    if (stateBooking) {
      const item: BookingOrRequest = {
        id: stateBooking.id,
        status: stateBooking.status || 'pending',
        service_name: stateBooking.service_name || stateBooking.service_id,
        service_id: stateBooking.service_id,
        base_price: stateBooking.base_price || stateBooking.hourly_rate || 0,
        hourly_rate: stateBooking.hourly_rate,
        type: stateBooking.type || 'booking',
        customer_id: stateBooking.customer_id,
        name: stateBooking.name,
        email: stateBooking.email,
        address: stateBooking.address,
        city: stateBooking.city,
        postal_code: stateBooking.postal_code,
        description: stateBooking.description,
        customer: stateBooking.customer ? stateBooking.customer : {
          id: stateBooking.customer_id,
          first_name: stateBooking.name?.split(' ')[0] || 'Okänd',
          last_name: stateBooking.name?.split(' ')[1] || '',
          email: stateBooking.email || ''
        }
      };
      setSelectedItem(item);
      setStep(2);
    }
  }, [location.state]);

  const calculateTotals = () => {
    const laborCost = quoteData.hours * quoteData.hourlyRate;
    const subtotalExVat = laborCost + quoteData.materialCost;
    
    // Apply discount
    const discountAmount = quoteData.discountPercent > 0 
      ? subtotalExVat * (quoteData.discountPercent / 100)
      : quoteData.discountAmount;
    
    const afterDiscount = subtotalExVat - discountAmount;
    
    // Calculate ROT/RUT deduction
    let rotRutAmount = 0;
    if (quoteData.rotRutType && ['ROT', 'RUT'].includes(quoteData.rotRutType)) {
      const eligibleAmount = laborCost * (quoteData.rotRutPercent / 100);
      rotRutAmount = eligibleAmount * 0.5; // 50% deduction
    }
    
    const afterRotRut = Math.max(afterDiscount - rotRutAmount, 0);
    const vatAmount = afterRotRut * (quoteData.vatPercent / 100);
    const totalIncVat = afterRotRut + vatAmount;
    
    return {
      laborCost,
      materialCost: quoteData.materialCost,
      subtotalExVat,
      discountAmount,
      afterDiscount,
      rotRutAmount,
      afterRotRut,
      vatAmount,
      totalIncVat,
      totalExVat: afterRotRut
    };
  };

  const selectItem = (item: BookingOrRequest) => {
    setSelectedItem(item);
    setStep(2);
  };

  const createQuoteFromData = async () => {
    if (!selectedItem) return;
    
    setLoading(true);
    try {
      const totals = calculateTotals();
      
      await createQuote({
        customer_id: selectedItem.customer_id || selectedItem.customer?.id || '',
        property_id: null,
        title: `Offert för ${selectedItem.service_name}`,
        description: quoteData.notes || selectedItem.description || `Offert baserad på ${selectedItem.type === 'booking' ? 'bokning' : 'offertförfrågan'} ${selectedItem.id}`,
        subtotal: totals.subtotalExVat,
        vat_amount: totals.vatAmount,
        total_amount: quoteData.showPricesIncVat ? totals.totalIncVat : totals.totalExVat,
        rot_amount: quoteData.rotRutType === 'ROT' ? totals.rotRutAmount : 0,
        rut_amount: quoteData.rotRutType === 'RUT' ? totals.rotRutAmount : 0,
        discount_amount: totals.discountAmount,
        discount_percent: quoteData.discountPercent,
        line_items: [
          {
            description: `${selectedItem.service_name} - Arbete`,
            quantity: quoteData.hours,
            unit_price: quoteData.hourlyRate,
            amount: totals.laborCost
          },
          ...(totals.materialCost > 0 ? [{
            description: 'Material',
            quantity: 1,
            unit_price: totals.materialCost,
            amount: totals.materialCost
          }] : [])
        ]
      });

      toast.success('Offert skapad framgångsrikt!');
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
      navigate('/admin/quotes');
    } catch (error: any) {
      console.error('Error creating quote:', error);
      toast.error(error.message || 'Kunde inte skapa offert');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = bookingsAndRequests.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.service_name?.toLowerCase().includes(searchLower) ||
      item.customer?.first_name?.toLowerCase().includes(searchLower) ||
      item.customer?.last_name?.toLowerCase().includes(searchLower) ||
      item.customer?.email?.toLowerCase().includes(searchLower) ||
      item.name?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower)
    );
  });

  const totals = calculateTotals();

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Skapa offert</h1>
            <p className="text-muted-foreground">Steg 1: Välj kund eller förfrågan</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sök kunder och förfrågningar</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Sök på tjänst, kund eller e-post..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <Card 
                    key={`${item.type}-${item.id}`}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectItem(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.type === 'booking' ? 'default' : 'secondary'}>
                              {item.type === 'booking' ? 'Bokning' : 'Offertförfrågan'}
                            </Badge>
                            <Badge variant="outline">{item.status}</Badge>
                            <h3 className="font-medium">{item.service_name}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {item.customer ? 
                                `${item.customer.first_name} ${item.customer.last_name}` : 
                                item.name || 'Okänd kund'
                              }
                            </div>
                            {(item.address || item.city) && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {item.address ? `${item.address}, ${item.city}` : item.city}
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {item.description.length > 100 
                                ? `${item.description.substring(0, 100)}...`
                                : item.description
                              }
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {item.base_price || item.hourly_rate 
                              ? `${(item.base_price || item.hourly_rate)?.toLocaleString()} SEK`
                              : 'Pris ej angivet'
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Inga förfrågningar hittades' : 'Inga förfrågningar att visa'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Skapa offert</h1>
            <p className="text-muted-foreground">Steg 2: Pris & detaljer</p>
          </div>
          <Button variant="outline" onClick={() => setStep(1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </div>

        {selectedItem && (
          <Card>
            <CardHeader>
              <CardTitle>Vald {selectedItem.type === 'booking' ? 'bokning' : 'offertförfrågan'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Kund</Label>
                  <p>
                    {selectedItem.customer 
                      ? `${selectedItem.customer.first_name} ${selectedItem.customer.last_name}`
                      : selectedItem.name || 'Okänd kund'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tjänst</Label>
                  <p>{selectedItem.service_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">E-post</Label>
                  <p>{selectedItem.customer?.email || selectedItem.email || 'Ej angiven'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Typ</Label>
                  <p>{selectedItem.type === 'booking' ? 'Bokning' : 'Offertförfrågan'}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground">Beskrivning</Label>
                  <p className="text-sm">{selectedItem.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Prissättning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Antal timmar</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={quoteData.hours}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Timpris (SEK)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    value={quoteData.hourlyRate}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="materialCost">Materialkostnad (SEK)</Label>
                  <Input
                    id="materialCost"
                    type="number"
                    min="0"
                    value={quoteData.materialCost}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, materialCost: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="vatPercent">Moms (%)</Label>
                  <Input
                    id="vatPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={quoteData.vatPercent}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, vatPercent: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Rabatt</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountPercent">Rabatt (%)</Label>
                    <Input
                      id="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={quoteData.discountPercent}
                      onChange={(e) => {
                        const percent = parseFloat(e.target.value) || 0;
                        setQuoteData(prev => ({ 
                          ...prev, 
                          discountPercent: percent,
                          discountAmount: 0 // Reset amount when using percent
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountAmount">Rabattbelopp (SEK)</Label>
                    <Input
                      id="discountAmount"
                      type="number"
                      min="0"
                      value={quoteData.discountAmount}
                      onChange={(e) => {
                        const amount = parseFloat(e.target.value) || 0;
                        setQuoteData(prev => ({ 
                          ...prev, 
                          discountAmount: amount,
                          discountPercent: 0 // Reset percent when using amount
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">ROT/RUT-avdrag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rotRutType">Typ av avdrag</Label>
                    <Select
                      value={quoteData.rotRutType}
                      onValueChange={(value) => setQuoteData(prev => ({ ...prev, rotRutType: value }))}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Välj avdragstyp" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="none">Inget avdrag</SelectItem>
                        <SelectItem value="ROT">ROT-avdrag</SelectItem>
                        <SelectItem value="RUT">RUT-avdrag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {quoteData.rotRutType && quoteData.rotRutType !== 'none' && (
                    <div>
                      <Label htmlFor="rotRutPercent">Andel arbetskostnad för avdrag (%)</Label>
                      <Input
                        id="rotRutPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={quoteData.rotRutPercent}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, rotRutPercent: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPricesIncVat"
                    checked={quoteData.showPricesIncVat}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, showPricesIncVat: e.target.checked }))}
                  />
                  <Label htmlFor="showPricesIncVat">Visa priser inklusive moms</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Anteckningar</Label>
                <Textarea
                  id="notes"
                  placeholder="Lägg till anteckningar om offerten..."
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sammanfattning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Arbetskostnad ({quoteData.hours}h × {quoteData.hourlyRate} SEK):</span>
                  <span>{totals.laborCost.toFixed(2)} SEK</span>
                </div>
                {totals.materialCost > 0 && (
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>{totals.materialCost.toFixed(2)} SEK</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal (exkl. moms):</span>
                  <span>{totals.subtotalExVat.toFixed(2)} SEK</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Rabatt:</span>
                    <span>-{totals.discountAmount.toFixed(2)} SEK</span>
                  </div>
                )}
                {totals.rotRutAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{quoteData.rotRutType}-avdrag:</span>
                    <span>-{totals.rotRutAmount.toFixed(2)} SEK</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Efter avdrag (exkl. moms):</span>
                  <span>{totals.afterRotRut.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span>Moms ({quoteData.vatPercent}%):</span>
                  <span>{totals.vatAmount.toFixed(2)} SEK</span>
                </div>
                <hr />
                <div className="flex justify-between font-medium text-lg">
                  <span>
                    {quoteData.showPricesIncVat ? 'Total (inkl. moms):' : 'Total (exkl. moms):'}
                  </span>
                  <span>
                    {quoteData.showPricesIncVat 
                      ? totals.totalIncVat.toFixed(2) 
                      : totals.totalExVat.toFixed(2)} SEK
                  </span>
                </div>
                {quoteData.showPricesIncVat && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Exkl. moms:</span>
                    <span>{totals.totalExVat.toFixed(2)} SEK</span>
                  </div>
                )}
                {!quoteData.showPricesIncVat && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Inkl. moms:</span>
                    <span>{totals.totalIncVat.toFixed(2)} SEK</span>
                  </div>
                )}
              </div>

              <hr />

              <Button 
                className="w-full" 
                onClick={createQuoteFromData} 
                disabled={loading}
              >
                {loading ? 'Skapar offert...' : 'Skapa offert'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default QuoteWizard;