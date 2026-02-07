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
  Droplets,
  Paintbrush
} from "lucide-react";
import { ServicePricing } from '@/utils/priceCalculation';

// Sub-service interface
export interface SubService extends ServicePricing {
  category: string;
  location: 'inomhus' | 'utomhus' | 'båda';
  priceType: 'hourly' | 'fixed' | 'quote';
}

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
    id: "malare",
    title: "Målare",
    basePrice: 759,
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
    id: "malare",
    title: "Målare",
    slug: "malare",
    description: "Professionell målning in- och utvändigt",
    icon: Paintbrush,
    eligible: { rot: true, rut: false }
  },
  {
    id: "montering",
    title: "Montering",
    slug: "montering", 
    description: "Möbler, hyllor och apparater",
    icon: Package,
    eligible: { rot: true, rut: false }
  },
  {
    id: "tradgard",
    title: "Trädgård",
    slug: "tradgard",
    description: "Gräs, häckar och trädvård",
    icon: TreePine,
    eligible: { rot: false, rut: true }
  },
  {
    id: "stadning",
    title: "Städning",
    slug: "stadning",
    description: "Hem, flytt och byggstäd",
    icon: Sparkles,
    eligible: { rot: false, rut: true }
  },
  {
    id: "markarbeten",
    title: "Markarbeten",
    slug: "markarbeten",
    description: "Schakt, dränering och plattläggning",
    icon: Mountain,
    eligible: { rot: true, rut: false }
  },
  {
    id: "tekniska-installationer",
    title: "Tekniska installationer",
    slug: "tekniska-installationer",
    description: "Nätverk, larm och IT-support",
    icon: Cpu,
    eligible: { rot: false, rut: false }
  },
  {
    id: "flytt",
    title: "Flytt",
    slug: "flytt",
    description: "Bärhjälp, packning och transport",
    icon: Truck,
    eligible: { rot: false, rut: true }
  }
];

// Detailed service categories with sub-services
export const servicesDataNew = [
  {
    title: "El", 
    slug: "el",
    description: "Installation, reparation och underhåll",
    icon: Zap,
    basePrice: 1059,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // Uttag & Strömbrytare  
      {
        id: "el-1",
        title: "Byta vägguttag",
        description: "Byte av vägguttag till nyare modeller. Antal väljs vid bokning",
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
        title: "Byta strömbrytare och dimmer",
        description: "Installation av nya strömbrytare och dimrar. Antal väljs vid bokning",
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
        id: "el-3",
        title: "Installera takarmatur/pendel",
        description: "Montering av takarmaturer och pendellampor. Antal väljs vid bokning",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-4",
        title: "Installera spotlights",
        description: "Installation av spotlights i tak. Antal väljs vid bokning (typiskt 0,5-1h per 4-6 st)",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Belysning",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-5",
        title: "Utebelysning",
        description: "Installation av fasad- och trädgårdsbelysning. Typ väljs vid bokning",
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
        id: "el-6",
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
        id: "el-7",
        title: "Felsökning el",
        description: "Diagnostik och felsökning av elinstallationer (typiskt 1-2 h)",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Service",
        location: "båda",
        laborShare: 1.0
      },
      {
        id: "el-8",
        title: "Dra fram ny elpunkt",
        description: "Installation av ny elpunkt. Rum väljs vid bokning",
        basePrice: 1059,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Installationer",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "el-9",
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
        id: "el-10",
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
        id: "el-11",
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
        title: "Byta blandare",
        description: "Byte av blandare. Rum/typ väljs vid bokning",
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
        id: "vvs-2",
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
        id: "vvs-3",
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
        id: "vvs-4",
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
        id: "vvs-5",
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
        id: "vvs-6",
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
        id: "vvs-7",
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
        id: "vvs-8",
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
        id: "vvs-9",
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
        id: "vvs-10",
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
        id: "vvs-11",
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
        id: "vvs-12",
        title: "Golvbrunnsbyte",
        description: "Byte av golvbrunn med anslutningar",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Större projekt",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "vvs-13",
        title: "Badrumsrenovering",
        description: "Komplett badrumsrenovering",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Större projekt",
        location: "inomhus",
        laborShare: 1.0
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
      // Förvaring
      {
        id: "snickeri-1",
        title: "Platsbyggd garderob",
        description: "Tillverkning av platsbyggd garderob. Storlek väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-2",
        title: "Hyllsystem & förvaring",
        description: "Installation av hyllsystem och förvaringslösningar",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Förvaring",
        location: "inomhus",
        laborShare: 1.0
      },
      // Dörrar & Foder
      {
        id: "snickeri-3",
        title: "Montera innerdörrar",
        description: "Montering av innerdörrar. Antal väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrar",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-4",
        title: "Lister & foder",
        description: "Installation av lister och foder. Rum väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Lister",
        location: "inomhus",
        laborShare: 1.0
      },
      // Kök
      {
        id: "snickeri-5",
        title: "Montera köksstommar",
        description: "Montering av köksstommar. Antal väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      },
      // Golv
      {
        id: "snickeri-6",
        title: "Golvbyte laminat/parkett",
        description: "Byte av golv. Yta och typ väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Golv",
        location: "inomhus",
        laborShare: 1.0
      },
      // Renoveringar
      {
        id: "snickeri-7",
        title: "Väggresning & gips",
        description: "Rivning av väggar och gipsning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Renovering",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "snickeri-8",
        title: "Trapp-renovering",
        description: "Renovering av trappor",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Renovering",
        location: "inomhus",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "Målning",
    slug: "malare",
    description: "Professionell målning inomhus och utomhus",
    icon: Paintbrush,
    basePrice: 759,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // VÄGGAR & TAK
      {
        id: "malning-1",
        title: "Måla rum/väggar",
        description: "Målning av väggar. Antal rum och typ av yta väljs vid bokning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Inomhus",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "malning-2",
        title: "Måla tak",
        description: "Målning av tak. Rum och typ väljs vid bokning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Inomhus",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "malning-3",
        title: "Tapetsera",
        description: "Tapetsering av väggar. Typ av tapet och yta väljs vid bokning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Inomhus",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "malning-4",
        title: "Spackling & förberedelse",
        description: "Spackling av väggar och förberedelse innan målning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Förberedelse",
        location: "inomhus",
        laborShare: 1.0
      },
      
      // SPECIALMÅLNING
      {
        id: "malning-5",
        title: "Måla foder & lister",
        description: "Målning av dörrfoder, lister och snickerier",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Snickerier",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "malning-6",
        title: "Måla köksluckor",
        description: "Målning av köksluckor och skåp",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      },
      
      // UTOMHUS
      {
        id: "malning-7",
        title: "Måla fasad",
        description: "Målning av fasad. Yta och typ väljs vid bokning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Utomhus",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "malning-8",
        title: "Måla staket/plank",
        description: "Målning av staket eller plank. Längd väljs vid bokning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Utomhus",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "malning-9",
        title: "Måla dörrar/fönster utvändigt",
        description: "Målning av utvändiga dörrar och fönsterbågar",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Utomhus",
        location: "utomhus",
        laborShare: 1.0
      },
      
      // STÖRRE PROJEKT
      {
        id: "malning-10",
        title: "Helrenovering målning",
        description: "Komplett målning av hela lägenheten/huset",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Renovering",
        location: "inomhus",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "Montering",
    slug: "montering",
    description: "Möbler, hyllor och apparater",
    icon: Package,
    basePrice: 759,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // RUT-tjänster (möbler)
      {
        id: "montering-1",
        title: "Montera möbler",
        description: "Montering av möbler (säng, soffa, garderob, sideboard). Typ väljs vid bokning",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Möbler",
        location: "inomhus",
        laborShare: 1.0
      },
      // ROT-tjänster (väggfasta)
      {
        id: "montering-2",
        title: "Väggfasta hyllor & mediamöbler",
        description: "Montering av väggfasta hyllor och mediamöbler",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Väggfästen",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-3",
        title: "Montera speglar",
        description: "Väggmontering av speglar",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Väggfästen",
        location: "inomhus",
        laborShare: 1.0
      },
      // Fönsterbehandling
      {
        id: "montering-4",
        title: "Montera persienner/rullgardiner",
        description: "Montering av persienner och rullgardiner. Antal väljs vid bokning",
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
        id: "montering-5",
        title: "Montera duschvägg/kabin",
        description: "Montering av duschvägg eller duschkabin",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Badrum",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-6",
        title: "Montera köksfläkt",
        description: "Montering av köksfläkt",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Kök",
        location: "inomhus",
        laborShare: 1.0
      },
      // Dörrlås
      {
        id: "montering-installera-smart-dorrlas",
        title: "Installera smart dörrlås",
        description: "Installation av smarta dörrlås (Yale Doorman, Linus, Nuki m.fl.)",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrlås",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-installera-yale-doorman",
        title: "Installera Yale Doorman",
        description: "Professionell installation av Yale Doorman (L3S Flex, Classic, V2N)",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrlås",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-installera-yale-linus",
        title: "Installera Yale Linus",
        description: "Installation av Yale Linus smart lås utan borrning",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrlås",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-installera-kodlas",
        title: "Installera kodlås",
        description: "Installation av kodlås på ytterdörr eller innerdörr",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrlås",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "montering-byta-cylinderlas",
        title: "Byta cylinderlås",
        description: "Byte av cylinderlås i ytterdörr eller innerdörr",
        basePrice: 759,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Dörrlås",
        location: "inomhus",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "Trädgård",
    slug: "tradgard",
    description: "Gräs, häckar och trädvård",
    icon: TreePine,
    basePrice: 659,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    subServices: [
      // Gräsklippning
      {
        id: "tradgard-1",
        title: "Gräsklippning",
        description: "Klippning av gräsmatta. Storlek väljs vid bokning",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Gräs",
        location: "utomhus",
        laborShare: 1.0
      },
      // Häckar
      {
        id: "tradgard-2",
        title: "Häckklippning",
        description: "Klippning av häckar. Längd väljs vid bokning",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Häckar",
        location: "utomhus",
        laborShare: 1.0
      },
      // Träd
      {
        id: "tradgard-3",
        title: "Trädbeskärning",
        description: "Beskärning av träd. Storlek väljs vid bokning",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Träd",
        location: "utomhus",
        laborShare: 1.0
      },
      // Rabatter
      {
        id: "tradgard-4",
        title: "Ogräsrensning/rabattvård",
        description: "Rensning av ogräs och vård av rabatter",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Rabatter",
        location: "utomhus",
        laborShare: 1.0
      },
      // Löv & Snö
      {
        id: "tradgard-5",
        title: "Lövblåsning/lövupptag",
        description: "Borttagning av löv från gång och uppfart",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Löv",
        location: "utomhus",
        laborShare: 1.0
      },
      {
        id: "tradgard-6",
        title: "Snöskottning",
        description: "Snöskottning av gång, uppfart och tak (om lämpligt)",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Snö",
        location: "utomhus",
        laborShare: 1.0
      },
      // Ved
      {
        id: "tradgard-7",
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
      // Altanvård (osäker på ROT/RUT - markerad som ej avdrag)
      {
        id: "tradgard-8",
        title: "Altantvätt & oljning",
        description: "Tvätt och oljning av altandäck",
        basePrice: 659,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Altan",
        location: "utomhus",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "Städning",
    slug: "stadning",
    description: "Hem, flytt och byggstäd",
    icon: Sparkles,
    basePrice: 459,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    subServices: [
      // Hemstäd
      {
        id: "stadning-1",
        title: "Hemstäd",
        description: "Återkommande eller enstaka hemstäd. Frekvens väljs vid bokning",
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
        id: "stadning-2",
        title: "Flyttstäd",
        description: "Städning vid flytt. Yta väljs vid bokning",
        basePrice: 2890,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Flyttstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      // Byggstäd
      {
        id: "stadning-3",
        title: "Byggstäd",
        description: "Städning efter byggarbeten. Omfattning väljs vid bokning",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Byggstäd",
        location: "inomhus",
        laborShare: 1.0
      },
      // Fönster
      {
        id: "stadning-4",
        title: "Fönsterputs",
        description: "Putsning av fönster. Antal väljs vid bokning",
        basePrice: 125,
        priceUnit: "kr",
        priceType: "fixed",
        eligible: { rot: false, rut: true },
        category: "Fönster",
        location: "båda",
        laborShare: 1.0
      },
      // Djuprengöring
      {
        id: "stadning-5",
        title: "Djuprengöring kök/badrum",
        description: "Grundlig rengöring av kök eller badrum",
        basePrice: 459,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Djuprengöring",
        location: "inomhus",
        laborShare: 1.0
      },
      // Kontorsstäd (B2B - ej RUT)
      {
        id: "stadning-6",
        title: "Kontorsstäd (B2B)",
        description: "Städning av kontorslokaler - företagskund",
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
    title: "Markarbeten",
    slug: "markarbeten",
    description: "Schakt, dränering och plattläggning",
    icon: Mountain,
    basePrice: 859,
    priceUnit: "kr/h",
    eligible: { rot: true, rut: false },
    subServices: [
      // Schaktning
      {
        id: "markarbeten-1",
        title: "Schaktning för altan/grund",
        description: "Schaktning för altan eller grund till byggnader",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Schakt",
        location: "utomhus",
        laborShare: 1.0
      },
      // Dränering
      {
        id: "markarbeten-2",
        title: "Dränering",
        description: "Installation av dränering. Längd väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Dränering",
        location: "utomhus",
        laborShare: 1.0
      },
      // Plattsättning
      {
        id: "markarbeten-3",
        title: "Plattsättning",
        description: "Läggning av plattor. Yta väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Plattsättning",
        location: "utomhus",
        laborShare: 1.0
      },
      // Staket
      {
        id: "markarbeten-4",
        title: "Staketstolpar/gjutning",
        description: "Uppsättning av staketstolpar med gjutning. Antal väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: true, rut: false },
        category: "Staket",
        location: "utomhus",
        laborShare: 1.0
      },
      // Grus & Kantsten
      {
        id: "markarbeten-5",
        title: "Grus/kantsten",
        description: "Läggning av grus och kantsten. Längd väljs vid bokning",
        basePrice: 859,
        priceUnit: "kr/h",
        priceType: "quote",
        eligible: { rot: true, rut: false },
        category: "Grus",
        location: "utomhus",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "Tekniska installationer",
    slug: "tekniska-installationer",
    description: "Nätverk, larm och IT-support",
    icon: Cpu,
    basePrice: 959,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: false },
    subServices: [
      // Nätverk (ej ROT/RUT)
      {
        id: "tekniska-1",
        title: "Nätverksdragning",
        description: "Dragning av nätverkskablar och installation av uttag",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Nätverk",
        location: "inomhus",
        laborShare: 1.0
      },
      {
        id: "tekniska-2",
        title: "Wi-Fi-optimering",
        description: "Optimering av Wi-Fi-nätverk och accesspunkter",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Nätverk",
        location: "inomhus",
        laborShare: 1.0
      },
      // Larm (ej ROT/RUT)
      {
        id: "tekniska-3",
        title: "Larm/övervakning",
        description: "Installation av larm- och övervakningssystem",
        basePrice: 959,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: false },
        category: "Larm",
        location: "båda",
        laborShare: 1.0
      },
      // Grön teknik (egen reduktionstyp)
      {
        id: "tekniska-4",
        title: "Laddbox/solcells-förarbete",
        description: "Förarbete för laddbox och solceller. Badge: Grön teknik (se villkor)",
        basePrice: 959,
        priceUnit: "från" as const,
        priceType: "quote",
        eligible: { rot: false, rut: false },
        category: "Grön teknik",
        location: "båda",
        laborShare: 1.0
      }
    ]
  },
  {
    title: "Flytt",
    slug: "flytt",
    description: "Bärhjälp, packning och transport",
    icon: Truck,
    basePrice: 559,
    priceUnit: "kr/h",
    eligible: { rot: false, rut: true },
    subServices: [
      // Bärhjälp
      {
        id: "flytt-1",
        title: "Bärhjälp",
        description: "Bärhjälp vid flytt. Antal personer väljs vid bokning",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Bärhjälp",
        location: "båda",
        laborShare: 1.0
      },
      // Packhjälp
      {
        id: "flytt-2",
        title: "Packhjälp",
        description: "Packning av möbler och föremål. Omfattning väljs vid bokning",
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
        id: "flytt-3",
        title: "Flyttbil + team",
        description: "Flyttbil med team för transport",
        basePrice: 1159,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Transport",
        location: "båda",
        laborShare: 1.0
      },
      // Tömning
      {
        id: "flytt-4",
        title: "Tömning till återvinning",
        description: "Tömning och transport till återvinning",
        basePrice: 559,
        priceUnit: "kr/h",
        priceType: "hourly",
        eligible: { rot: false, rut: true },
        category: "Tömning",
        location: "båda",
        laborShare: 1.0
      },
      // Montering/demontering
      {
        id: "flytt-5",
        title: "Ned/upp-montering av möbler",
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
  }
];

// Helper function to get all sub-services
export const getAllSubServices = () => {
  return servicesDataNew.flatMap(service => 
    service.subServices.map(subService => ({
      ...subService,
      mainCategory: service.title,
      mainSlug: service.slug
    }))
  );
};

// Export helper for getting service by slug
export const getServiceBySlug = (slug: string) => {
  return servicesDataNew.find(service => service.slug === slug);
};

// Export helper for getting sub-service by id
export const getSubServiceById = (id: string) => {
  for (const service of servicesDataNew) {
    const subService = service.subServices.find(sub => sub.id === id);
    if (subService) {
      return {
        ...subService,
        mainCategory: service.title,
        mainSlug: service.slug
      };
    }
  }
  return null;
};