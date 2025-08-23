import { 
  Hammer, 
  Wrench, 
  Package, 
  TreePine, 
  Sparkles, 
  ClipboardList, 
  Mountain, 
  Cpu, 
  Zap, 
  Building,
  Truck,
  Droplets
} from "lucide-react";
import { ServicePricing } from '@/utils/priceCalculation';

// Main services for the homepage grid
export const mainServices: ServicePricing[] = [
  {
    id: "el",
    title: "El",
    basePrice: 1059,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    laborShare: 1.0
  },
  {
    id: "vvs", 
    title: "VVS",
    basePrice: 959,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    laborShare: 1.0
  },
  {
    id: "snickeri",
    title: "Snickeri", 
    basePrice: 859,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    laborShare: 1.0
  },
  {
    id: "montering",
    title: "Montering",
    basePrice: 759,
    priceUnit: "kr/h", 
    eligible: { rot: true, rut: false },
    laborShare: 1.0
  },
  {
    id: "tradgard",
    title: "Trädgård",
    basePrice: 659,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    laborShare: 1.0
  },
  {
    id: "stadning",
    title: "Städning",
    basePrice: 459,
    priceUnit: "kr/h",
      eligible: { rot: false, rut: true },
      laborShare: 1.0
  },
  {
    id: "flytt",
    title: "Flytt",
    basePrice: 559,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    laborShare: 1.0
  }
];

// Service categories with icons for routing and display
export const serviceCategories = [
  {
    id: "el",
    title: "El",
    slug: "el", 
    description: "Installation, reparation och underhåll",
    icon: Zap,
    eligible: { rot: true, rut: false }
  },
  {
    id: "vvs",
    title: "VVS",
    slug: "vvs",
    description: "Rör, kranar, toaletter och duschvägg",
    icon: Droplets,
    eligible: { rot: true, rut: false }
  },
  {
    id: "snickeri", 
    title: "Snickeri",
    slug: "snickeri",
    description: "Kök, garderober och inredning",
    icon: Hammer,
    eligible: { rot: true, rut: false }
  },
  {
    id: "montering",
    title: "Montering", 
    slug: "montering",
    description: "IKEA, vitvaror och TV-fästen",
    icon: Wrench,
    eligible: { rot: true, rut: false }
  },
  {
    id: "tradgard",
    title: "Trädgård",
    slug: "tradgard", 
    description: "Anläggning, skötsel och underhåll",
    icon: TreePine,
    eligible: { rot: false, rut: true }
  },
  {
    id: "stadning",
    title: "Städning",
    slug: "stadning",
    description: "Byggstäd, flyttstäd och regelbunden städning", 
    icon: Sparkles,
    eligible: { rot: false, rut: true }
  },
  {
    id: "flytt",
    title: "Flytt",
    slug: "flytt",
    description: "Bärhjälp, lastning och uppackning",
    icon: Truck,
    eligible: { rot: false, rut: true }
  }
];

// Extended service data for detailed pages
export interface SubService extends ServicePricing {
  description: string;
  category: string;
  location: 'inomhus' | 'utomhus' | 'båda';
  priceType: 'fast' | 'timpris' | 'offert';
}

export interface Service {
  title: string;
  slug: string;
  description: string;
  icon: any;
  subServices: SubService[];
  basePrice: number;
  priceUnit: string;
  eligible: { rot: boolean; rut: boolean };
}

// This will gradually replace the old servicesData
export const servicesDataNew: Service[] = [
  {
    title: "El",
    slug: "el", 
    description: "Installation, reparation och underhåll",
    icon: Zap,
    basePrice: 1059,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      {
        id: "el-1",
        title: "Byta vägguttag",
        description: "Byte av befintligt vägguttag till nyare modell",
        basePrice: 890,
        priceUnit: "kr",
        priceType: "fast",
        eligible: { rot: true, rut: false },
        category: "Elinstallationer",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-2",
        title: "Byta strömbrytare och dimmer", 
        description: "Installation av nya strömbrytare och dimrar",
        basePrice: 1190,
        priceUnit: "kr",
        priceType: "fast",
        eligible: { rot: true, rut: false },
        category: "Elinstallationer", 
        location: "inomhus",
        laborShare: 1.0
      }
      // Add more subservices as needed...
    ]
  },
  {
    title: "Trädgård",
    slug: "tradgard",
    description: "Anläggning, skötsel och underhåll",
    icon: TreePine,
    basePrice: 659,
    priceUnit: "kr/h", 
    eligible: { rot: false, rut: true },
    subServices: [
      {
        id: "tradgard-1",
        title: "Gräsklippning",
        description: "Klippning av gräsmatta med utrymning av klipp",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "timpris",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-2",
        title: "Häckklippning",
        description: "Trimning och formklippning av häckar", 
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "timpris",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus", 
        laborShare: 1.0
      }
      // Add more subservices...
    ]
  },
  {
    title: "Städning",
    slug: "stadning",
    description: "Byggstäd, flyttstäd och regelbunden städning",
    icon: Sparkles,
    basePrice: 459,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    subServices: [
      {
        id: "stadning-1", 
        title: "Hemstäd regelbundet",
        description: "Vecko- eller månadsvis städning av hemmet",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "timpris",
        eligible: { rot: false, rut: true },
        category: "Hemstäd",
        location: "inomhus",
        laborShare: 1.0
      }
      // Add more subservices...
    ]
  },
  {
    title: "Flytt",
    slug: "flytt", 
    description: "Bärhjälp, lastning och uppackning",
    icon: Truck,
    basePrice: 559,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    subServices: [
      {
        id: "flytt-1",
        title: "Bärhjälp",
        description: "Hjälp med att bära tunga föremål",
        basePrice: 559,
        priceUnit: "kr/h", 
        priceType: "timpris",
        eligible: { rot: false, rut: true },
        category: "Bärhjälp",
        location: "båda",
        laborShare: 1.0
      }
      // Add more subservices...
    ]
  }
];

export default servicesDataNew;