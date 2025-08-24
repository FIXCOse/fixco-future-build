import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useWizardStore } from '../stores/wizardStore';
import { createBooking } from '../lib/api/bookings';
import { createQuoteRequest } from '../lib/api/quote-requests';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';

interface FormData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  postal_code: string;
  city: string;
  message: string;
}

export function SimpleBookingWizard() {
  const { isOpen, actionType, serviceId, serviceName, closeWizard } = useWizardStore();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  console.log('[SimpleBookingWizard] Render:', { isOpen, actionType, serviceId, serviceName });
  console.log('[SimpleBookingWizard] Component state:', { loading, success });
  
  const [formData, setFormData] = useState<FormData>({
    contact_name: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || '',
    contact_email: profile?.email || user?.email || '',
    contact_phone: profile?.phone || '',
    address: profile?.address_line || '',
    postal_code: profile?.postal_code || '',
    city: profile?.city || '',
    message: ''
  });

  console.log('[SimpleBookingWizard] Render:', { isOpen, actionType, serviceId, serviceName });
  console.log('[SimpleBookingWizard] Component state:', { loading, success });

  if (!isOpen && !success) {
    console.log('[SimpleBookingWizard] Not rendering - wizard not open');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_name.trim()) {
      toast({ title: "Fel", description: "Namn krävs", variant: "destructive" });
      return;
    }
    
    if (!formData.contact_email && !formData.contact_phone) {
      toast({ title: "Fel", description: "E-post eller telefonnummer krävs", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    try {
      const commonData = {
        service_id: serviceId,
        customer_id: user?.id || null,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        source: user ? 'user' : 'guest',
        created_by_type: user ? 'user' : 'guest'
      };

      if (actionType === 'book') {
        const bookingData = {
          ...commonData,
          service_name: serviceName,
          price_type: 'quote' as const,
          notes: formData.message || null
        };

        await createBooking(bookingData as any);
        toast({
          title: "Bokning skickad!",
          description: "Vi kontaktar dig inom kort för att bekräfta bokningen."
        });
      } else {
        const quoteData = {
          ...commonData,
          message: formData.message || null
        };

        await createQuoteRequest(quoteData as any);
        toast({
          title: "Offertförfrågan skickad!",
          description: "Vi kontaktar dig inom kort med en offert."
        });
      }

      setSuccess(true);
      setTimeout(() => {
        closeWizard();
        setSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Submit error:', error);
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
      <Dialog open={isOpen} onOpenChange={closeWizard}>
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
    <Dialog open={isOpen} onOpenChange={closeWizard}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {actionType === 'book' ? 'Boka tjänst' : 'Begär offert'}: {serviceName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktuppgifter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact_name">Namn *</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                  placeholder="Ditt namn"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">E-post</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="din@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Telefon</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
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
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Gatuadress"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postal_code">Postnummer</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ort</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Stockholm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projektbeskrivning</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="message">
                  {actionType === 'book' ? 'Beskriv vad som behöver göras' : 'Beskriv ditt projekt'}
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Beskriv vad du behöver hjälp med..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeWizard}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === 'book' ? 'Skicka bokning' : 'Skicka förfrågan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}