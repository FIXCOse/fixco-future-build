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
  Battery,
  Scissors,
  Bot,
  Wind,
  Droplets,
  Music,
  Coffee,
  Refrigerator,
  Tv,
  Speaker,
  Gamepad2,
  Brain,
  Target,
  Leaf,
  Settings,
  Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface SmartProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'security' | 'lighting' | 'climate' | 'cleaning' | 'garden' | 'entertainment';
  icon: React.ElementType;
  realFeatures: string[];
  realAIFeatures: string[];
  installation: {
    time: string;
    difficulty: string;
    included: string[];
  };
  pricing: {
    product: number;
    installation: number;
    total: number;
  };
  warranty: string;
}

interface CategoryFilter {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

export const SmartHome = () => {
  const { t } = useTranslation();

  const categories: CategoryFilter[] = [
    {
      id: 'all',
      name: 'Alla Produkter',
      icon: Home,
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      description: 'Komplett smart hem-upplevelse'
    },
    {
      id: 'security',
      name: 'Säkerhet & Lås',
      icon: Shield,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      description: 'Skydda ditt hem'
    },
    {
      id: 'lighting',
      name: 'Smart Belysning',
      icon: Lightbulb,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      description: 'Energisnål belysning'
    },
    {
      id: 'climate',
      name: 'Klimat & Värme',
      icon: Thermometer,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Temperaturstyrning'
    },
    {
      id: 'cleaning',
      name: 'Robotar',
      icon: Bot,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      description: 'Automatisk rengöring'
    },
    {
      id: 'garden',
      name: 'Trädgård',
      icon: Leaf,
      color: 'bg-gradient-to-r from-green-400 to-lime-500',
      description: 'Smart trädgårdsskötsel'
    }
  ];

  // ENDAST RIKTIGA PRODUKTER SOM FINNS PÅ MARKNADEN
  const smartProducts: SmartProduct[] = [
    // SÄKERHET
    {
      id: 'yale-doorman',
      name: 'Yale Doorman L3',
      brand: 'Yale',
      model: 'Doorman L3',
      category: 'security',
      icon: Lock,
      realFeatures: [
        'Fingeravtryck + PIN-kod',
        'Bluetooth + WiFi',
        'Skandinaviskt godkänt lås',
        'Batteri 12+ månader'
      ],
      realAIFeatures: [
        'Lär sig dina rutiner',
        'Automatisk låsning',
        'Aktivitetslogg med mönsterigenkänning'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Installation', 'Konfiguration', 'Utbildning']
      },
      pricing: {
        product: 4990,
        installation: 1500,
        total: 6490
      },
      warranty: '2 år'
    },
    {
      id: 'ring-video-doorbell',
      name: 'Ring Video Doorbell Pro 2',
      brand: 'Ring (Amazon)',
      model: 'Video Doorbell Pro 2',
      category: 'security',
      icon: Bell,
      realFeatures: [
        '1536p HD-video',
        'Rörelsezoner',
        'Tvåvägskommunikation',
        'Nattseende'
      ],
      realAIFeatures: [
        'Paketdetektering',
        'Personigenkänning',
        'Smart rörelseavkänning'
      ],
      installation: {
        time: '1-2 timmar',
        difficulty: 'Lätt',
        included: ['Montering', 'WiFi-setup', 'App-konfiguration']
      },
      pricing: {
        product: 2490,
        installation: 800,
        total: 3290
      },
      warranty: '1 år'
    },
    {
      id: 'arlo-pro-4',
      name: 'Arlo Pro 4 Spotlight',
      brand: 'Arlo',
      model: 'Pro 4 Spotlight',
      category: 'security',
      icon: Camera,
      realFeatures: [
        '2K HDR-video',
        '6 månaders batteri',
        'Inbyggt spotlight',
        'Färg-nattseende'
      ],
      realAIFeatures: [
        'Objekt & persondetektering',
        'Smart siren',
        'Automatisk zoom & spårning'
      ],
      installation: {
        time: '3-4 timmar för 4 kameror',
        difficulty: 'Medium',
        included: ['Montering', 'Positionering', 'Molnsetup']
      },
      pricing: {
        product: 12990, // För 4-pack
        installation: 2500,
        total: 15490
      },
      warranty: '2 år'
    },

    // BELYSNING
    {
      id: 'philips-hue',
      name: 'Philips Hue White & Color',
      brand: 'Philips',
      model: 'Hue White & Color Ambiance',
      category: 'lighting',
      icon: Lightbulb,
      realFeatures: [
        '16 miljoner färger',
        'Dimbar 1-100%',
        'Zigbee 3.0',
        '25 000 timmars livslängd'
      ],
      realAIFeatures: [
        'Adaptiv belysning baserat på tid',
        'Geofencing (automatisk på/av)',
        'Synkroniseras med solens rytm'
      ],
      installation: {
        time: '2-3 timmar för hela hemmet',
        difficulty: 'Lätt',
        included: ['Installation av Hue Bridge', 'Lampbyten', 'App-setup']
      },
      pricing: {
        product: 8990, // Startpaket + extra lampor
        installation: 1200,
        total: 10190
      },
      warranty: '2 år'
    },

    // KLIMAT
    {
      id: 'google-nest-learning',
      name: 'Google Nest Learning Thermostat',
      brand: 'Google',
      model: 'Nest Learning Thermostat 3rd Gen',
      category: 'climate',
      icon: Thermometer,
      realFeatures: [
        'Läckagesensor för rör',
        'Väderprognos-integration',
        'Fjärrstyrning via app',
        'Energihistorik'
      ],
      realAIFeatures: [
        'Lär sig dina vanor på 1 vecka',
        'Auto-Schedule funktion',
        'Före/efter rapporter på energianvändning'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Installation', 'Konfiguration', 'Kalibrering']
      },
      pricing: {
        product: 2890,
        installation: 1800,
        total: 4690
      },
      warranty: '2 år'
    },

    // ROBOTAR/RENGÖRING  
    {
      id: 'roomba-j7',
      name: 'iRobot Roomba j7+',
      brand: 'iRobot',
      model: 'Roomba j7+',
      category: 'cleaning',
      icon: Bot,
      realFeatures: [
        'PrecisionVision navigation',
        'Självtömmande bas 60 dagar',
        'Kartläggning av hela hemmet',
        '3-stegs rengöringssystem'
      ],
      realAIFeatures: [
        'Undviker husdjursolyckor (P.O.O.P Promise)',
        'Lär sig hemmet layout',
        'Föreslår optimal städschema'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Lätt',
        included: ['Uppackning', 'Setup', 'Första kartläggning']
      },
      pricing: {
        product: 12990,
        installation: 500,
        total: 13490
      },
      warranty: '1 år'
    },

    // TRÄDGÅRD
    {
      id: 'husqvarna-automower',
      name: 'Husqvarna Automower 315X',
      brand: 'Husqvarna',
      model: 'Automower 315X',
      category: 'garden',
      icon: Scissors,
      realFeatures: [
        'GPS-navigation & tracking',
        'Klippytor upp till 1500m²',
        'Mulchning för friskare gräs',
        'Automatisk regndetektering'
      ],
      realAIFeatures: [
        'X-line navigation (AI-driven routing)',
        'Weather timer (anpassar efter väder)',
        'Automower Connect app med AI-analys'
      ],
      installation: {
        time: '4-6 timmar',
        difficulty: 'Svår',
        included: ['Gränstråd installation', 'Laddstation', 'GPS-konfiguration']
      },
      pricing: {
        product: 28990,
        installation: 4500,
        total: 33490
      },
      warranty: '2 år'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('yale-doorman');

  const filteredProducts = selectedCategory === 'all' 
    ? smartProducts 
    : smartProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Smart Hem - Verkliga Produkter
          </h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
            Vi installerar endast beprövade, marknadsledande smart hem-produkter från världens största tillverkare. 
            Alla produkter kommer med fullständig garanti och professionell installation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 border-0">
              <CheckCircle className="h-5 w-5 mr-2" />
              Marknadsledande Märken
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border-0">
              <Shield className="h-5 w-5 mr-2" />
              Fullständig Garanti
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 border-0">
              <Settings className="h-5 w-5 mr-2" />
              Professionell Installation
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Välj Produktkategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-blue-500 shadow-xl transform scale-105' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`${category.color} text-white p-4 rounded-xl mb-3 text-center shadow-lg`}>
                  <category.icon className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-bold text-sm">{category.name}</h3>
                </div>
                <p className="text-xs text-gray-600 text-center font-medium">
                  {category.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {selectedCategory === 'all' ? 'Alla Smart Hem-Produkter' : `${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50"
                onClick={() => setSelectedProduct(product.id)}
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <product.icon className="h-12 w-12 text-cyan-400" />
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                        {product.brand}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{product.model}</p>
                    <div className="text-2xl font-bold text-cyan-400">
                      {product.pricing.total.toLocaleString()} kr
                    </div>
                    <div className="text-xs text-gray-400">
                      Inkl. installation & setup
                    </div>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  {/* Real Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Huvudfunktioner:
                    </h4>
                    <ul className="space-y-2">
                      {product.realFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Features */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                    <h4 className="font-semibold mb-3 text-purple-800 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Smarta Funktioner:
                    </h4>
                    <ul className="space-y-2">
                      {product.realAIFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Installation Info */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h4 className="font-semibold mb-2 text-green-800 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Installation:
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-green-600 font-medium">Tid:</span>
                        <div className="text-green-700">{product.installation.time}</div>
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">Garanti:</span>
                        <div className="text-green-700">{product.warranty}</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <h4 className="font-semibold mb-2 text-orange-800">Priser:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-orange-700">Produkt:</span>
                        <span className="font-medium">{product.pricing.product.toLocaleString()} kr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700">Installation:</span>
                        <span className="font-medium">{product.pricing.installation.toLocaleString()} kr</span>
                      </div>
                      <div className="flex justify-between border-t border-orange-200 pt-1 font-bold">
                        <span className="text-orange-800">Totalt:</span>
                        <span className="text-orange-800">{product.pricing.total.toLocaleString()} kr</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                    Boka Installation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Why These Brands */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Varför Vi Valt Dessa Märken
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Marknadsledare</h3>
              <p className="text-sm text-gray-600">
                Alla märken är #1 eller #2 i sina kategorier globalt. 
                Beprövad teknik med miljontals installationer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Säker Integration</h3>
              <p className="text-sm text-gray-600">
                Alla produkter fungerar tillsammans och har säkra 
                protokoll som Zigbee 3.0 och WiFi 6.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Enkel Support</h3>
              <p className="text-sm text-gray-600">
                Vi är certifierade installatörer för alla märken. 
                En kontakt för alla dina smart hem-behov.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Framtidssäkert</h3>
              <p className="text-sm text-gray-600">
                Alla produkter får regelbundna uppdateringar med 
                nya funktioner. Din investering växer över tid.
              </p>
            </div>
          </div>
        </Card>

        {/* Final CTA */}
        <Card className="p-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center border-0 shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">
            Redo för Professionell Smart Hem-Installation?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Boka en kostnadsfri hemkonsultation idag. Vi kommer hem till dig med produkterna, 
            visar hur de fungerar och ger dig en exakt offert på installationen.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg border-0 shadow-lg">
              <Phone className="h-6 w-6 mr-3" />
              Ring 08-123 456 78
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
              <Home className="h-6 w-6 mr-3" />
              Boka Hemkonsultation
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Kostnadsfri konsultation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Certifierade installatörer
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              2 års fullgaranti
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};