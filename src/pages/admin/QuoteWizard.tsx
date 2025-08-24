import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Search, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  status: string;
  service_name: string;
  base_price: number;
  rot_eligible: boolean;
  rut_eligible: boolean;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  property: {
    address: string;
    city: string;
    postal_code: string;
  };
}

interface QuoteData {
  bookingId?: string;
  customerId: string;
  priceMode: 'hourly' | 'fixed';
  hours: number;
  hourlyRate: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  rotRutType?: 'rot' | 'rut';
  rotRutAmount: number;
  totalAfterDeduction: number;
  notes: string;
  sendToEmail: boolean;
  sendToAccount: boolean;
}

const QuoteWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [quoteData, setQuoteData] = useState<QuoteData>({
    customerId: '',
    priceMode: 'hourly',
    hours: 1,
    hourlyRate: 650,
    subtotal: 0,
    vatAmount: 0,
    totalAmount: 0,
    rotRutAmount: 0,
    totalAfterDeduction: 0,
    notes: '',
    sendToEmail: true,
    sendToAccount: true
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [quoteData.hours, quoteData.hourlyRate, quoteData.rotRutType]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, status, service_name, base_price, rot_eligible, rut_eligible,
          customer:profiles!bookings_customer_id_fkey(id, first_name, last_name, email, phone),
          property:properties(address, city, postal_code)
        `)
        .in('status', ['pending', 'confirmed', 'in_progress', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Kunde inte ladda bokningar');
    }
  };

  const calculateTotals = () => {
    const subtotal = quoteData.hours * quoteData.hourlyRate;
    const vatAmount = subtotal * 0.25;
    const totalAmount = subtotal + vatAmount;
    
    let rotRutAmount = 0;
    if (quoteData.rotRutType === 'rot') {
      rotRutAmount = Math.min(subtotal * 0.3, 75000); // 30% up to 75k SEK
    } else if (quoteData.rotRutType === 'rut') {
      rotRutAmount = Math.min(subtotal * 0.5, 75000); // 50% up to 75k SEK
    }
    
    const totalAfterDeduction = totalAmount - rotRutAmount;
    
    setQuoteData(prev => ({
      ...prev,
      subtotal,
      vatAmount,
      totalAmount,
      rotRutAmount,
      totalAfterDeduction
    }));
  };

  const selectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setQuoteData(prev => ({
      ...prev,
      bookingId: booking.id,
      customerId: booking.customer.id
    }));
    setStep(2);
  };

  const createQuote = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          customer_id: quoteData.customerId,
          subtotal: quoteData.subtotal,
          vat_amount: quoteData.vatAmount,
          total_amount: quoteData.totalAmount,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Offert skapad!');
      navigate('/admin/quotes');
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

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Skapa offert</h1>
            <p className="text-muted-foreground">Steg 1: Välj kund eller bokning</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/quotes')}>
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
                        <div className="font-medium">{booking.base_price} SEK</div>
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
            <p className="text-muted-foreground">Steg 2: Pris & ROT/RUT</p>
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
                <Label htmlFor="rotRutType">ROT/RUT-avdrag</Label>
                <Select 
                  value={quoteData.rotRutType || 'none'} 
                  onValueChange={(value) => setQuoteData(prev => ({ 
                    ...prev, 
                    rotRutType: value === 'none' ? undefined : value as 'rot' | 'rut'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj typ av avdrag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Inget avdrag</SelectItem>
                    <SelectItem value="rot">ROT-avdrag (30%)</SelectItem>
                    <SelectItem value="rut">RUT-avdrag (50%)</SelectItem>
                  </SelectContent>
                </Select>
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
                  <span>{quoteData.subtotal.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between">
                  <span>Moms (25%):</span>
                  <span>{quoteData.vatAmount.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{quoteData.totalAmount.toFixed(2)} SEK</span>
                </div>
                
                {quoteData.rotRutType && (
                  <>
                    <hr className="my-2" />
                    <div className="flex justify-between text-green-600">
                      <span>{quoteData.rotRutType.toUpperCase()}-avdrag:</span>
                      <span>-{quoteData.rotRutAmount.toFixed(2)} SEK</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Att betala:</span>
                      <span>{quoteData.totalAfterDeduction.toFixed(2)} SEK</span>
                    </div>
                  </>
                )}
              </div>

              <hr />

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendEmail"
                    checked={quoteData.sendToEmail}
                    onCheckedChange={(checked) => setQuoteData(prev => ({ ...prev, sendToEmail: !!checked }))}
                  />
                  <Label htmlFor="sendEmail">Skicka till kundens e-post</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendAccount"
                    checked={quoteData.sendToAccount}
                    onCheckedChange={(checked) => setQuoteData(prev => ({ ...prev, sendToAccount: !!checked }))}
                  />
                  <Label htmlFor="sendAccount">Skicka till kundens FIXCO-konto</Label>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={createQuote} 
                disabled={loading}
              >
                {loading ? 'Skapar offert...' : 'Skapa & skicka offert'}
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