import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Phone, Mail, MapPin, DollarSign, Zap, Wrench } from 'lucide-react';
import { getSettings, setSetting } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import AdminBack from '@/components/admin/AdminBack';
import ServiceManagement from '@/components/admin/ServiceManagement';

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const keys = [
        'brand.phone', 'brand.email', 'service.cities', 
        'pricing.rotDefault', 'chat.whatsapp.enabled', 'features.offerWizard'
      ];
      const data = await getSettings(keys);
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda inställningar',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      await setSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      toast({
        title: 'Sparat',
        description: 'Inställningen har uppdaterats'
      });
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara inställning',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBack />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div>
        <h1 className="text-3xl font-bold">Systeminställningar</h1>
        <p className="text-muted-foreground">
          Konfigurera systemparametrar och inställningar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Kontaktinformation
          </CardTitle>
          <CardDescription>
            Grundläggande företagsinformation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                value={settings['brand.phone'] || ''}
                onChange={(e) => updateSetting('brand.phone', e.target.value)}
                placeholder="+46 79 335 02 28"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={settings['brand.email'] || ''}
                onChange={(e) => updateSetting('brand.email', e.target.value)}
                placeholder="kontakt@fixco.se"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Prismodell
          </CardTitle>
          <CardDescription>
            Standard-prissättning och ROT/RUT-inställningar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rotDefault">ROT som standard</Label>
              <div className="text-sm text-muted-foreground">
                Aktivera ROT-avdrag som standard för nya bokningar
              </div>
            </div>
            <Switch
              id="rotDefault"
              checked={settings['pricing.rotDefault'] === true}
              onCheckedChange={(checked) => updateSetting('pricing.rotDefault', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Funktioner
          </CardTitle>
          <CardDescription>
            Feature flags och experimentella funktioner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="whatsapp">WhatsApp-chatt</Label>
              <div className="text-sm text-muted-foreground">
                Aktivera WhatsApp-knappen för kundkontakt
              </div>
            </div>
            <Switch
              id="whatsapp"
              checked={settings['chat.whatsapp.enabled'] === true}
              onCheckedChange={(checked) => updateSetting('chat.whatsapp.enabled', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="offerWizard">Offert-guide</Label>
              <div className="text-sm text-muted-foreground">
                Aktivera interaktiv offert-guide för kunder
              </div>
            </div>
            <Switch
              id="offerWizard"
              checked={settings['features.offerWizard'] === true}
              onCheckedChange={(checked) => updateSetting('features.offerWizard', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Tjänsthantering
          </CardTitle>
          <CardDescription>
            Lägg till och hantera tjänster med automatisk engelsköversättning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;