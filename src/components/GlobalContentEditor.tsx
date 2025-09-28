import React, { useState } from 'react';
import { Palette, Layout, Globe, FileText, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditMode } from '@/contexts/EditModeContext';
import { useRoleGate } from '@/hooks/useRoleGate';
import { toast } from 'sonner';
import { useContentStore } from '@/stores/contentStore';

interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  chatEnabled: boolean;
}

export const GlobalContentEditor: React.FC = () => {
  const { isEditMode } = useEditMode();
  const { isAdmin, isOwner } = useRoleGate();
  const { updateGlobalSettings, globalSettings } = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(globalSettings);

  if (!isEditMode || (!isAdmin && !isOwner)) {
    return null;
  }

  const handleSave = async () => {
    try {
      // Save to store and database
      await updateGlobalSettings(settings);
      
      toast.success('Globala inställningar sparade!');
      setIsOpen(false);
      
      // Apply settings immediately if needed
      if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
      }
    } catch (error) {
      console.error('Failed to save global settings:', error);
      toast.error('Misslyckades att spara inställningar');
    }
  };

  const updateSetting = (key: keyof GlobalSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          variant="outline"
          className="shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full p-4"
        >
          <Globe className="h-5 w-5 mr-2" />
          Globala inställningar
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Globala Inställningar
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Allmänt</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="contact">Kontakt</TabsTrigger>
              <TabsTrigger value="features">Funktioner</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Webbplatsnamn</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    placeholder="Fixco"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Beskrivning</Label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    placeholder="Professionella hemtjänster..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logotyp URL</Label>
                  <Input
                    value={settings.logoUrl}
                    onChange={(e) => updateSetting('logoUrl', e.target.value)}
                    placeholder="/assets/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Favicon URL</Label>
                  <Input
                    value={settings.faviconUrl}
                    onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primär färg</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sekundär färg</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Kontakt E-post</Label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    placeholder="info@fixco.se"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Telefonnummer</Label>
                  <Input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => updateSetting('contactPhone', e.target.value)}
                    placeholder="08-123 456 78"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Underhållsläge</Label>
                    <p className="text-sm text-muted-foreground">Stäng av webbplatsen för underhåll</p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Aktivera webbanalys</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="chat">AI Chat</Label>
                    <p className="text-sm text-muted-foreground">Aktivera AI-chatfunktion</p>
                  </div>
                  <Switch
                    id="chat"
                    checked={settings.chatEnabled}
                    onCheckedChange={(checked) => updateSetting('chatEnabled', checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Spara inställningar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};