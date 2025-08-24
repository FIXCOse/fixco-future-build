import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Thermometer, 
  Droplets, 
  Zap, 
  Wifi, 
  Shield,
  TrendingDown,
  Settings,
  Home,
  Smartphone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface IoTDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'security' | 'sensor';
  status: boolean;
  value?: number;
  unit?: string;
  icon: React.ElementType;
}

export const SmartHome = () => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<IoTDevice[]>([
    { id: '1', name: 'Vardagsrum belysning', type: 'light', status: true, value: 75, unit: '%', icon: Lightbulb },
    { id: '2', name: 'Termostat', type: 'thermostat', status: true, value: 22, unit: '°C', icon: Thermometer },
    { id: '3', name: 'Larm system', type: 'security', status: true, icon: Shield },
    { id: '4', name: 'Luftfuktighet', type: 'sensor', status: true, value: 45, unit: '%', icon: Droplets },
  ]);

  const [energyData, setEnergyData] = useState({
    currentUsage: 2.4, // kW
    dailyUsage: 28.5, // kWh
    monthlyBudget: 850, // kWh
    monthlyUsed: 542, // kWh
    savings: 1250, // kr
    co2Reduced: 156 // kg
  });

  const [automationRules, setAutomationRules] = useState([
    { id: '1', name: 'Kvällsbelysning', active: true, description: 'Dimma lamporna automatiskt efter 20:00' },
    { id: '2', name: 'Energisparläge', active: true, description: 'Minska värme när ingen är hemma' },
    { id: '3', name: 'Säkerhetsläge', active: false, description: 'Aktivera larm när alla lämnar hemmet' }
  ]);

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: !device.status }
        : device
    ));
    toast.success('Enhet uppdaterad');
  };

  const updateDeviceValue = (deviceId: string, value: number) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, value }
        : device
    ));
  };

  const toggleAutomation = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? { ...rule, active: !rule.active }
        : rule
    ));
    toast.success('Automatiseringsregel uppdaterad');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Home className="h-10 w-10 text-primary" />
            {t('smartHome.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('smartHome.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Energy Overview */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              {t('smartHome.energyConsumption')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Aktuell förbrukning</h3>
                  <div className="text-3xl font-bold text-primary">
                    {energyData.currentUsage} <span className="text-lg font-normal">kW</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Idag</h3>
                  <div className="text-2xl font-bold">
                    {energyData.dailyUsage} <span className="text-sm font-normal">kWh</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Månadsbudget</h3>
                  <Progress 
                    value={(energyData.monthlyUsed / energyData.monthlyBudget) * 100} 
                    className="mb-2" 
                  />
                  <div className="text-sm text-muted-foreground">
                    {energyData.monthlyUsed} / {energyData.monthlyBudget} kWh
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    {t('smartHome.savings')}
                  </h3>
                  <div className="text-2xl font-bold text-green-600">
                    {energyData.savings} kr
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sparad denna månad
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">CO₂ minskning</h3>
                  <div className="text-xl font-bold text-blue-600">
                    -{energyData.co2Reduced} kg
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Miljöpåverkan denna månad
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Device Control */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              {t('smartHome.devices')}
            </h2>
            
            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <device.icon className="h-4 w-4" />
                      <span className="font-medium">{device.name}</span>
                    </div>
                    <Switch
                      checked={device.status}
                      onCheckedChange={() => toggleDevice(device.id)}
                    />
                  </div>
                  
                  {device.value !== undefined && device.status && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {device.value}{device.unit}
                        </span>
                      </div>
                      <Slider
                        value={[device.value]}
                        onValueChange={([value]) => updateDeviceValue(device.id, value)}
                        max={device.type === 'thermostat' ? 30 : 100}
                        min={device.type === 'thermostat' ? 15 : 0}
                        step={1}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Automation Rules */}
        <Card className="mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t('smartHome.automation')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{rule.name}</h3>
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleAutomation(rule.id)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Konfigurera automation
            </Button>
            <Button variant="outline">
              <Wifi className="h-4 w-4 mr-2" />
              Lägg till enheter
            </Button>
          </div>
        </Card>

        {/* Integration CTA */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Vill du ha smart hemautomation?
            </h3>
            <p className="text-muted-foreground mb-6">
              Våra tekniker kan installera och konfigurera smarta hemlösningar för 
              optimal energieffektivitet och bekvämlighet.
            </p>
            <Button size="lg" variant="cta-primary">
              Begär offert för smart hem
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};