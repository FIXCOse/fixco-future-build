import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useBookingWizard, WizardData } from '../hooks/useBookingWizard';
import { createBooking } from '../lib/api/bookings';
import { createQuoteRequest } from '../lib/api/quote-requests';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'book' | 'quote';
  currentStep: number;
  wizardData: WizardData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<WizardData>) => void;
}

export function BookingWizardModal({
  isOpen,
  onClose,
  actionType,
  currentStep,
  wizardData,
  loading,
  setLoading,
  nextStep,
  prevStep,
  updateData
}: BookingWizardModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  console.log('[BookingWizardModal] Render with props:', { 
    isOpen, 
    actionType, 
    currentStep, 
    serviceId: wizardData.service_id,
    serviceName: wizardData.service_name
  });

  const validateStep1 = () => {
    if (!wizardData.contact_name.trim()) {
      toast({ title: "Fel", description: "Namn krävs", variant: "destructive" });
      return false;
    }
    if (!wizardData.contact_email && !wizardData.contact_phone) {
      toast({ title: "Fel", description: "E-post eller telefonnummer krävs", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1()) return;
    
    setLoading(true);
    console.log('[BookingWizard] Submitting:', { actionType, wizardData, user: !!user });

    try {
      const commonData = {
        service_id: wizardData.service_id,
        customer_id: user?.id || null,
        contact_name: wizardData.contact_name,
        contact_email: wizardData.contact_email,
        contact_phone: wizardData.contact_phone,
        address: wizardData.address,
        postal_code: wizardData.postal_code,
        city: wizardData.city,
        rot_rut_type: wizardData.rot_rut_type || null,
        source: user ? 'user' : 'guest',
        created_by_type: user ? 'user' : 'guest'
      };

      if (actionType === 'book') {
        const bookingData = {
          ...commonData,
          service_name: wizardData.service_name,
          price_type: wizardData.price_type,
          hours_estimated: wizardData.hours_estimated || null,
          hourly_rate: wizardData.hourly_rate || null,
          materials: wizardData.materials || 0,
          notes: wizardData.notes || null
        };

        console.log('[BookingWizard] Creating booking with data:', bookingData);
        await createBooking(bookingData as any);
        
        toast({
          title: "Bokning skickad!",
          description: "Vi kontaktar dig inom kort för att bekräfta bokningen."
        });
      } else {
        const quoteData = {
          ...commonData,
          message: wizardData.message || null
        };

        console.log('[BookingWizard] Creating quote request with data:', quoteData);
        await createQuoteRequest(quoteData as any);
        
        toast({
          title: "Offertförfrågan skickad!",
          description: "Vi kontaktar dig inom kort med en offert."
        });
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('[BookingWizard] Submit error:', error);
      toast({
        title: "Fel",
        description: "Något gick fel. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tack!</h2>
            <p className="text-muted-foreground">
              {actionType === 'book' 
                ? 'Din bokning har skickats. Vi kontaktar dig inom kort.'
                : 'Din offertförfrågan har skickats. Vi kontaktar dig inom kort.'
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {actionType === 'book' ? 'Boka tjänst' : 'Begär offert'}: {wizardData.service_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>1</div>
            <div className="flex-1 h-1 bg-muted">
              <div className={`h-full transition-all duration-300 ${
                currentStep >= 2 ? 'bg-primary w-full' : 'bg-muted w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>2</div>
          </div>

          {/* Step 1: Contact & Address */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kontaktuppgifter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact_name">Namn *</Label>
                    <Input
                      id="contact_name"
                      value={wizardData.contact_name}
                      onChange={(e) => updateData({ contact_name: e.target.value })}
                      placeholder="Ditt namn"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_email">E-post</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={wizardData.contact_email}
                        onChange={(e) => updateData({ contact_email: e.target.value })}
                        placeholder="din@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Telefon</Label>
                      <Input
                        id="contact_phone"
                        value={wizardData.contact_phone}
                        onChange={(e) => updateData({ contact_phone: e.target.value })}
                        placeholder="070-123 45 67"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    * E-post eller telefonnummer krävs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adressuppgifter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adress</Label>
                    <Input
                      id="address"
                      value={wizardData.address}
                      onChange={(e) => updateData({ address: e.target.value })}
                      placeholder="Gatuadress"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postal_code">Postnummer</Label>
                      <Input
                        id="postal_code"
                        value={wizardData.postal_code}
                        onChange={(e) => updateData({ postal_code: e.target.value })}
                        placeholder="12345"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ort</Label>
                      <Input
                        id="city"
                        value={wizardData.city}
                        onChange={(e) => updateData({ city: e.target.value })}
                        placeholder="Stockholm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ROT/RUT-avdrag</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={wizardData.rot_rut_type || ''}
                    onValueChange={(value) => updateData({ rot_rut_type: value as 'ROT' | 'RUT' | null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj typ av avdrag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Inget avdrag</SelectItem>
                      <SelectItem value="ROT">ROT-avdrag</SelectItem>
                      <SelectItem value="RUT">RUT-avdrag</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleStep1Next}>
                  Nästa <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {actionType === 'book' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Bokningsdetaljer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="price_type">Prisupplägg</Label>
                      <Select
                        value={wizardData.price_type}
                        onValueChange={(value) => updateData({ price_type: value as 'hourly' | 'fixed' | 'quote' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Timpris</SelectItem>
                          <SelectItem value="fixed">Fast pris</SelectItem>
                          <SelectItem value="quote">Vet ej - behöver offert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {wizardData.price_type === 'hourly' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hours_estimated">Beräknade timmar</Label>
                          <Input
                            id="hours_estimated"
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={wizardData.hours_estimated || ''}
                            onChange={(e) => updateData({ hours_estimated: parseFloat(e.target.value) || undefined })}
                            placeholder="4"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hourly_rate">Timpris (kr)</Label>
                          <Input
                            id="hourly_rate"
                            type="number"
                            min="0"
                            value={wizardData.hourly_rate || ''}
                            onChange={(e) => updateData({ hourly_rate: parseFloat(e.target.value) || undefined })}
                            placeholder="500"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="materials">Material/förbrukning (kr)</Label>
                      <Input
                        id="materials"
                        type="number"
                        min="0"
                        value={wizardData.materials || ''}
                        onChange={(e) => updateData({ materials: parseFloat(e.target.value) || undefined })}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Anteckningar</Label>
                      <Textarea
                        id="notes"
                        value={wizardData.notes || ''}
                        onChange={(e) => updateData({ notes: e.target.value })}
                        placeholder="Beskriv vad som behöver göras..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Projektbeskrivning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="message">Beskriv ditt projekt</Label>
                      <Textarea
                        id="message"
                        value={wizardData.message || ''}
                        onChange={(e) => updateData({ message: e.target.value })}
                        placeholder="Berätta vad du behöver hjälp med..."
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {actionType === 'book' ? 'Skicka bokning' : 'Skicka förfrågan'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}