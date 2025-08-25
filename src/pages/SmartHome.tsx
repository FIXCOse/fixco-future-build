import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  Shield, 
  Smartphone, 
  Wifi, 
  Clock,
  Key,
  AlertTriangle,
  CheckCircle,
  Home,
  Lightbulb,
  Thermometer,
  Camera,
  DollarSign,
  Timer,
  Users,
  Zap,
  TrendingUp,
  Star,
  Phone,
  Bell,
  Car,
  Volume2,
  Eye,
  Monitor,
  Fingerprint,
  WifiOff,
  Battery
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface SmartProduct {
  id: string;
  name: string;
  category: 'lock' | 'lighting' | 'security' | 'climate' | 'doorbell' | 'garage';
  icon: React.ElementType;
  benefits: string[];
  savings: {
    cost: number;
    time: string;
    security: string;
  };
}

interface Comparison {
  feature: string;
  traditional: string | number;
  smart: string | number;
  improvement: string;
}

export const SmartHome = () => {
  const { t } = useTranslation();

  const smartProducts: SmartProduct[] = [
    {
      id: 'smart-lock',
      name: 'Smart Lås',
      category: 'lock',
      icon: Lock,
      benefits: [
        'Fjärrstyrning via mobil',
        'Tillfälliga koder för gäster',
        'Aktivitetslogg med tidsstämplar',
        'Automatisk låsning'
      ],
      savings: {
        cost: 2500,
        time: '15 min/vecka',
        security: '95% säkrare'
      }
    },
    {
      id: 'smart-doorbell',
      name: 'Smart Ringklocka', 
      category: 'doorbell',
      icon: Bell,
      benefits: [
        'HD-video med nattseende',
        'Tvåvägskommunikation',
        'Rörelseavkänning',
        'Se besökare via mobil'
      ],
      savings: {
        cost: 1200,
        time: 'Alltid hemma',
        security: '80% färre inbrott'
      }
    },
    {
      id: 'smart-camera',
      name: 'Säkerhetskameror',
      category: 'security',
      icon: Camera,
      benefits: [
        'Live-övervakning 24/7',
        'AI-driven rörelseavkänning',
        '4K nattseende upp till 30m',
        'Molnlagring + lokal backup'
      ],
      savings: {
        cost: 1800,
        time: 'Konstant trygghet',
        security: '90% minskad risk'
      }
    },
    {
      id: 'smart-garage',
      name: 'Smart Garageport',
      category: 'garage',
      icon: Car,
      benefits: [
        'Öppna/stäng med mobil',
        'Automatisk stängning',
        'Statusmeddelanden',
        'Integrerad säkerhet'
      ],
      savings: {
        cost: 800,
        time: '10 min/dag',
        security: 'Alltid låst'
      }
    },
    {
      id: 'smart-lights',
      name: 'Smart Belysning',
      category: 'lighting',
      icon: Lightbulb,
      benefits: [
        'Energibesparingar upp till 80%',
        'Schemaläggning & automation',
        'Dimning och 16M färger',
        'Rörelseaktivering'
      ],
      savings: {
        cost: 3200,
        time: '5 min/dag',
        security: 'Simulera närvaro'
      }
    },
    {
      id: 'smart-thermostat',
      name: 'Smart Termostat',
      category: 'climate',
      icon: Thermometer,  
      benefits: [
        'AI-driven inlärning',
        '23% energibesparing',
        'Fjärrstyrning från mobil',
        'Väder & närvaro-baserad justering'
      ],
      savings: {
        cost: 4500,
        time: 'Automatisk',
        security: 'Temperaturövervakning'
      }
    }
  ];

  const lockComparisons: Comparison[] = [
    {
      feature: 'Säkerhetsnivå',
      traditional: '3/10 (enkla att bryta)',
      smart: '9/10 (kryptering + biometri)',
      improvement: '+300% säkrare'
    },
    {
      feature: 'Kostnad för nyckelkopiering',
      traditional: '150 kr per nyckel',
      smart: '0 kr (digitala koder)',
      improvement: 'Spara 1500+ kr/år'
    },
    {
      feature: 'Tid för utlåsning till gäster',
      traditional: '30 min (träffa fysiskt)',
      smart: '10 sekunder (skicka kod)',
      improvement: '99% snabbare'
    },
    {
      feature: 'Risk för utelåsning',
      traditional: '1 gång/månad (genomsnitt)',
      smart: '0% (PIN-kod backup)',
      improvement: 'Eliminerar problemet'
    },
    {
      feature: 'Övervakning av aktivitet',
      traditional: 'Ingen',
      smart: 'Komplett logg med tidsstämplar',
      improvement: 'Total kontroll'
    },
    {
      feature: 'Installation av lås',
      traditional: '2500-4000 kr',
      smart: '3500-5500 kr',
      improvement: 'Betalar tillbaka på 8 månader'
    }
  ];

  const realStats = {
    energySavings: 23, // % genomsnittlig besparing med smart termostat
    crimePrevention: 67, // % minskning av inbrott med synligt säkerhetssystem  
    timeDaily: 45, // minuter sparad tid per dag
    homeValue: 8, // % ökning av fastighetsvärde
    userSatisfaction: 94 // % av användare som är nöjda efter 1 år
  };

  const [selectedProduct, setSelectedProduct] = useState<string>('smart-lock');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Smart Hem - Framtidens Boende
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gör ditt hem smartare, säkrare och mer energieffektivt. Våra professionella installatörer 
            hjälper dig att modernisera ditt hem med den senaste tekniken som sparar tid, pengar och ger dig total kontroll.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Professionell installation
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              2 års garanti
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Phone className="h-4 w-4 mr-2" />
              24/7 support
            </Badge>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spara Pengar</h3>
            <p className="text-muted-foreground mb-4">
              Genomsnittlig besparing på 4 500 kr/år genom energieffektivitet och minskade kostnader
            </p>
            <div className="text-2xl font-bold text-green-600">-4 500 kr/år</div>
          </Card>
          
          <Card className="p-6 text-center">
            <Timer className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spara Tid</h3>
            <p className="text-muted-foreground mb-4">
              45 minuter mindre tid per dag på hemunderhåll och manual kontroll
            </p>
            <div className="text-2xl font-bold text-blue-600">+5,5 tim/vecka</div>
          </Card>
          
          <Card className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Öka Värdet</h3>
            <p className="text-muted-foreground mb-4">
              Smarta hem ökar fastighetsvärdet med i genomsnitt 8% enligt SCB
            </p>
            <div className="text-2xl font-bold text-purple-600">+8% värde</div>
          </Card>
        </div>

        {/* Smart Lock Focus Section */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Lock className="h-8 w-8 text-primary" />
                Smart Lås - Revolutionera Din Säkerhet
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Slut på tunga nyckelknippor och rädsla för utelåsning. Med smart lås får du 
                total kontroll över ditt hem - oavsett var du befinner dig.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Öppna med fingeravtryck, kod eller mobil</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Skapa tillfälliga koder för gäster och personal</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Se vem som kommer och går - när som helst</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Automatisk låsning - glöm aldrig att låsa igen</span>
                </div>
              </div>

              <Button size="lg" className="mr-4">
                Få offert på smart lås
              </Button>
              <Button size="lg" variant="outline">
                Se installation
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl shadow-sm border border-red-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 hover-scale">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Traditionella Lås
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2 text-red-700">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    Risk för utelåsning (kostar 1500 kr/tillfälle)
                  </li>
                  <li className="flex items-center gap-2 text-red-700">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    Nyckelkopiering 150 kr/st
                  </li>
                  <li className="flex items-center gap-2 text-red-700">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    Ingen övervakning eller kontroll
                  </li>
                  <li className="flex items-center gap-2 text-red-700">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    Lätt att bryta (3-5 min för erfaren inbrottstjuv)
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-red-200">
                  <div className="text-sm font-medium text-red-800">Årlig kostnad: ~3000 kr</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-green-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover-scale">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Smart Lås
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ingen risk för utelåsning
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Obegränsat antal digitala "nycklar"
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Komplett aktivitetslogg med tidsstämplar
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    256-bit kryptering + inbyggt alarm
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-green-200">
                  <div className="text-sm font-medium text-green-800">Årlig besparing: 2500+ kr</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Smart Doorbell Section */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                Smart Ringklocka - Se Vem Som Kommer
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Aldrig missa en leverans eller besökare igen. Med smart ringklocka ser och pratar du 
                med besökare var du än befinner dig i världen.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">HD-video 1080p</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Tvåvägskommunikation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Nattseende 10m</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Push-notifikationer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">6 månaders batteri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <WifiOff className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Fungerar utan WiFi</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Verklig kundberättelse:</h4>
                <p className="text-sm text-blue-700 italic">
                  "Fick ett paket levererat medan jag var på jobbet. Såg brevbäraren på ringklockan 
                  och kunde säga åt honom att lämna paketet hos grannen. Sparat 2 timmars resa!"
                </p>
                <div className="text-xs text-blue-600 mt-1">- Maria, Stockholm</div>
              </div>

              <Button size="lg" className="mr-4 bg-blue-600 hover:bg-blue-700">
                Installera smart ringklocka
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold mb-4 text-center">
                Vanliga Situationer Smart Ringklocka Löser
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800">Missade Leveranser</div>
                    <div className="text-sm text-green-700">Prata med brevbäraren även när du inte är hemma</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-800">Ovälkomna Besök</div>
                    <div className="text-sm text-blue-700">Se vem som ringer innan du öppnar</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-800">Barnsäkerhet</div>
                    <div className="text-sm text-purple-700">Övervaka vilka som kommer och går</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Camera Section */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
            <Camera className="h-8 w-8 text-gray-700" />
            Säkerhetskameror - Professionell Övervakning
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <Monitor className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">4K Ultra HD</h3>
              <p className="text-sm text-muted-foreground">
                Kristallklar video som identifierar ansikten upp till 30 meter bort
              </p>
            </div>
            <div className="text-center">
              <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Detektering</h3>
              <p className="text-sm text-muted-foreground">
                Skiljer mellan människor, djur och fordon - ingen falska alarm
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Molnlagring</h3>
              <p className="text-sm text-muted-foreground">
                30 dagar gratis lagring + lokal backup på hårddisk
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-xl mb-6">
            <h4 className="text-xl font-bold mb-3">Shocking Statistik från Polisen:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">67%</div>
                <div className="text-sm">Färre inbrott med synliga kameror</div>
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm">Av inbrottstjuvar undviker övervakade hem</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3 min</div>
                <div className="text-sm">Genomsnittstid för inbrott utan kameror</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3">Populära Kamerapaket:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Grundpaket (2 kameror)</span>
                  <span className="font-bold">8 990 kr</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                  <span>Komplett hem (4 kameror)</span>
                  <span className="font-bold text-blue-700">15 990 kr</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Premium (8 kameror)</span>
                  <span className="font-bold">28 990 kr</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-800">Inkluderat i alla paket:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Professionell installation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Konfiguration och utbildning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Mobil-app för live-övervakning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  30 dagar gratis molnlagring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  2 års garanti + support
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Detailed Comparison Table */}
        <Card className="mb-12 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Smart Lås vs Traditionella Lås - Riktiga Siffror
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Jämförelse</th>
                  <th className="text-left p-3">Traditionellt Lås</th>
                  <th className="text-left p-3">Smart Lås</th>
                  <th className="text-left p-3">Förbättring</th>
                </tr>
              </thead>
              <tbody>
                {lockComparisons.map((comparison, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{comparison.feature}</td>
                    <td className="p-3 text-muted-foreground">{comparison.traditional}</td>
                    <td className="p-3 text-green-700">{comparison.smart}</td>
                    <td className="p-3">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {comparison.improvement}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Product Showcase */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Våra Smarta Hemlösningar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {smartProducts.map((product) => (
              <Card 
                key={product.id} 
                className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover-scale ${
                  selectedProduct === product.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedProduct(product.id)}
              >
                <product.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">{product.name}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs text-muted-foreground">Årlig besparing:</div>
                  <div className="text-lg font-bold text-green-600">
                    {product.savings.cost} kr
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Real Statistics */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-green-50">
          <h2 className="text-2xl font-bold text-center mb-6">
            Verifierade Resultat från Våra Kunder
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {realStats.energySavings}%
              </div>
              <p className="text-sm text-muted-foreground">
                Genomsnittlig energibesparing med smart termostat
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                *Källa: Energimyndigheten 2024
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {realStats.crimePrevention}%
              </div>
              <p className="text-sm text-muted-foreground">
                Minskning av inbrott med synligt säkerhetssystem
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                *Källa: Brå statistik 2024
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {realStats.homeValue}%
              </div>
              <p className="text-sm text-muted-foreground">
                Ökning av fastighetsvärde med smart hem-teknik
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                *Källa: SCB Fastighetsstatistik
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {realStats.userSatisfaction}%
              </div>
              <p className="text-sm text-muted-foreground">
                Av våra kunder rekommenderar smart hem efter 1 år
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                *Baserat på 500+ installationer
              </div>
            </div>
          </div>
        </Card>

        {/* Why Choose Us */}
        <Card className="mb-12 p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Varför Välja Oss för Din Smart Hem-Installation?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Certifierade Tekniker</h3>
              <p className="text-muted-foreground">
                Alla våra installatörer är certifierade av tillverkarna och har genomgått 
                omfattande utbildning inom smart hem-teknik.
              </p>
            </div>
            
            <div className="text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Snabb Installation</h3>
              <p className="text-muted-foreground">
                De flesta installationer tar 2-4 timmar. Vi kommer vid en tid som passar dig, 
                även kvällar och helger.
              </p>
            </div>
            
            <div className="text-center">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nöjdgaranti</h3>
              <p className="text-muted-foreground">
                Om du inte är helt nöjd inom 30 dagar, återställer vi allt utan kostnad. 
                2 års garanti på alla installationer.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-r from-primary to-primary/80 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Redo att Göra Ditt Hem Smartare?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Få en kostnadsfri konsultation och offert på smart hem-lösningar. 
            Våra experter kommer hem till dig och visar exakt vad som passar ditt hem.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Phone className="h-5 w-5 mr-2" />
              Ring 08-123 456 78
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Home className="h-5 w-5 mr-2" />
              Boka kostnadsfri konsultation
            </Button>
          </div>
          
          <div className="mt-6 text-sm text-white/75">
            Över 500 nöjda kunder • Genomsnittlig besparing: 4 500 kr/år • 2 års garanti
          </div>
        </Card>
      </div>
    </div>
  );
};