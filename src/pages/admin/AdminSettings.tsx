import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Mail, Bell, Shield, Database, Save, Globe } from 'lucide-react';
import AdminBack from '@/components/admin/AdminBack';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Fixco AB',
    companyEmail: 'info@fixco.se',
    companyPhone: '08-123 456 78',
    vatNumber: 'SE123456789012',
    defaultHourlyRate: 650,
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    autoBackup: true,
    maintenanceMode: false,
  });

  const [isPinging, setIsPinging] = useState(false);
  const [lastPing, setLastPing] = useState<{ pinged_at: string; status: string } | null>(null);

  useEffect(() => {
    loadLastPing();
  }, []);

  const loadLastPing = async () => {
    try {
      const { data, error } = await supabase
        .from('sitemap_pings')
        .select('pinged_at, status')
        .order('pinged_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      if (data) setLastPing(data);
    } catch (error) {
      console.error('Error loading last ping:', error);
    }
  };

  const handleSave = () => {
    // Mock save functionality
    toast.success('Inställningar sparade');
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePingGoogle = async () => {
    setIsPinging(true);
    try {
      const { data, error } = await supabase.functions.invoke('ping-google-sitemap');

      if (error) throw error;

      if (data?.success) {
        toast.success('✅ Google Sitemap pingad!', {
          description: 'Google Search Console har meddelats om sitemap-uppdateringen.'
        });
        await loadLastPing();
      } else {
        throw new Error(data?.message || 'Ping misslyckades');
      }
    } catch (error) {
      console.error('Ping error:', error);
      toast.error('❌ Kunde inte pinga Google', {
        description: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
      });
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBack />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Systeminställningar</h1>
          <p className="text-muted-foreground">Hantera globala inställningar för systemet</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Spara ändringar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Företagsinformation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Företagsnamn</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">E-post</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Telefon</Label>
              <Input
                id="companyPhone"
                value={settings.companyPhone}
                onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatNumber">Organisationsnummer</Label>
              <Input
                id="vatNumber"
                value={settings.vatNumber}
                onChange={(e) => handleSettingChange('vatNumber', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifieringar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">E-postnotiser</Label>
                <p className="text-sm text-muted-foreground">
                  Skicka notiser via e-post
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) => handleSettingChange('enableEmailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS-notiser</Label>
                <p className="text-sm text-muted-foreground">
                  Skicka notiser via SMS
                </p>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.enableSmsNotifications}
                onCheckedChange={(checked) => handleSettingChange('enableSmsNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultHourlyRate">Standard timpris (SEK)</Label>
              <Input
                id="defaultHourlyRate"
                type="number"
                value={settings.defaultHourlyRate}
                onChange={(e) => handleSettingChange('defaultHourlyRate', parseInt(e.target.value))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">Automatisk backup</Label>
                <p className="text-sm text-muted-foreground">
                  Säkerhetskopiera data dagligen
                </p>
              </div>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Underhållsläge</Label>
                <p className="text-sm text-muted-foreground">
                  Stäng av systemet för underhåll
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Säkerhet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Row Level Security:</strong> Aktiverad
              </p>
              <p className="text-sm">
                <strong>SSL/TLS:</strong> Aktiverad
              </p>
              <p className="text-sm">
                <strong>Sessioner:</strong> 24 timmar
              </p>
            </div>
            <Separator />
            <Button variant="outline" className="w-full">
              Visa säkerhetslogg
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              SEO & Indexering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Google Search Console</Label>
              <p className="text-sm text-muted-foreground">
                Meddela Google om sitemap-uppdateringar för snabbare indexering
              </p>
            </div>
            <Button 
              onClick={handlePingGoogle} 
              disabled={isPinging}
              className="w-full"
            >
              {isPinging ? 'Pingar...' : '🔔 Pinga Google Sitemap'}
            </Button>
            {lastPing && (
              <div className="text-sm text-muted-foreground pt-2 border-t">
                <p>
                  <strong>Senast pingad:</strong>{' '}
                  {new Date(lastPing.pinged_at).toLocaleString('sv-SE')}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={lastPing.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {lastPing.status === 'success' ? '✅ Lyckad' : '❌ Misslyckad'}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;