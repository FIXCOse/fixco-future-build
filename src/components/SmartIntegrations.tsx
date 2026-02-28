import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Smartphone, Wifi, Zap, Shield, Camera, Thermometer,
  Lightbulb, Speaker, Lock, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { useCopy } from '@/copy/CopyProvider';

interface SmartDevice {
  id: string;
  name: string;
  category: 'security' | 'comfort' | 'energy' | 'entertainment';
  brand: string;
  connected: boolean;
  rotEligible: boolean;
  installCost: number;
  icon: React.ElementType;
}

export const SmartIntegrations = () => {
  const { t } = useCopy();

  const [devices, setDevices] = useState<SmartDevice[]>([
    { id: '1', name: 'Smart Termostat', category: 'energy', brand: 'Nest', connected: false, rotEligible: true, installCost: 8500, icon: Thermometer },
    { id: '2', name: 'Smart Belysning', category: 'comfort', brand: 'Philips Hue', connected: true, rotEligible: false, installCost: 3200, icon: Lightbulb },
    { id: '3', name: 'Säkerhetskamera', category: 'security', brand: 'Ring', connected: false, rotEligible: true, installCost: 12000, icon: Camera },
    { id: '4', name: 'Smart Lås', category: 'security', brand: 'Yale', connected: true, rotEligible: true, installCost: 6500, icon: Lock },
    { id: '5', name: 'Multirumshögtalare', category: 'entertainment', brand: 'Sonos', connected: false, rotEligible: false, installCost: 4800, icon: Speaker },
  ]);

  const [integrationStats] = useState({
    connectedDevices: devices.filter(d => d.connected).length,
    totalDevices: devices.length,
    monthlySavings: 850,
    energyReduction: 23
  });

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device =>
      device.id === deviceId ? { ...device, connected: !device.connected } : device
    ));
    const device = devices.find(d => d.id === deviceId);
    toast.success(`${device?.name} ${device?.connected ? t('smart.statusDisconnected').toLowerCase() : t('smart.statusConnected').toLowerCase()}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-500/10 text-red-700';
      case 'comfort': return 'bg-blue-500/10 text-blue-700';
      case 'energy': return 'bg-green-500/10 text-green-700';
      case 'entertainment': return 'bg-purple-500/10 text-purple-700';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'security': return t('smart.catSecurity');
      case 'comfort': return t('smart.catComfort');
      case 'energy': return t('smart.catEnergy');
      case 'entertainment': return t('smart.catEntertainment');
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Wifi className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{integrationStats.connectedDevices}/{integrationStats.totalDevices}</div>
              <div className="text-sm text-muted-foreground">{t('smart.connectedDevices')}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{integrationStats.monthlySavings} kr</div>
              <div className="text-sm text-muted-foreground">{t('smart.monthlySavings')}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">-{integrationStats.energyReduction}%</div>
              <div className="text-sm text-muted-foreground">{t('smart.energyConsumption')}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-500" />
            <div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">{t('smart.systemUptime')}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Smartphone className="h-6 w-6" />
          {t('smart.devicesTitle')}
        </h2>
        
        <div className="grid gap-4">
          {devices.map((device) => {
            const IconComponent = device.icon;
            return (
              <div key={device.id} className={`border rounded-lg p-4 transition-colors ${device.connected ? 'bg-accent/10 border-accent/20' : 'bg-muted'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${device.connected ? 'bg-accent/20' : 'bg-muted/50'}`}>
                      <IconComponent className={`h-5 w-5 ${device.connected ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-sm text-muted-foreground">{device.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(device.category)}>{getCategoryText(device.category)}</Badge>
                    {device.rotEligible && (
                      <Badge variant="outline" className="text-green-600 border-green-600">{t('smart.rotEligible')}</Badge>
                    )}
                    <Switch checked={device.connected} onCheckedChange={() => toggleDevice(device.id)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('smart.installCost')}</span>
                    <div className="font-medium">
                      {device.installCost.toLocaleString()} kr
                      {device.rotEligible && (
                        <span className="text-green-600 ml-2">(-{Math.round(device.installCost * 0.3).toLocaleString()} kr {t('smart.withRot')})</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className={`font-medium ${device.connected ? 'text-accent' : 'text-muted-foreground'}`}>
                      {device.connected ? t('smart.statusConnected') : t('smart.statusDisconnected')}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('smart.category')}</span>
                    <div className="font-medium">{getCategoryText(device.category)}</div>
                  </div>
                </div>

                {!device.connected && (
                  <div className="mt-3 pt-3 border-t flex gap-2">
                    <Button variant="outline" size="sm">{t('smart.readMoreInstall')}</Button>
                    <Button variant="cta-primary" size="sm">{t('smart.requestInstallQuote')}</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">{t('smart.ctaTitle')}</h3>
          <p className="text-muted-foreground mb-6">{t('smart.ctaDesc')}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline">
              <Smartphone className="h-4 w-4 mr-2" />
              {t('smart.freeConsultation')}
            </Button>
            <Button variant="cta-primary">
              <Zap className="h-4 w-4 mr-2" />
              {t('smart.requestFullQuote')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};