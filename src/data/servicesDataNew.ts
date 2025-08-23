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
  },
  {
    id: "markarbeten",
    title: "Markarbeten",
    slug: "markarbeten",
    description: "Schaktning, dränering och anläggning",
    icon: Mountain,
    eligible: { rot: true, rut: false }
  },
  {
    id: "tekniska-installationer",
    title: "Tekniska installationer",
    slug: "tekniska-installationer",
    description: "IT, larm och specialinstallationer",
    icon: Cpu,
    eligible: { rot: false, rut: false }
  }
];

// Extended service data for detailed pages
export interface SubService extends ServicePricing {
  description: string;
  category: string;
  location: 'inomhus' | 'utomhus' | 'båda';
  priceType: 'hourly' | 'fixed' | 'quote';
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
      // Vägguttag variants
      {
        id: "el-1",
        title: "Byta vägguttag (1-3 st)",
        description: "Byte av befintliga vägguttag till nyare modeller",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Uttag",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-2",
        title: "Byta vägguttag (4-8 st)",
        description: "Byte av flera vägguttag till nyare modeller",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Uttag",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-3",
        title: "Byta vägguttag (9-15 st)",
        description: "Byte av många vägguttag till nyare modeller",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Uttag",
        location: "inomhus",
        laborShare: 1.0
      },
      // Strömbrytare variants
      {
        id: "el-4",
        title: "Byta strömbrytare och dimmer (1-3 st)",
        description: "Installation av nya strömbrytare och dimrar",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Strömbrytare",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-5",
        title: "Byta strömbrytare och dimmer (4-8 st)",
        description: "Installation av flera strömbrytare och dimrar",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Strömbrytare",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-6",
        title: "Byta strömbrytare och dimmer (9-15 st)",
        description: "Installation av många strömbrytare och dimrar",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Strömbrytare",
        location: "inomhus",
        laborShare: 1.0
      },
      // Belysning
      {
        id: "el-7",
        title: "Installera takarmatur/pendel (1-3 st)",
        description: "Montering av takarmaturer och pendellampor",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-8",
        title: "Installera takarmatur/pendel (4-8 st)",
        description: "Montering av flera takarmaturer och pendellampor",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-9", 
        title: "Installera spotlights (4 st)",
        description: "Installation av 4 spotlights i tak",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-10",
        title: "Installera spotlights (8 st)",
        description: "Installation av 8 spotlights i tak",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-11",
        title: "Installera spotlights (12 st)",
        description: "Installation av 12 spotlights i tak",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-12",
        title: "Utebelysning - fasad",
        description: "Installation av fasadbelysning",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Utebelysning",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "el-13",
        title: "Utebelysning - trädgård",
        description: "Installation av trädgårdsbelysning",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Utebelysning",
        location: "utomhus",
        laborShare: 1.0
      },
      // Säkerhet & Service
      {
        id: "el-14",
        title: "Installera jordfelsbrytare",
        description: "Installation av jordfelsbrytare för säkerhet",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Säkerhet",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-15",
        title: "Felsökning el (1-2 h)",
        description: "Diagnostik och felsökning av elinstallationer",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Service",
        location: "båda",
        laborShare: 1.0
      },
      {
        id: "el-16",
        title: "Dra fram ny elpunkt - kök",
        description: "Installation av ny elpunkt i köket",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Installationer",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-17",
        title: "Dra fram ny elpunkt - badrum",
        description: "Installation av ny elpunkt i badrummet",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Installationer",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-18",
        title: "Montera TV-väggfäste & kabelkanal",
        description: "Montering av TV-fäste med kabelhantering",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Montering",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-19",
        title: "Ny el till köksö",
        description: "Elinstallation för köksö med uttag",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Installationer",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-20",
        title: "Ny elgrupp",
        description: "Installation av ny elgrupp i centralen",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Installationer",
        location: "inomhus",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "VVS",
    slug: "vvs",
    description: "Rör, kranar, toaletter och duschvägg",
    icon: Droplets,
    basePrice: 959,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // Blandare
      {
        id: "vvs-1",
        title: "Byta blandare - tvättställ",
        description: "Byte av tvättställsblandare",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Blandare",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-2",
        title: "Byta blandare - kök",
        description: "Byte av köksblandare",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Blandare",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-3",
        title: "Byta blandare - badrum",
        description: "Byte av badrumsblandare",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Blandare",
        location: "inomhus",
        laborShare: 1.0
      },
      // Sanitetsporsliner
      {
        id: "vvs-4",
        title: "Byta toalettstol",
        description: "Byte av toalettstol med installation",
        basePrice: 2890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: true, rut: false },
        category: "Sanitetsporsliner",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-5",
        title: "Byta vattenlås & avloppssats",
        description: "Byte av vattenlås och avloppssats",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Avlopp",
        location: "inomhus",
        laborShare: 1.0
      },
      // Vitvaror
      {
        id: "vvs-6",
        title: "Montera diskmaskin",
        description: "Installation och anslutning av diskmaskin",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Vitvaror",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-7",
        title: "Montera tvättmaskin",
        description: "Installation och anslutning av tvättmaskin",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Vitvaror",
        location: "inomhus",
        laborShare: 1.0
      },
      // Dusch
      {
        id: "vvs-8",
        title: "Installera duschblandare",
        description: "Installation av ny duschblandare",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dusch",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-9",
        title: "Installera takdusch",
        description: "Installation av takdusch med rör",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dusch",
        location: "inomhus",
        laborShare: 1.0
      },
      // Värme
      {
        id: "vvs-10",
        title: "Byta radiator",
        description: "Byte av radiator med anslutningar",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Värme",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-11",
        title: "Byta termostatventil",
        description: "Byte av termostatventil på radiator",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Värme",
        location: "inomhus",
        laborShare: 1.0
      },
      // Service
      {
        id: "vvs-12",
        title: "Tätta rörkopplingar",
        description: "Täta läckande rörkopplingar",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Service",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-13",
        title: "Åtgärda dropp",
        description: "Reparera droppande kranar",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Service",
        location: "inomhus",
        laborShare: 1.0
      },
      // Större projekt
      {
        id: "vvs-14",
        title: "Golvbrunnsbyte",
        description: "Byte av golvbrunn med tätningsmembran",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Avlopp",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-15",
        title: "Badrumsrenovering",
        description: "Komplett badrumsrenovering med VVS",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Renovering",
        location: "inomhus",
        laborShare: 0.7
      }
    ]
  },
  {
    title: "Snickeri",
    slug: "snickeri",
    description: "Kök, garderober och inredning",
    icon: Hammer,
    basePrice: 859,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // Garderober
      {
        id: "snickeri-1",
        title: "Platsbyggd garderob - liten",
        description: "Platsbyggd garderob upp till 150 cm bred",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 0.7
      },
      {
        id: "snickeri-2",
        title: "Platsbyggd garderob - standard",
        description: "Platsbyggd garderob 150-250 cm bred",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 0.7
      },
      {
        id: "snickeri-3",
        title: "Platsbyggd garderob - stor",
        description: "Platsbyggd garderob över 250 cm bred",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 0.7
      },
      // Dörrar
      {
        id: "snickeri-4",
        title: "Montera innerdörrar (1-2 st)",
        description: "Montering av 1-2 innerdörrar med foder",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrar",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-5",
        title: "Montera innerdörrar (3-5 st)",
        description: "Montering av 3-5 innerdörrar med foder",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrar",
        location: "inomhus",
        laborShare: 1.0
      },
      // Lister
      {
        id: "snickeri-6",
        title: "Lister & foder - rum",
        description: "Montering av golv- och taklister i ett rum",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Lister",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-7",
        title: "Lister & foder - kök",
        description: "Montering av lister och foder i kök",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Lister",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-8",
        title: "Lister & foder - vardagsrum",
        description: "Montering av lister och foder i vardagsrum",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Lister",
        location: "inomhus",
        laborShare: 1.0
      },
      // Väggarbeten
      {
        id: "snickeri-9",
        title: "Väggresning & gips (0-25 m²)",
        description: "Rivning av väggar och gipsning, mindre yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Väggarbeten",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-10",
        title: "Väggresning & gips (26-50 m²)",
        description: "Rivning av väggar och gipsning, medelstor yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Väggarbeten",
        location: "inomhus",
        laborShare: 1.0
      },
      // Kök
      {
        id: "snickeri-11",
        title: "Montera köksstommar (10 st)",
        description: "Montering av köksstommar, mindre kök",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-12",
        title: "Montera köksstommar (15 st)",
        description: "Montering av köksstommar, medelstor kök",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-13",
        title: "Montera köksstommar (20 st)",
        description: "Montering av köksstommar, större kök",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      },
      // Hyllsystem
      {
        id: "snickeri-14",
        title: "Hyllsystem & förvaring (1-2 m)",
        description: "Hyllsystem och förvaring, mindre installation",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-15",
        title: "Hyllsystem & förvaring (3-4 m)",
        description: "Hyllsystem och förvaring, medelstor installation",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 1.0
      },
      // Golv
      {
        id: "snickeri-16",
        title: "Golvbyte laminat (0-25 m²)",
        description: "Byte till laminatgolv, mindre yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Golv",
        location: "inomhus",
        laborShare: 0.7
      },
      {
        id: "snickeri-17",
        title: "Golvbyte parkett (0-25 m²)",
        description: "Byte till parkettgolv, mindre yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Golv",
        location: "inomhus",
        laborShare: 0.7
      },
      {
        id: "snickeri-18",
        title: "Golvbyte laminat (26-50 m²)",
        description: "Byte till laminatgolv, medelstor yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Golv",
        location: "inomhus",
        laborShare: 0.7
      },
      // Trappor
      {
        id: "snickeri-19",
        title: "Trapprenovering",
        description: "Renovering av trappa med nya steg",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Trappor",
        location: "inomhus",
        laborShare: 0.7
      }
    ]
  },
  {
    title: "Montering",
    slug: "montering",
    description: "IKEA, vitvaror och TV-fästen",
    icon: Wrench,
    basePrice: 759,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // RUT - Möbler
      {
        id: "montering-1",
        title: "Montera säng",
        description: "Montering av säng med tillbehör",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Möbler",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-2",
        title: "Montera soffa",
        description: "Montering av soffa eller soffgrupp",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Möbler",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-3",
        title: "Montera garderob",
        description: "Montering av garderob eller klädskåp",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Möbler",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-4",
        title: "Montera sideboard",
        description: "Montering av sideboard eller TV-bänk",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Möbler",
        location: "inomhus",
        laborShare: 1.0
      },
      // ROT - Väggfasta installationer
      {
        id: "montering-5",
        title: "Väggfasta hyllor",
        description: "Montering av väggfasta hyllsystem",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Väggfästen",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-6",
        title: "Mediamöbel väggfast",
        description: "Montering av väggfasta mediamöbler",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Väggfästen",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-7",
        title: "Speglar väggfasta",
        description: "Montering av stora väggfasta speglar",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Väggfästen",
        location: "inomhus",
        laborShare: 1.0
      },
      // Persienner
      {
        id: "montering-8",
        title: "Montera persienner (1-3 st)",
        description: "Montering av persienner eller rullgardiner",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Fönster",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-9",
        title: "Montera persienner (4-8 st)",
        description: "Montering av flera persienner eller rullgardiner",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Fönster",
        location: "inomhus",
        laborShare: 1.0
      },
      // Badrum
      {
        id: "montering-10",
        title: "Montera duschvägg",
        description: "Montering av duschvägg eller kabin",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Badrum",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-11",
        title: "Montera köksfläkt",
        description: "Montering av köksfläkt med installation",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      }
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
      // Gräsklippning variants
      {
        id: "tradgard-1",
        title: "Gräsklippning - liten tomt",
        description: "Klippning av gräsmatta, liten tomt (upp till 300 m²)",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-2",
        title: "Gräsklippning - standard tomt",
        description: "Klippning av gräsmatta, standard tomt (300-600 m²)",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-3",
        title: "Gräsklippning - stor tomt",
        description: "Klippning av gräsmatta, stor tomt (över 600 m²)",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      // Häckklippning
      {
        id: "tradgard-4",
        title: "Häckklippning (0-10 m)",
        description: "Trimning och formklippning av häckar, korta sträckor",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-5",
        title: "Häckklippning (10-25 m)",
        description: "Trimning och formklippning av häckar, medellånga sträckor",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-6",
        title: "Häckklippning (över 25 m)",
        description: "Trimning och formklippning av häckar, långa sträckor",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Skötsel",
        location: "utomhus",
        laborShare: 1.0
      },
      // Trädbeskärning
      {
        id: "tradgard-7",
        title: "Trädbeskärning - litet träd",
        description: "Beskärning av mindre träd och buskar",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Beskärning",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-8",
        title: "Trädbeskärning - medelstort träd",
        description: "Beskärning av medelstora träd",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Beskärning",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-9",
        title: "Trädbeskärning - stort träd",
        description: "Beskärning av stora träd, kräver specialutrustning",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Beskärning",
        location: "utomhus",
        laborShare: 1.0
      },
      // Rabattvård
      {
        id: "tradgard-10",
        title: "Ogräsrensning & rabattvård",
        description: "Rensning av ogräs och vård av rabatter",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Rabatter",
        location: "utomhus",
        laborShare: 1.0
      },
      // Säsongsjobb
      {
        id: "tradgard-11",
        title: "Lövblåsning & lövupptag",
        description: "Blåsning och upptag av löv på hösten",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Säsong",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-12",
        title: "Snöskottning - gång",
        description: "Snöskottning av gångar och entrér",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Säsong",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-13",
        title: "Snöskottning - uppfart",
        description: "Snöskottning av uppfarter och större ytor",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Säsong",
        location: "utomhus",
        laborShare: 1.0
      },
      // Ved
      {
        id: "tradgard-14",
        title: "Vedkapning & stapling",
        description: "Kapning och stapling av ved",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Ved",
        location: "utomhus",
        laborShare: 1.0
      },
      // Altanvård - osäker på ROT/RUT, sätt som ej berättigad
      {
        id: "tradgard-15",
        title: "Altantvätt & oljning",
        description: "Tvätt och behandling av altaner",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Altanvård",
        location: "utomhus",
        laborShare: 1.0
      }
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
      // Hemstäd
      {
        id: "stadning-1", 
        title: "Hemstäd - veckovis",
        description: "Regelbunden städning av hemmet varje vecka",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Hemstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-2",
        title: "Hemstäd - varannan vecka",
        description: "Regelbunden städning av hemmet varannan vecka",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Hemstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-3",
        title: "Hemstäd - enskild insats",
        description: "Engångsstädning av hemmet",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Hemstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      // Flyttstäd
      {
        id: "stadning-4",
        title: "Flyttstäd (0-50 m²)",
        description: "Flyttstädning av mindre bostad",
        basePrice: 2890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Flyttstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-5",
        title: "Flyttstäd (51-80 m²)",
        description: "Flyttstädning av medelstor bostad",
        basePrice: 3890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Flyttstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-6",
        title: "Flyttstäd (81-120 m²)",
        description: "Flyttstädning av större bostad",
        basePrice: 4890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Flyttstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      // Byggstäd
      {
        id: "stadning-7",
        title: "Byggstäd - rum",
        description: "Byggstädning av enskilt rum",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Byggstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-8",
        title: "Byggstäd (0-25 m²)",
        description: "Byggstädning av mindre yta",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Byggstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-9",
        title: "Byggstäd (26-50 m²)",
        description: "Byggstädning av medelstor yta",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Byggstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      // Fönsterputs
      {
        id: "stadning-10",
        title: "Fönsterputs (1-5 fönster)",
        description: "Putsning av fönster, mindre antal",
        basePrice: 890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Fönster",
        location: "båda",
        laborShare: 1.0
      },
      {
        id: "stadning-11",
        title: "Fönsterputs (6-15 fönster)",
        description: "Putsning av fönster, större antal",
        basePrice: 1890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Fönster",
        location: "båda",
        laborShare: 1.0
      },
      // Djuprengöring
      {
        id: "stadning-12",
        title: "Djuprengöring kök",
        description: "Grundlig rengöring av kök med alla ytor",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Djuprengöring",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "stadning-13",
        title: "Djuprengöring badrum",
        description: "Grundlig rengöring av badrum med kakel och sanitetsporsliner",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Djuprengöring",
        location: "inomhus",
        laborShare: 1.0
      },
      // Kontorsstäd - ej RUT berättigad
      {
        id: "stadning-14",
        title: "Kontorsstäd (B2B)",
        description: "Städning av kontorslokaler och företag",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Kontorsstäd",
        location: "inomhus",
        laborShare: 1.0
      }
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
      // Bärhjälp variants
      {
        id: "flytt-1",
        title: "Bärhjälp (2 personer)",
        description: "Hjälp med att bära tunga föremål, 2-mans team",
        basePrice: 559,
        priceUnit: "kr/h", 
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Bärhjälp",
        location: "båda",
        laborShare: 1.0
      },
      {
        id: "flytt-2",
        title: "Bärhjälp (3 personer)",
        description: "Hjälp med att bära tunga föremål, 3-mans team",
        basePrice: 839,
        priceUnit: "kr/h", 
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Bärhjälp",
        location: "båda",
        laborShare: 1.0
      },
      {
        id: "flytt-3",
        title: "Bärhjälp (4 personer)",
        description: "Hjälp med att bära tunga föremål, 4-mans team",
        basePrice: 1119,
        priceUnit: "kr/h", 
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Bärhjälp",
        location: "båda",
        laborShare: 1.0
      },
      // Packhjälp
      {
        id: "flytt-4",
        title: "Packhjälp - liten flytt",
        description: "Hjälp med packning och uppackning, mindre mängd",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Packning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "flytt-5",
        title: "Packhjälp - standard flytt",
        description: "Hjälp med packning och uppackning, standard mängd",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Packning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "flytt-6",
        title: "Packhjälp - stor flytt",
        description: "Hjälp med packning och uppackning, större mängd",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Packning",
        location: "inomhus",
        laborShare: 1.0
      },
      // Flyttbil
      {
        id: "flytt-7",
        title: "Flyttbil + team",
        description: "Flytthjälp med bil och personal",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Transport",
        location: "båda",
        laborShare: 1.0
      },
      // Tömning
      {
        id: "flytt-8",
        title: "Tömning till återvinning",
        description: "Hjälp med tömning och transport till återvinning",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Tömning",
        location: "båda",
        laborShare: 1.0
      },
      // Montering i samband med flytt
      {
        id: "flytt-9",
        title: "Ned/uppmontering av möbler",
        description: "Demontering och montering av möbler vid flytt",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Montering",
        location: "inomhus",
        laborShare: 1.0
      }
    ]
  },
  // Nya kategorier
  {
    title: "Markarbeten",
    slug: "markarbeten",
    description: "Schaktning, dränering och anläggning",
    icon: Mountain,
    basePrice: 859,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      {
        id: "mark-1",
        title: "Schaktning för altan",
        description: "Schaktning och förberedelse för altanbygge",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Schaktning",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "mark-2",
        title: "Schaktning för grund",
        description: "Schaktning för husgrund eller tillbyggnad",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Schaktning",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "mark-3",
        title: "Dränering (0-25 m)",
        description: "Installation av dränering, kortare sträcka",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Dränering",
        location: "utomhus",
        laborShare: 0.7
      },
      {
        id: "mark-4",
        title: "Dränering (26-50 m)",
        description: "Installation av dränering, medellång sträcka",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Dränering",
        location: "utomhus",
        laborShare: 0.7
      },
      {
        id: "mark-5",
        title: "Plattsättning (0-25 m²)",
        description: "Läggning av plattor, mindre yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Plattsättning",
        location: "utomhus",
        laborShare: 0.7
      },
      {
        id: "mark-6",
        title: "Plattsättning (26-50 m²)",
        description: "Läggning av plattor, medelstor yta",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Plattsättning",
        location: "utomhus",
        laborShare: 0.7
      },
      {
        id: "mark-7",
        title: "Staketstolpar (1-5 st)",
        description: "Installation av staketstolpar med gjutning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Staket",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "mark-8",
        title: "Staketstolpar (6-15 st)",
        description: "Installation av flera staketstolpar med gjutning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Staket",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "mark-9",
        title: "Grus & kantsten (0-25 m)",
        description: "Läggning av grus och kantsten, kortare sträcka",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Grus",
        location: "utomhus",
        laborShare: 0.7
      },
      {
        id: "mark-10",
        title: "Grus & kantsten (26-50 m)",
        description: "Läggning av grus och kantsten, längre sträcka",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Grus",
        location: "utomhus",
        laborShare: 0.7
      }
    ]
  },
  {
    title: "Tekniska installationer",
    slug: "tekniska-installationer",
    description: "IT, larm och specialinstallationer",
    icon: Cpu,
    basePrice: 959,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: false },
    subServices: [
      // Nätverk - ej ROT/RUT
      {
        id: "teknik-1",
        title: "Nätverksdragning",
        description: "Dragning av nätverkskablar i fastighet",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Nätverk",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "teknik-2",
        title: "Nätverksuttag installation",
        description: "Installation av nätverksuttag",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Nätverk",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "teknik-3",
        title: "Patch & konfiguration",
        description: "Patchning och konfiguration av nätverk",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Nätverk",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "teknik-4",
        title: "Wi-Fi optimering",
        description: "Optimering och förstärkning av Wi-Fi",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Trådlöst",
        location: "inomhus",
        laborShare: 1.0
      },
      // Larm & övervakning - ej ROT/RUT
      {
        id: "teknik-5",
        title: "Larminstallation",
        description: "Installation av larmsystem",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Säkerhet",
        location: "båda",
        laborShare: 1.0
      },
      {
        id: "teknik-6",
        title: "Övervakningskameror",
        description: "Installation av övervakningssystem",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Säkerhet",
        location: "båda",
        laborShare: 1.0
      },
      // Grön teknik - egen kategori
      {
        id: "teknik-7",
        title: "Laddbox förarbete",
        description: "Förberedelser för installation av laddbox (se villkor för avdrag)",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Grön teknik",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "teknik-8",
        title: "Solcells-förarbete",
        description: "Förberedande arbeten för solcellsinstallation (se villkor för avdrag)",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Grön teknik",
        location: "utomhus",
        laborShare: 1.0
      }
    ]
  }
];

export default servicesDataNew;