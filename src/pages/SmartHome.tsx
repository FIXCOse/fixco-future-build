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
  Phone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface SmartProduct {
  id: string;
  name: string;
  category: 'lock' | 'lighting' | 'security' | 'climate';
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
        'Aktivitetslogg',
        'Automatisk låsning'
      ],
      savings: {
        cost: 2500,
        time: '15 min/vecka',
        security: '95% säkrare'
      }
    },
    {
      id: 'smart-lights',
      name: 'Smart Belysning',
      category: 'lighting',
      icon: Lightbulb,
      benefits: [
        'Energibesparingar upp till 80%',
        'Schemaläggning',
        'Dimning och färgändringar',
        'Rörelseaktivering'
      ],
      savings: {
        cost: 3200,
        time: '5 min/dag',
        security: 'Simulera närvaro'
      }
    },
    {
      id: 'smart-camera',
      name: 'Säkerhetskameror',
      category: 'security',
      icon: Camera,
      benefits: [
        'Live-övervakning',
        'Rörelseavkänning',
        'Nattseende',
        'Molnlagring'
      ],
      savings: {
        cost: 1800,
        time: 'Konstant trygghet',
        security: '90% minskad risk'
      }
    },
    {
      id: 'smart-thermostat',
      name: 'Smart Termostat',
      category: 'climate',
      icon: Thermometer,
      benefits: [
        'Lär sig dina vanor',
        '23% energibesparing',
        'Fjärrstyrning',
        'Väderbaserad justering'
      ],
      savings: {
        cost: 4500,
        time: 'Automatisk',
        security: 'Övervakning'
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
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Traditionella Lås
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Risk för utelåsning (kostar 1500 kr/tillfälle)</li>
                  <li>• Nyckelkopiering 150 kr/st</li>
                  <li>• Ingen övervakning eller kontroll</li>
                  <li>• Lätt att bryta (3-5 minuter för erfaren inbrottstjuv)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Smart Lås
                </h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• Ingen risk för utelåsning</li>
                  <li>• Obegränsat antal digitala "nycklar"</li>
                  <li>• Komplett aktivitetslogg</li>
                  <li>• 256-bit kryptering + alarm</li>
                </ul>
              </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {smartProducts.map((product) => (
              <Card 
                key={product.id} 
                className={`p-6 cursor-pointer transition-all ${
                  selectedProduct === product.id ? 'ring-2 ring-primary' : ''
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