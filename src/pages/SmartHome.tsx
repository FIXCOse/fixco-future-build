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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            Smart Hem - Verkliga Produkter
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto font-medium">
            Vi installerar endast beprövade, marknadsledande smart hem-produkter från världens största tillverkare. 
            Alla produkter kommer med fullständig garanti och professionell installation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              Marknadsledande Märken
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
              <Shield className="h-5 w-5 mr-2" />
              Fullständig Garanti
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
              <Settings className="h-5 w-5 mr-2" />
              Professionell Installation
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Välj Produktkategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`p-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-110 border-0 bg-gradient-to-br from-gray-800 to-gray-900 ${
                  selectedCategory === category.id 
                    ? 'ring-4 ring-cyan-400 shadow-2xl transform scale-110 shadow-cyan-400/50' 
                    : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`${category.color} text-white p-6 rounded-t-lg mb-0 text-center shadow-2xl`}>
                  <category.icon className="h-10 w-10 mx-auto mb-3 drop-shadow-lg" />
                  <h3 className="font-bold text-sm drop-shadow-lg">{category.name}</h3>
                </div>
                <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-lg">
                  <p className="text-xs text-gray-300 text-center font-medium">
                    {category.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            {selectedCategory === 'all' ? 'Alla Smart Hem-Produkter' : `${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer border-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 text-white"
                onClick={() => setSelectedProduct(product.id)}
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <product.icon className="h-12 w-12 text-white drop-shadow-lg" />
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 border-0 font-bold shadow-lg">
                        {product.brand}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{product.name}</h3>
                    <p className="text-white/90 text-sm mb-4 font-medium">{product.model}</p>
                    <div className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
                      {product.pricing.total.toLocaleString()} kr
                    </div>
                    <div className="text-xs text-white/80 font-medium">
                      Inkl. installation & setup
                    </div>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  {/* Real Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-3 text-gray-100 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Huvudfunktioner:
                    </h4>
                    <ul className="space-y-2">
                      {product.realFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Features */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-400/30 backdrop-blur-sm">
                    <h4 className="font-semibold mb-3 text-purple-300 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Smarta Funktioner:
                    </h4>
                    <ul className="space-y-2">
                      {product.realAIFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="h-3 w-3 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white border-0 shadow-xl font-bold py-3 text-lg">
                    Boka Installation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Why These Brands */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 border-0 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Varför Vi Valt Dessa Märken
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Star className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">Marknadsledare</h3>
              <p className="text-sm text-gray-300">
                Alla märken är #1 eller #2 i sina kategorier globalt. 
                Beprövad teknik med miljontals installationer.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Shield className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">Säker Integration</h3>
              <p className="text-sm text-gray-300">
                Alla produkter fungerar tillsammans och har säkra 
                protokoll som Zigbee 3.0 och WiFi 6.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Settings className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">Enkel Support</h3>
              <p className="text-sm text-gray-300">
                Vi är certifierade installatörer för alla märken. 
                En kontakt för alla dina smart hem-behov.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <TrendingUp className="h-8 w-8 drop-shadow-lg" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-100">Framtidssäkert</h3>
              <p className="text-sm text-gray-300">
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