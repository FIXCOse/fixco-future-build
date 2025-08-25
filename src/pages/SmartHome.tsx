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
    },
    {
      id: 'entertainment',
      name: 'Underhållning',
      icon: Speaker,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      description: 'Högtalare & Hemmabio'
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
      id: 'verisure-alarm',
      name: 'Verisure Säkerhetssystem',
      brand: 'Verisure',
      model: 'Smart Alarm',
      category: 'security',
      icon: Shield,
      realFeatures: [
        'Svenskt larmsystem',
        '24/7 bevakning',
        'Mobilapp med live-video',
        'Rök- och vattendetektorer'
      ],
      realAIFeatures: [
        'Smart detektering av riktiga hot',
        'Automatisk kontakt med väktare',
        'Lär sig hemrutiner för mindre falsklarm'
      ],
      installation: {
        time: '3-4 timmar',
        difficulty: 'Medium',
        included: ['Sensorer', 'Kameror', 'Centrallarm', 'Utbildning']
      },
      pricing: {
        product: 8990,
        installation: 2000,
        total: 10990
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
    // BUDGET SÄKERHET
    {
      id: 'xiaomi-doorbell',
      name: 'Xiaomi Smart Doorbell 3',
      brand: 'Xiaomi',
      model: 'Smart Video Doorbell 3',
      category: 'security',
      icon: Bell,
      realFeatures: [
        '2K HD-video',
        'PIR-sensor',
        'Tvåvägskommunikation',
        'MicroSD-kort lagring'
      ],
      realAIFeatures: [
        'Persondetektering',
        'Automatisk upptag vid rörelse',
        'Paketdetektering'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Lätt',
        included: ['Montering', 'WiFi-setup', 'App-konfiguration']
      },
      pricing: {
        product: 599,
        installation: 500,
        total: 1099
      },
      warranty: '1 år'
    },
    {
      id: 'tp-link-tapo-c200',
      name: 'TP-Link Tapo C200',
      brand: 'TP-Link',
      model: 'Tapo C200 Pan/Tilt',
      category: 'security',
      icon: Camera,
      realFeatures: [
        '1080p Full HD',
        '360° horisontell rotation',
        'Nattsyn upp till 9m',
        'Rörelse- och ljuddetektering'
      ],
      realAIFeatures: [
        'Smart rörelsespårning',
        'Babygråt-detektering',
        'Automatisk personföljning'
      ],
      installation: {
        time: '30 minuter',
        difficulty: 'Lätt',
        included: ['WiFi-setup', 'App-installation', 'Grundkonfiguration']
      },
      pricing: {
        product: 299,
        installation: 300,
        total: 599
      },
      warranty: '2 år'
    },
    {
      id: 'eufy-security-2k',
      name: 'Eufy Security 2K Indoor Cam',
      brand: 'Eufy',
      model: 'Security 2K Indoor Cam',
      category: 'security',
      icon: Camera,
      realFeatures: [
        '2K 2304x1296 upplösning',
        'Lokal lagring (ingen molnkostnad)',
        'HomeKit Secure Video',
        'Tvåvägskommunikation'
      ],
      realAIFeatures: [
        'Avancerad AI-persondetektering',
        'Husdjursdetektering',
        'Gråt-detektering för barn'
      ],
      installation: {
        time: '30 minuter',
        difficulty: 'Lätt',
        included: ['WiFi-setup', 'HomeKit-koppling', 'App-konfiguration']
      },
      pricing: {
        product: 799,
        installation: 300,
        total: 1099
      },
      warranty: '1 år'
    },
    {
      id: 'ajax-systems-hub',
      name: 'Ajax Systems Starter Kit',
      brand: 'Ajax',
      model: 'SecuritySystem Starter Kit',
      category: 'security',
      icon: Shield,
      realFeatures: [
        'Trådlösa sensorer',
        'Upp till 2km räckvidd',
        'Smartphone-app',
        '5 års batteritid'
      ],
      realAIFeatures: [
        'Falskarms-filtrering',
        'Smart hemlarm/bortalarm',
        'Automatisk larm vid onormal aktivitet'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Hub-installation', 'Sensor-montering', 'App-setup']
      },
      pricing: {
        product: 3990,
        installation: 1200,
        total: 5190
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
    {
      id: 'ikea-tradfri',
      name: 'IKEA TRÅDFRI System',
      brand: 'IKEA',
      model: 'TRÅDFRI Smart Belysning',
      category: 'lighting',
      icon: Lightbulb,
      realFeatures: [
        'Svenskdesignad smart belysning',
        'Kompatibel med Philips Hue',
        'Dimbar vit & färgad',
        'Röststyrning (Alexa, Google)'
      ],
      realAIFeatures: [
        'Automatisk schemaläggning',
        'Anpassar efter dagsljus',
        'Integreras med andra IKEA smarta produkter'
      ],
      installation: {
        time: '1-2 timmar',
        difficulty: 'Lätt',
        included: ['TRÅDFRI Gateway', 'Lampinstallation', 'App-setup']
      },
      pricing: {
        product: 3990,
        installation: 800,
        total: 4790
      },
      warranty: '1 år'
    },
    // BUDGET BELYSNING
    {
      id: 'tp-link-tapo-l530e',
      name: 'TP-Link Tapo L530E 4-pack',
      brand: 'TP-Link',
      model: 'Tapo L530E WiFi Smart Bulb',
      category: 'lighting',
      icon: Lightbulb,
      realFeatures: [
        '16 miljoner färger',
        'WiFi-anslutning (ingen hub)',
        'Dimbar 1-100%',
        'Röststyrning Alexa/Google'
      ],
      realAIFeatures: [
        'Automatiska scheman',
        'Solnedgång/soluppgång-anpassning',
        'Närvarobaserad belysning'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Lätt',
        included: ['4 lampor', 'WiFi-setup', 'App-konfiguration']
      },
      pricing: {
        product: 599, // 4-pack
        installation: 400,
        total: 999
      },
      warranty: '2 år'
    },
    {
      id: 'xiaomi-yeelight',
      name: 'Xiaomi Yeelight Color Bulb',
      brand: 'Xiaomi',
      model: 'Yeelight LED Smart Bulb 1S',
      category: 'lighting',
      icon: Lightbulb,
      realFeatures: [
        '16 miljoner färger + 2700K-6500K',
        'WiFi 2.4GHz',
        'Mi Home app',
        '800 lumen, 10W'
      ],
      realAIFeatures: [
        'Musiksynkronisering',
        'Circadian rhythm',
        'Automatisk färganpassning'
      ],
      installation: {
        time: '30 minuter för 3 lampor',
        difficulty: 'Lätt',
        included: ['3 lampor', 'WiFi-setup', 'Mi Home app']
      },
      pricing: {
        product: 399, // 3-pack
        installation: 300,
        total: 699
      },
      warranty: '1 år'
    },
    {
      id: 'govee-immersion-tv',
      name: 'Govee Immersion TV LED Strip',
      brand: 'Govee',
      model: 'Immersion TV Light Strip',
      category: 'lighting',
      icon: Lightbulb,
      realFeatures: [
        'TV-ljussynkronisering',
        '55-75 tum TV-stöd',
        'Kamera för färgdetektering',
        'DIY-scenes & timer'
      ],
      realAIFeatures: [
        'Realtids-färgsynkronisering',
        'AI-driven ljuseffekter',
        'Automatisk scendetektering'
      ],
      installation: {
        time: '1-2 timmar',
        difficulty: 'Medium',
        included: ['LED-strip', 'Kamera-montering', 'App-setup']
      },
      pricing: {
        product: 1299,
        installation: 600,
        total: 1899
      },
      warranty: '1 år'
    },
    {
      id: 'nanoleaf-shapes',
      name: 'Nanoleaf Shapes Hexagon Starter Kit',
      brand: 'Nanoleaf',
      model: 'Shapes Hexagon 9-pack',
      category: 'lighting',
      icon: Lightbulb,
      realFeatures: [
        '9 hexagon-paneler',
        '16 miljoner färger',
        'Thread border router',
        'Touch-reaktiv'
      ],
      realAIFeatures: [
        'Musikvisualisering',
        'Automatiska färgövergångar',
        'Scen-lärande AI'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Väggmontering', 'Thread-setup', 'HomeKit-koppling']
      },
      pricing: {
        product: 2990,
        installation: 800,
        total: 3790
      },
      warranty: '2 år'
    },

    // BUDGET KLIMAT
    {
      id: 'xiaomi-mi-temperature',
      name: 'Xiaomi Mi Temperature & Humidity Monitor 2',
      brand: 'Xiaomi',
      model: 'LYWSD03MMC',
      category: 'climate',
      icon: Thermometer,
      realFeatures: [
        'E-ink display',
        'Bluetooth 5.0',
        'CR2032 batteri 1+ år',
        'Temperatur och luftfuktighet'
      ],
      realAIFeatures: [
        'Smart aviseringar',
        'Historikspårning',
        'Komfortindex-beräkning'
      ],
      installation: {
        time: '30 minuter för 5 st',
        difficulty: 'Lätt',
        included: ['5 sensorer', 'Mi Home app', 'Batterier']
      },
      pricing: {
        product: 499, // 5-pack
        installation: 200,
        total: 699
      },
      warranty: '1 år'
    },
    {
      id: 'honeywell-t6',
      name: 'Honeywell T6 Smart Thermostat',
      brand: 'Honeywell',
      model: 'T6 WiFi Thermostat',
      category: 'climate',
      icon: Thermometer,
      realFeatures: [
        'WiFi-ansluten',
        'Geofencing',
        '7-dagars programmering',
        'Energirapporter'
      ],
      realAIFeatures: [
        'Adaptive recovery',
        'Smart Response teknologi',
        'Förberäkning av värmetid'
      ],
      installation: {
        time: '2 timmar',
        difficulty: 'Medium',
        included: ['Installation', 'WiFi-setup', 'Kalibrering']
      },
      pricing: {
        product: 1799,
        installation: 1200,
        total: 2999
      },
      warranty: '2 år'
    },
    {
      id: 'tado-smart-thermostat',
      name: 'Tado° Smart Thermostat V3+',
      brand: 'Tado°',
      model: 'Smart Thermostat V3+',
      category: 'climate',
      icon: Thermometer,
      realFeatures: [
        'Geofencing & geolocation',
        'Väder-anpassning',
        'Multi-room control',
        'Energi IQ rapporter'
      ],
      realAIFeatures: [
        'Förutsäger värmetid',
        'Auto-assist för optimal temperatur',
        'AI-driven schemaoptimering'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Termostat', 'Internet bridge', 'App-setup']
      },
      pricing: {
        product: 2299,
        installation: 1500,
        total: 3799
      },
      warranty: '2 år'
    },

    // BUDGET ROBOTAR
    {
      id: 'xiaomi-mi-robot-vacuum',
      name: 'Xiaomi Mi Robot Vacuum-Mop 2 Pro',
      brand: 'Xiaomi',
      model: 'Mi Robot Vacuum-Mop 2 Pro',
      category: 'cleaning',
      icon: Bot,
      realFeatures: [
        'LDS lasernavigation',
        'Dammsugning + våtmoppning',
        '3000Pa sugkraft',
        '3 timmars batteritid'
      ],
      realAIFeatures: [
        'Automatisk kartläggning',
        'Rumsigenkänning',
        'Optimal rengöringsrutt'
      ],
      installation: {
        time: '30 minuter',
        difficulty: 'Lätt',
        included: ['Uppackning', 'Första kartläggning', 'Mi Home app']
      },
      pricing: {
        product: 2990,
        installation: 300,
        total: 3290
      },
      warranty: '1 år'
    },
    {
      id: 'eufy-robovac-11s',
      name: 'Eufy RoboVac 11S',
      brand: 'Eufy',
      model: 'RoboVac 11S',
      category: 'cleaning',
      icon: Bot,
      realFeatures: [
        'Supertyst (55dB)',
        '1300Pa sugkraft',
        '100 minuters batteritid',
        'Automatisk återladdning'
      ],
      realAIFeatures: [
        'Smart rengöringsmönster',
        'Automatisk kantdammsugning',
        'Hinderundvikande'
      ],
      installation: {
        time: '15 minuter',
        difficulty: 'Lätt',
        included: ['Uppackning', 'Laddstation', 'Fjärrkontroll']
      },
      pricing: {
        product: 1990,
        installation: 200,
        total: 2190
      },
      warranty: '1 år'
    },
    {
      id: 'dreame-l10s-ultra',
      name: 'Dreame L10s Ultra',
      brand: 'Dreame',
      model: 'L10s Ultra Complete',
      category: 'cleaning',
      icon: Bot,
      realFeatures: [
        'Självtömmande + självtvätt',
        'LiDAR navigation',
        '5300Pa sugkraft',
        'AI-action kamera'
      ],
      realAIFeatures: [
        '3D hinderigenkänning',
        'Pet waste avoidance',
        'Auto-mop lifting'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Lätt',
        included: ['Allround-station setup', 'Kartläggning', 'App-konfiguration']
      },
      pricing: {
        product: 8990,
        installation: 500,
        total: 9490
      },
      warranty: '2 år'
    },

    // BUDGET TRÄDGÅRD
    {
      id: 'worx-landroid-m500',
      name: 'Worx Landroid M500 WR141E',
      brand: 'Worx',
      model: 'Landroid M500',
      category: 'garden',
      icon: Scissors,
      realFeatures: [
        'Upp till 500m² gräsyta',
        'Cut to Edge teknologi',
        'Regndetektering',
        'Anti-stöld alarm'
      ],
      realAIFeatures: [
        'AIA algoritm (Artificial Intelligence Algorithm)',
        'Weather-adaptive cutting',
        'Auto-scheduling baserat på gräsmätning'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Gränstråd 130m', 'Laddstation', 'Första setup']
      },
      pricing: {
        product: 6990,
        installation: 1800,
        total: 8790
      },
      warranty: '2 år'
    },
    {
      id: 'robomow-rc308u',
      name: 'Robomow RC308u',
      brand: 'Robomow',
      model: 'RC308u',
      category: 'garden',
      icon: Scissors,
      realFeatures: [
        'Upp till 800m² yta',
        'Mulching-system',
        'Säkerhetssensorer',
        'App-styrning'
      ],
      realAIFeatures: [
        'Smart mowing patterns',
        'Väder-anpassad klippning',
        'Gräsanalys för optimal klipphöjd'
      ],
      installation: {
        time: '3-4 timmar',
        difficulty: 'Medium',
        included: ['Perimeter wire', 'Base station', 'App-setup']
      },
      pricing: {
        product: 12990,
        installation: 2800,
        total: 15790
      },
      warranty: '2 år'
    },

    // BUDGET ENTERTAINMENT
    {
      id: 'amazon-echo-dot-5',
      name: 'Amazon Echo Dot (5:e gen) 3-pack',
      brand: 'Amazon',
      model: 'Echo Dot 5th Generation',
      category: 'entertainment',
      icon: Speaker,
      realFeatures: [
        'Alexa inbyggt',
        'Smart Home Hub',
        'Bluetooth & WiFi',
        'Droppar in överallt'
      ],
      realAIFeatures: [
        'Adaptiv volym',
        'Alexa Conversations',
        'Multi-room musik'
      ],
      installation: {
        time: '1 timme för 3 st',
        difficulty: 'Lätt',
        included: ['3 Echo Dots', 'WiFi-setup', 'Alexa-konfiguration']
      },
      pricing: {
        product: 1497, // 3-pack
        installation: 400,
        total: 1897
      },
      warranty: '1 år'
    },
    {
      id: 'google-nest-audio',
      name: 'Google Nest Audio 2-pack',
      brand: 'Google',
      model: 'Nest Audio',
      category: 'entertainment',
      icon: Speaker,
      realFeatures: [
        'Google Assistant',
        '75mm woofer + 19mm tweeter',
        'Multiroom-ljud',
        'Touch controls'
      ],
      realAIFeatures: [
        'Media EQ (automatisk ljudjustering)',
        'Ambient IQ (volym efter rumsbrus)',
        'Smart grupplydsystem'
      ],
      installation: {
        time: '45 minuter',
        difficulty: 'Lätt',
        included: ['2 högtalare', 'Google Home app', 'Rum-setup']
      },
      pricing: {
        product: 1998, // 2-pack
        installation: 400,
        total: 2398
      },
      warranty: '1 år'
    },
    {
      id: 'jbl-link-portable',
      name: 'JBL Link Portable',
      brand: 'JBL',
      model: 'Link Portable Google Assistant',
      category: 'entertainment',
      icon: Speaker,
      realFeatures: [
        'Bärbar med batteri',
        'IPX4 vattenskyddad',
        'Google Assistant',
        '8 timmars batteritid'
      ],
      realAIFeatures: [
        'Context-aware responses',
        'Smart hem-kontroll överallt',
        'Automatisk WiFi/Bluetooth-växling'
      ],
      installation: {
        time: '30 minuter',
        difficulty: 'Lätt',
        included: ['JBL Link', 'Google Assistant setup', 'WiFi-konfiguration']
      },
      pricing: {
        product: 1490,
        installation: 300,
        total: 1790
      },
      warranty: '1 år'
    },
    {
      id: 'chromecast-google-tv',
      name: 'Chromecast med Google TV (4K)',
      brand: 'Google',
      model: 'Chromecast with Google TV 4K',
      category: 'entertainment',
      icon: Tv,
      realFeatures: [
        '4K HDR10+ support',
        'Dolby Vision',
        'Google TV interface',
        'Röststyrning med fjärr'
      ],
      realAIFeatures: [
        'Personliga rekommendationer',
        'Content discovery AI',
        'Smart användarprofiler'
      ],
      installation: {
        time: '30 minuter',
        difficulty: 'Lätt',
        included: ['Chromecast enhet', 'HDMI-anslutning', 'Google TV setup']
      },
      pricing: {
        product: 699,
        installation: 300,
        total: 999
      },
      warranty: '1 år'
    },
    {
      id: 'nvidia-shield-tv-pro',
      name: 'NVIDIA Shield TV Pro',
      brand: 'NVIDIA',
      model: 'Shield TV Pro (2019)',
      category: 'entertainment',
      icon: Tv,
      realFeatures: [
        'Tegra X1+ processor',
        '3GB RAM + 16GB storage',
        '4K HDR gaming',
        'Plex Media Server'
      ],
      realAIFeatures: [
        'AI-upscaling till 4K',
        'GeForce NOW cloud gaming',
        'Smart rekommendationsmotor'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Medium',
        included: ['Shield TV Pro', 'Gaming controller', 'Plex setup']
      },
      pricing: {
        product: 2290,
        installation: 600,
        total: 2890
      },
      warranty: '1 år'
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
    {
      id: 'danfoss-eco',
      name: 'Danfoss Eco Termostater',
      brand: 'Danfoss',
      model: 'Eco Bluetooth Termostater',
      category: 'climate',
      icon: Thermometer,
      realFeatures: [
        'Danska kvalitetstermostater',
        'Bluetooth-styrning',
        'Rumsvis temperaturkontroll',
        '30% energibesparing'
      ],
      realAIFeatures: [
        'Lär sig rumtemperatur-preferenser',
        'Automatisk närvaroanpassning',
        'Förutsäger värmebehov'
      ],
      installation: {
        time: '2-3 timmar för 5 element',
        difficulty: 'Medium',
        included: ['Montering på element', 'Bluetooth-koppling', 'App-setup']
      },
      pricing: {
        product: 4990, // 5-pack
        installation: 1500,
        total: 6490
      },
      warranty: '5 år'
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
    {
      id: 'roborock-s8-pro-ultra',
      name: 'Roborock S8 Pro Ultra',
      brand: 'Roborock',
      model: 'S8 Pro Ultra',
      category: 'cleaning',
      icon: Bot,
      realFeatures: [
        'Dammsugning + våtmoppning',
        'Självtvätt av mopp',
        'LiDAR + 3D-kartläggning',
        '6000Pa sugkraft'
      ],
      realAIFeatures: [
        'ReactiveAI 2.0 hinderigenkänning',
        'Smart moppförslagställning',
        'Lär sig optimal rengöringsrutt'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Lätt',
        included: ['Station-setup', 'Kartläggning', 'App-konfiguration']
      },
      pricing: {
        product: 15990,
        installation: 500,
        total: 16490
      },
      warranty: '2 år'
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
    },
    {
      id: 'gardena-sileno-city',
      name: 'Gardena SILENO City',
      brand: 'Gardena',
      model: 'SILENO City 300',
      category: 'garden',
      icon: Scissors,
      realFeatures: [
        'Tysk kvalitet från Gardena',
        'Upp till 300m² gräsyta',
        'Ultra-tyst drift (57dB)',
        'IPX4 vattentålig'
      ],
      realAIFeatures: [
        'SensorControl - anpassar efter grästillväxt',
        'Automatisk regndetektering',
        'Smart scheduling via väderdata'
      ],
      installation: {
        time: '3-4 timmar',
        difficulty: 'Medium',
        included: ['Gränstråd', 'Laddstation', 'Programmering']
      },
      pricing: {
        product: 8990,
        installation: 2500,
        total: 11490
      },
      warranty: '2 år'
    },

    // ENTERTAINMENT/HÖGTALARE
    {
      id: 'sonos-arc-system',
      name: 'Sonos Arc Surround System',
      brand: 'Sonos',
      model: 'Arc + Sub + One SL',
      category: 'entertainment',
      icon: Speaker,
      realFeatures: [
        'Dolby Atmos soundbar',
        'Trådlös subwoofer',
        'Surroundhögtalare',
        'AirPlay 2 & Spotify Connect'
      ],
      realAIFeatures: [
        'Trueplay rumsanpassning',
        'Automatisk EQ-justering',
        'Speech Enhancement AI'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['TV-anslutning', 'Surroundpositionering', 'Trueplay-kalibrering']
      },
      pricing: {
        product: 22990, // Arc + Sub + 2x One SL
        installation: 2000,
        total: 24990
      },
      warranty: '2 år'
    },
    {
      id: 'bang-olufsen-beolab',
      name: 'Bang & Olufsen BeoLab 28',
      brand: 'Bang & Olufsen',
      model: 'BeoLab 28',
      category: 'entertainment',
      icon: Speaker,
      realFeatures: [
        'Dansk designklassiker',
        'Aktiva golv-högtalare',
        'Kraftfulla 1100W per högtalare',
        'Wireless PowerLink'
      ],
      realAIFeatures: [
        'Automatisk rumskorrigering',
        'Adaptive Bass Control',
        'Smart standby-läge'
      ],
      installation: {
        time: '2-3 timmar',
        difficulty: 'Medium',
        included: ['Positionering', 'Trådlös setup', 'Akustisk kalibrering']
      },
      pricing: {
        product: 45990, // Per par
        installation: 2500,
        total: 48490
      },
      warranty: '3 år'
    },
    {
      id: 'ikea-symfonisk',
      name: 'IKEA SYMFONISK System',
      brand: 'IKEA + Sonos',
      model: 'SYMFONISK WiFi-högtalare',
      category: 'entertainment',
      icon: Speaker,
      realFeatures: [
        'Sonos-teknik i IKEA-design',
        'Multiroom-ljud',
        'Fungerar som bokhylla',
        'AirPlay 2 & Spotify'
      ],
      realAIFeatures: [
        'Integreras med Sonos AI-funktioner',
        'Auto-gruppering av högtalare',
        'Smart volymbalansering'
      ],
      installation: {
        time: '1-2 timmar',
        difficulty: 'Lätt',
        included: ['WiFi-setup', 'Sonos-app konfiguration', 'Multiroom-setup']
      },
      pricing: {
        product: 3990, // 3-pack olika rum
        installation: 800,
        total: 4790
      },
      warranty: '2 år'
    },
    {
      id: 'apple-tv-4k',
      name: 'Apple TV 4K Hemmabio',
      brand: 'Apple',
      model: 'Apple TV 4K (128GB)',
      category: 'entertainment',
      icon: Tv,
      realFeatures: [
        'A15 Bionic-chip',
        'Dolby Vision & Atmos',
        'AirPlay från alla Apple-enheter',
        'HomeKit Smart Home Hub'
      ],
      realAIFeatures: [
        'Siri Remote med röststyrning',
        'Automatisk färgbalansering för TV',
        'Personliga rekommendationer'
      ],
      installation: {
        time: '1 timme',
        difficulty: 'Lätt',
        included: ['TV-anslutning', 'WiFi-setup', 'Apple ID-konfiguration']
      },
      pricing: {
        product: 1790,
        installation: 500,
        total: 2290
      },
      warranty: '1 år'
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