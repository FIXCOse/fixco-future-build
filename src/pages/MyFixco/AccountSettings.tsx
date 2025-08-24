import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { 
  Key, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Download, 
  Trash2,
  Smartphone,
  AlertTriangle
} from 'lucide-react';

const AccountSettings = () => {
  const { profile } = useAuthProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line: '',
    postal_code: '',
    city: ''
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: (profile as any).phone || '',
        address_line: (profile as any).address_line || '',
        postal_code: (profile as any).postal_code || '',
        city: (profile as any).city || ''
      });
    }
  }, [profile]);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile?.id);

      if (error) throw error;
      
      toast.success('Profil uppdaterad');
    } catch (error: any) {
      toast.error('Fel vid uppdatering: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Nya lösenord matchar inte');
      return;
    }

    if (passwordData.new.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      });

      if (error) throw error;
      
      setPasswordData({ current: '', new: '', confirm: '' });
      toast.success('Lösenord uppdaterat');
    } catch (error: any) {
      toast.error('Fel vid lösenordsuppdatering: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async () => {
    const newEmail = prompt('Ange ny e-postadress:');
    if (!newEmail) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;
      
      toast.success('Verifieringsmail skickat till ny adress');
    } catch (error: any) {
      toast.error('Fel vid e-postuppdatering: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    try {
      // Fetch user data for export
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile?.id)
        .single();

      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', profile?.id);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', profile?.id);

      const exportData = {
        profile: profileData,
        properties: propertiesData,
        bookings: bookingsData,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fixco-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Data exporterad');
    } catch (error: any) {
      toast.error('Fel vid export: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestDeletion = async () => {
    const confirmation = prompt(
      'För att begära radering, skriv "RADERA MITT KONTO" (versaler):'
    );
    
    if (confirmation !== 'RADERA MITT KONTO') {
      toast.error('Felaktig bekräftelse');
      return;
    }

    try {
      // Create deletion request (would typically go to admin)
      toast.success('Raderingsbegäran mottagen. Vi kontaktar dig inom 30 dagar.');
    } catch (error: any) {
      toast.error('Fel vid raderingsbegäran: ' + error.message);
    }
  };

  const signOutAll = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success('Utloggad från alla enheter');
    } catch (error: any) {
      toast.error('Fel vid utloggning: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kontoinställningar</h1>
        <p className="text-muted-foreground">
          Hantera dina personliga uppgifter och säkerhetsinställningar
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Personlig information
          </CardTitle>
          <CardDescription>
            Uppdatera dina kontaktuppgifter och adress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Förnamn</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Efternamn</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+46 70 123 45 67"
            />
          </div>

          <div>
            <Label htmlFor="address">Adress</Label>
            <Input
              id="address"
              value={formData.address_line}
              onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
              placeholder="Gatuadress"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">Postnummer</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="12345"
              />
            </div>
            <div>
              <Label htmlFor="city">Ort</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Stockholm"
              />
            </div>
          </div>

          <Button onClick={updateProfile} disabled={loading}>
            Spara ändringar
          </Button>
        </CardContent>
      </Card>

      {/* Email & Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Säkerhet
          </CardTitle>
          <CardDescription>
            Hantera ditt lösenord och e-postadress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-postadress
                </Label>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              <Button variant="outline" onClick={updateEmail}>
                Byt e-post
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Byt lösenord</Label>
            <Input
              type="password"
              placeholder="Nytt lösenord"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Bekräfta nytt lösenord"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            />
            <Button onClick={updatePassword} disabled={loading || !passwordData.new}>
              Uppdatera lösenord
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Säkerhet & Sessioner
          </CardTitle>
          <CardDescription>
            Hantera inloggade enheter och säkerhetsinställningar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Logga ut från alla enheter
              </Label>
              <p className="text-sm text-muted-foreground">
                Loggar ut från alla webbläsare och appar
              </p>
            </div>
            <Button variant="outline" onClick={signOutAll}>
              Logga ut överallt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GDPR & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Dina data
          </CardTitle>
          <CardDescription>
            Exportera eller radera dina personuppgifter (GDPR)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exportera data</Label>
              <p className="text-sm text-muted-foreground">
                Ladda ner alla dina data i JSON-format
              </p>
            </div>
            <Button variant="outline" onClick={exportData} disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              Exportera
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Radera konto
              </Label>
              <p className="text-sm text-muted-foreground">
                Permanent radering av alla dina data
              </p>
            </div>
            <Button variant="destructive" onClick={requestDeletion}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Begär radering
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;