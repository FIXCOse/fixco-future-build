import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Search, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

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
  const [step, setStep] = useState(1);
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [quoteData, setQuoteData] = useState({
    hours: 8,
    hourlyRate: 650,
    notes: ''
  });

  const calculateTotals = () => {
    const subtotal = quoteData.hours * quoteData.hourlyRate;
    const vatAmount = subtotal * 0.25;
    const totalAmount = subtotal + vatAmount;
    
    return {
      subtotal,
      vatAmount,
      totalAmount
    };
  };

  const selectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setStep(2);
  };

  const createQuote = async () => {
    setLoading(true);
    try {
      // Simulate quote creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Offert skapad! (Demo-version)');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error('Kunde inte skapa offert');
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
            <CardContent className="space-y-4">
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
                  <span>Timpris:</span>
                  <span>{quoteData.hourlyRate} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span>Timmar:</span>
                  <span>{quoteData.hours}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{totals.subtotal.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span>Moms (25%):</span>
                  <span>{totals.vatAmount.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>{totals.totalAmount.toFixed(2)} SEK</span>
                </div>
              </div>

              <hr />

              <Button 
                className="w-full" 
                onClick={createQuote} 
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