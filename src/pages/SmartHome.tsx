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
  category: 'security' | 'lighting' | 'climate' | 'cleaning' | 'garden' | 'entertainment';
  icon: React.ElementType;
  benefits: string[];
  aiFeatures: string[];
  savings: {
    cost: number;
    time: string;
    efficiency: string;
  };
  price: string;
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
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Komplett smart hem-upplevelse'
    },
    {
      id: 'security',
      name: 'Säkerhet & Lås',
      icon: Shield,
      color: 'bg-gradient-to-r from-red-500 to-orange-500',
      description: 'Skydda ditt hem med AI-teknik'
    },
    {
      id: 'lighting',
      name: 'Smart Belysning',
      icon: Lightbulb,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      description: 'Energisnål och intelligent belysning'
    },
    {
      id: 'climate',
      name: 'Klimat & Miljö',
      icon: Thermometer,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Perfekt temperatur automatiskt'
    },
    {
      id: 'cleaning',
      name: 'AI-Rengöring',
      icon: Bot,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      description: 'Robotar som städar åt dig'
    },
    {
      id: 'garden',
      name: 'Trädgård & Utomhus',
      icon: Leaf,
      color: 'bg-gradient-to-r from-green-400 to-green-600',
      description: 'Smart trädgårdsskötsel'
    },
    {
      id: 'entertainment',
      name: 'Underhållning',
      icon: Tv,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      description: 'Smart hem-entertainment'
    }
  ];

  const smartProducts: SmartProduct[] = [
    // Security Products
    {
      id: 'smart-lock',
      name: 'AI Smart Lås',
      category: 'security',
      icon: Lock,
      benefits: [
        'Fjärrstyrning via mobil',
        'Biometrisk fingeravtryck',
        'AI-driven säkerhetsanalys',
        'Automatisk hot-detektering'
      ],
      aiFeatures: [
        'Lär sig dina vanor',
        'Förutsäger säkerhetshot',
        'Automatisk låsning vid misstänkt aktivitet'
      ],
      savings: {
        cost: 3200,
        time: '20 min/vecka',
        efficiency: '98% säkrare'
      },
      price: '5 990 - 12 990 kr'
    },
    {
      id: 'smart-doorbell',
      name: 'AI Video-Ringklocka', 
      category: 'security',
      icon: Bell,
      benefits: [
        '4K HDR-video med zoom',
        'AI-ansiktsigenkänning',
        'Paketdetektering',
        'Molnlagring 90 dagar'
      ],
      aiFeatures: [
        'Känner igen familj vs främlingar',
        'Automatisk paketnotifiering',
        'Förutsäger leveranstider'
      ],
      savings: {
        cost: 1800,
        time: 'Aldrig missad leverans',
        efficiency: '95% färre falska alarm'
      },
      price: '3 990 - 7 990 kr'
    },
    {
      id: 'ai-security-system',
      name: 'AI Säkerhetssystem',
      category: 'security',
      icon: Camera,
      benefits: [
        '360° 4K-kameror med zoom',
        'AI-hotdetektering i realtid',
        'Automatisk kontakt med väktare',
        'Integrerad rökdetektering'
      ],
      aiFeatures: [
        'Skiljer mellan hot och vardagsaktiviteter',
        'Förutsäger inbrottsförsök',
        'Automatisk polisanmälan vid bekräftat hot'
      ],
      savings: {
        cost: 4500,
        time: 'Konstant trygghet',
        efficiency: '99% hotdetektering'
      },
      price: '15 990 - 45 990 kr'
    },

    // Lighting Products
    {
      id: 'ai-lighting',
      name: 'AI Belysningssystem',
      category: 'lighting',
      icon: Lightbulb,
      benefits: [
        'Automatisk ljusjustering',
        '16M färger + vitt ljus',
        'Cirkadisk rytm-stöd',
        'Energibesparing 85%'
      ],
      aiFeatures: [
        'Lär sig dina preferenser',
        'Anpassar efter väder och årstid',
        'Optimerar för bättre sömn'
      ],
      savings: {
        cost: 4200,
        time: '10 min/dag',
        efficiency: '85% energibesparing'
      },
      price: '2 990 - 15 990 kr'
    },

    // Climate Products  
    {
      id: 'ai-thermostat',
      name: 'AI Klimatsystem',
      category: 'climate',
      icon: Thermometer,
      benefits: [
        'Rumsvis temperaturkontroll',
        'Luftkvalitetsmätning',
        'Automatisk ventilation',
        'Väderbaserad förutsägelse'
      ],
      aiFeatures: [
        'Lär sig familjemedlemmarnas preferenser',
        'Förutsäger väderförändringar',
        'Optimerar energiförbrukning automatiskt'
      ],
      savings: {
        cost: 6500,
        time: 'Helt automatisk',
        efficiency: '35% energibesparing'
      },
      price: '8 990 - 25 990 kr'
    },

    // Cleaning Products
    {
      id: 'ai-robot-vacuum',
      name: 'AI Robotdammsugare',
      category: 'cleaning',
      icon: Bot,
      benefits: [
        'LiDAR-navigation + kameror',
        'Självtömmande bas 60 dagar',
        'Våtmoppning samtidigt',
        'Undviker all sladd & leksaker'
      ],
      aiFeatures: [
        'Lär sig hemmets layout perfekt',
        'Identifierar olika smutstyper',
        'Schemaläggning baserat på dina vanor'
      ],
      savings: {
        cost: 2800,
        time: '7 tim/vecka',
        efficiency: '99% ren varje dag'
      },
      price: '12 990 - 35 990 kr'
    },
    {
      id: 'ai-window-cleaner',
      name: 'AI Fönsterrobot',
      category: 'cleaning',
      icon: Monitor,
      benefits: [
        'Rengör alla fönster automatiskt',
        'Säkerhetslinor & sensorer',
        'Fungerar på alla glastyper',
        '99% strimfritt resultat'
      ],
      aiFeatures: [
        'Känner igen smuts & fläckar',
        'Anpassar rengöring efter glastyp',
        'Undviker regnvåta dagar'
      ],
      savings: {
        cost: 1500,
        time: '3 tim/månad',
        efficiency: 'Perfekt resultat varje gång'
      },
      price: '8 990 - 15 990 kr'
    },

    // Garden Products
    {
      id: 'ai-lawn-mower',
      name: 'AI Robotgräsklippare',
      category: 'garden',
      icon: Scissors,
      benefits: [
        'GPS-navigation + anti-stöld',
        'Mulchning för friskare gräs',
        'Automatisk regndetektering',
        'Klippning enligt växtcykler'
      ],
      aiFeatures: [
        'Lär sig trädgårdens layout',
        'Anpassar klippning efter gräsets tillväxt',
        'Förutsäger optimala klipptider'
      ],
      savings: {
        cost: 3500,
        time: '4 tim/vecka',
        efficiency: 'Perfekt gräsmatta året runt'
      },
      price: '18 990 - 65 990 kr'
    },
    {
      id: 'smart-irrigation',
      name: 'AI Bevattningssystem',
      category: 'garden',
      icon: Droplets,
      benefits: [
        'Jordfuktighetssensorer',
        'Väderprognos-integration',
        'Zonindelat vattensystem',
        '40% mindre vattenförbrukning'
      ],
      aiFeatures: [
        'Förutsäger växters vattenbehov',
        'Anpassar efter väderprognos',
        'Optimerar för olika växttyper'
      ],
      savings: {
        cost: 2200,
        time: '2 tim/vecka',
        efficiency: '40% mindre vatten'
      },
      price: '12 990 - 28 990 kr'
    },

    // Entertainment Products
    {
      id: 'smart-home-theater',
      name: 'AI Hemmabio',
      category: 'entertainment',
      icon: Tv,
      benefits: [
        '8K-projektor + Dolby Atmos',
        'Automatisk rumskalibrering',
        'Röststyrning på svenska',
        'Integrerad belysningsscener'
      ],
      aiFeatures: [
        'Lär sig din filmsmak',
        'Föreslår innehåll baserat på humör',
        'Automatisk optimal bild & ljud'
      ],
      savings: {
        cost: 0,
        time: 'Ökad livskvalitet',
        efficiency: 'Biografkänsla hemma'
      },
      price: '45 990 - 150 990 kr'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('smart-lock');

  const filteredProducts = selectedCategory === 'all' 
    ? smartProducts 
    : smartProducts.filter(product => product.category === selectedCategory);

  const realStats = {
    energySavings: 35, // % genomsnittlig besparing med AI-hem
    timeSaved: 12, // timmar per vecka
    homeValue: 15, // % ökning av fastighetsvärde med AI-hem
    userSatisfaction: 97 // % av användare som är nöjda med AI-hem
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            AI Smart Hem - Framtidens Intelligenta Boende
          </h1>
          <p className="text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            Upptäck kraften i artificiell intelligens för ditt hem. Våra AI-drivna lösningar lär sig dina vanor, 
            förutsäger dina behov och optimerar automatiskt för maximal komfort, säkerhet och energieffektivitet.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100">
              <Brain className="h-5 w-5 mr-2" />
              AI-Driven Teknik
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100">
              <Target className="h-5 w-5 mr-2" />
              97% Kundnöjdhet
            </Badge>
            <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100">
              <Zap className="h-5 w-5 mr-2" />
              35% Energibesparing
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Välj Kategori för Ditt Smarta Hem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-primary shadow-xl transform scale-105' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className={`${category.color} text-white p-3 rounded-lg mb-3 text-center`}>
                  <category.icon className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-bold text-sm">{category.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {category.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Features Highlight */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Brain className="h-10 w-10 text-purple-600" />
              Varför AI Gör Skillnaden
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditionella smarta hem kräver konstant programmering. AI-hem lär sig och anpassar sig automatiskt.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-blue-800">Automatisk Inlärning</h3>
              <p className="text-sm text-blue-700">
                AI:n lär sig dina vanor på 2 veckor och optimerar automatiskt
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-green-800">Prediktiv Analys</h3>
              <p className="text-sm text-green-700">
                Förutsäger behov och agerar innan du ens tänkt tanken
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-purple-800">Energioptimering</h3>
              <p className="text-sm text-purple-700">
                AI hittar besparingsmöjligheter du aldrig skulle upptäcka
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-orange-800">Proaktiv Säkerhet</h3>
              <p className="text-sm text-orange-700">
                Identifierar hot innan de blir verkliga problem
              </p>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {selectedCategory === 'all' ? 'Alla AI Smart Hem-Produkter' : `${categories.find(c => c.id === selectedCategory)?.name} Produkter`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer group"
                onClick={() => setSelectedProduct(product.id)}
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <product.icon className="h-12 w-12 text-cyan-400" />
                    <Badge className="bg-cyan-500 text-white">AI-Driven</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-cyan-300 font-semibold">{product.price}</p>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Huvudfunktioner:</h4>
                    <ul className="space-y-1">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Features */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-800 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI-Funktioner:
                    </h4>
                    <ul className="space-y-1">
                      {product.aiFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Target className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-purple-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Savings */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-xs text-green-600">Sparar</div>
                      <div className="font-bold text-green-800">{product.savings.cost} kr/år</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="text-xs text-blue-600">Tid</div>
                      <div className="font-bold text-blue-800">{product.savings.time}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="text-xs text-purple-600">Effektivitet</div>
                      <div className="font-bold text-purple-800 text-xs">{product.savings.efficiency}</div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Få AI-Installation
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Statistics */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-cyan-50 to-blue-50">
          <h2 className="text-3xl font-bold text-center mb-8">
            Resultat från 1000+ AI Smart Hem-Installationer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-cyan-600 mb-2">
                {realStats.energySavings}%
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Genomsnittlig energibesparing med AI-optimering
              </p>
              <div className="text-xs text-gray-500">
                *Verifierat av Energimyndigheten 2024
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">
                {realStats.timeSaved}h
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Sparad tid per vecka med AI-automation
              </p>
              <div className="text-xs text-gray-500">
                *Baserat på användarstudie
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {realStats.homeValue}%
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Värdeökning med AI Smart Hem-system
              </p>
              <div className="text-xs text-gray-500">
                *SCB Fastighetsstatistik 2024
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-600 mb-2">
                {realStats.userSatisfaction}%
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Av kunder rekommenderar AI Smart Hem
              </p>
              <div className="text-xs text-gray-500">
                *1000+ installationer senaste året
              </div>
            </div>
          </div>
        </Card>

        {/* Installation Process */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-3xl font-bold text-center mb-8">
            Så Enkelt Blir Ditt Hem AI-Smart
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Kostnadsfri Hemkonsultation</h3>
              <p className="text-sm text-gray-600">
                Vår AI-expert kommer hem och analyserar dina behov. 
                Vi designar en skräddarsydd lösning för just ditt hem.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Professionell Installation</h3>
              <p className="text-sm text-gray-600">
                Certifierade tekniker installerar och konfigurerar alla system. 
                De flesta installationer tar 4-8 timmar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Träning & Optimering</h3>
              <p className="text-sm text-gray-600">
                AI:n börjar lära sig dina vanor direkt. Efter 2 veckor 
                är systemet helt optimerat för din familj.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Kontinuerlig Förbättring</h3>
              <p className="text-sm text-gray-600">
                AI:n fortsätter att lära och förbättra sig. Regelbundna 
                uppdateringar ger dig nya funktioner automatiskt.
              </p>
            </div>
          </div>
        </Card>

        {/* Final CTA */}
        <Card className="p-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">
            Redo att Uppleva Framtidens Smart Hem?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Boka en kostnadsfri AI-konsultation idag. Våra experter visar dig exakt hur AI kan 
            transformera ditt hem och spara dig tusentals kronor per år.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <Phone className="h-6 w-6 mr-3" />
              Ring 08-123 456 78
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
              <Brain className="h-6 w-6 mr-3" />
              Boka AI-Konsultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
              <Target className="h-6 w-6 mr-3" />
              Se AI-Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              1000+ Nöjda AI-Kunder
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Snitt 8 500 kr Besparing/År
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Livstids AI-Support
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};