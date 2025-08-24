import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Search, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { createQuote } from '@/lib/api/quotes';
import { useQueryClient } from '@tanstack/react-query';

interface Booking {
  id: string;
  status: string;
  service_name: string;
  base_price: number;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  property: {
    address: string;
    city: string;
  };
}

// Mock data until database is properly set up
const mockBookings: Booking[] = [
  {
    id: '1',
    status: 'pending',
    service_name: 'Badrumsrenovering',
    base_price: 25000,
    customer: {
      id: 'cust1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com'
    },
    property: {
      address: 'Testgatan 123',
      city: 'Stockholm'
    }
  },
  {
    id: '2',
    status: 'confirmed',
    service_name: 'Köksrenovering',
    base_price: 45000,
    customer: {
      id: 'cust2',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com'
    },
    property: {
      address: 'Exempelvägen 456',
      city: 'Göteborg'
    }
  }
];

const QuoteWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
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

  // Handle booking data from navigation state
  useEffect(() => {
    const stateBooking = location.state?.fromBooking;
    if (stateBooking) {
      const booking: Booking = {
        id: stateBooking.id,
        status: stateBooking.status || 'pending',
        service_name: stateBooking.service_name || stateBooking.service_id,
        base_price: stateBooking.base_price || stateBooking.hourly_rate || 0,
        customer: {
          id: stateBooking.customer_id,
          first_name: stateBooking.name?.split(' ')[0] || stateBooking.customer?.first_name || 'Okänd',
          last_name: stateBooking.name?.split(' ')[1] || stateBooking.customer?.last_name || '',
          email: stateBooking.email || stateBooking.customer?.email || ''
        },
        property: {
          address: stateBooking.address || '',
          city: stateBooking.city || ''
        }
      };
      setSelectedBooking(booking);
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

  const selectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setStep(2);
  };

  const createQuoteFromData = async () => {
    if (!selectedBooking) return;
    
    setLoading(true);
    try {
      const totals = calculateTotals();
      
      await createQuote({
        customer_id: selectedBooking.customer.id,
        property_id: null, // Will be set if property exists
        title: `Offert för ${selectedBooking.service_name}`,
        description: quoteData.notes || `Offert baserad på bokning ${selectedBooking.id}`,
        subtotal: totals.subtotalExVat,
        vat_amount: totals.vatAmount,
        total_amount: quoteData.showPricesIncVat ? totals.totalIncVat : totals.totalExVat,
        rot_amount: quoteData.rotRutType === 'ROT' ? totals.rotRutAmount : 0,
        rut_amount: quoteData.rotRutType === 'RUT' ? totals.rotRutAmount : 0,
        discount_amount: totals.discountAmount,
        discount_percent: quoteData.discountPercent,
        line_items: [
          {
            description: `${selectedBooking.service_name} - Arbete`,
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

  const filteredBookings = bookings.filter(booking =>
    booking.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${booking.customer.first_name} ${booking.customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = calculateTotals();

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Skapa offert</h1>
            <p className="text-muted-foreground">Steg 1: Välj kund eller bokning</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sök bokningar</CardTitle>
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
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => selectBooking(booking)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{booking.status}</Badge>
                          <h3 className="font-medium">{booking.service_name}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {booking.customer.first_name} {booking.customer.last_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.property.address}, {booking.property.city}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{booking.base_price.toLocaleString()} SEK</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

        {selectedBooking && (
          <Card>
            <CardHeader>
              <CardTitle>Vald bokning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Kund</Label>
                  <p>{selectedBooking.customer.first_name} {selectedBooking.customer.last_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tjänst</Label>
                  <p>{selectedBooking.service_name}</p>
                </div>
              </div>
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
                    <select
                      id="rotRutType"
                      className="w-full p-2 border rounded-md"
                      value={quoteData.rotRutType}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, rotRutType: e.target.value }))}
                    >
                      <option value="">Inget avdrag</option>
                      <option value="ROT">ROT-avdrag</option>
                      <option value="RUT">RUT-avdrag</option>
                    </select>
                  </div>

                  {quoteData.rotRutType && (
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