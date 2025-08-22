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
  Building 
} from "lucide-react";

export interface SubService {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  rotPrice: string;
  priceType: 'fast' | 'timpris' | 'offert';
  rotEligible: boolean;
  category: string;
  room?: string;
  location: 'inomhus' | 'utomhus' | 'båda';
}

export interface Service {
  title: string;
  slug: string;
  description: string;
  icon: any;
  subServices: SubService[];
  basePrice: string;
  rotPrice: string;
}

export const servicesData: Service[] = [
  {
    title: "El",
    slug: "el",
    description: "Installation, reparation och underhåll",
    icon: Zap,
    basePrice: "1059 kr/h",
    rotPrice: "530 kr/h",
    subServices: [
      {
        id: "el-1",
        title: "Byta vägguttag",
        description: "Byte av befintligt vägguttag till nyare modell",
        basePrice: "890 kr",
        rotPrice: "445 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Elinstallationer",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "el-2", 
        title: "Byta strömbrytare och dimmer",
        description: "Installation av nya strömbrytare och dimrar",
        basePrice: "1190 kr",
        rotPrice: "595 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Elinstallationer",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "el-3",
        title: "USB-uttag installation",
        description: "Montering av moderna USB-uttag med snabbladdning",
        basePrice: "1490 kr",
        rotPrice: "745 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Elinstallationer",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "el-4",
        title: "Byta säkringar/automation",
        description: "Uppgradering av el-central och säkringssystem",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "El-central",
        room: "Elcentral",
        location: "inomhus"
      },
      {
        id: "el-5",
        title: "Ny elgrupp/krets",
        description: "Installation av ny elgrupp från elcentral",
        basePrice: "Begär offert", 
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "El-central",
        room: "Elcentral",
        location: "inomhus"
      },
      {
        id: "el-6",
        title: "Belysning inne",
        description: "Installation av armaturer och belysningssystem inomhus",
        basePrice: "1059 kr/h",
        rotPrice: "530 kr/h", 
        priceType: "timpris",
        rotEligible: true,
        category: "Belysning",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "el-7",
        title: "Belysning ute",
        description: "Utomhusbelysning, trädgårdsbelysning och fasadbelysning",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Belysning",
        room: "Utomhus",
        location: "utomhus"
      },
      {
        id: "el-8", 
        title: "Smart hemstyrning",
        description: "Installation av smart belysning och hemautomation",
        basePrice: "Begär offert",
        rotPrice: "Begär offert", 
        priceType: "offert",
        rotEligible: true,
        category: "Smart hem",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "el-9",
        title: "Laddbox bil",
        description: "Installation av laddstation för elbil",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert", 
        rotEligible: true,
        category: "Laddning",
        room: "Garage/Utomhus",
        location: "båda"
      }
    ]
  },
  {
    title: "VVS",
    slug: "vvs",
    description: "Rör, värme och sanitär installation",
    icon: Wrench,
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h",
    subServices: [
      {
        id: "vvs-1",
        title: "Montera WC-stol",
        description: "Installation av ny toalettstol med anslutning",
        basePrice: "2390 kr",
        rotPrice: "1195 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Sanitet",
        room: "Badrum",
        location: "inomhus"
      },
      {
        id: "vvs-2", 
        title: "Montera handfat",
        description: "Installation av handfat med blandare och sifon",
        basePrice: "1890 kr",
        rotPrice: "945 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Sanitet",
        room: "Badrum",
        location: "inomhus"
      },
      {
        id: "vvs-3",
        title: "Byta blandare",
        description: "Byte av kran/blandare kök eller badrum",
        basePrice: "1490 kr",
        rotPrice: "745 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Sanitet", 
        room: "Kök/Badrum",
        location: "inomhus"
      },
      {
        id: "vvs-4",
        title: "Ansluta diskmaskin/tvättmaskin",
        description: "Vattenanslutning för vitvaror",
        basePrice: "1590 kr",
        rotPrice: "795 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Vitvaror",
        room: "Kök/Tvättstuga",
        location: "inomhus"
      },
      {
        id: "vvs-5",
        title: "Duschvägg/duschkabin",
        description: "Installation av duschväggar eller kompletta duschar",
        basePrice: "Begär offert",
        rotPrice: "Begär offert", 
        priceType: "offert",
        rotEligible: true,
        category: "Badrum",
        room: "Badrum",
        location: "inomhus"
      },
      {
        id: "vvs-6",
        title: "Golvbrunn/avlopp",
        description: "Installation eller renovering av golvbrunnar",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Avlopp",
        room: "Badrum", 
        location: "inomhus"
      }
    ]
  },
  {
    title: "Snickeri", 
    slug: "snickeri",
    description: "Kök, badrum, inredning och möbler",
    icon: Hammer,
    basePrice: "859 kr/h",
    rotPrice: "430 kr/h",
    subServices: [
      {
        id: "snickeri-1",
        title: "Lister och foder",
        description: "Installation av golv-, tak- och dörrfoder",
        basePrice: "859 kr/h",
        rotPrice: "430 kr/h",
        priceType: "timpris",
        rotEligible: true,
        category: "Finish",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "snickeri-2",
        title: "Dörrmontage",
        description: "Montering av innerdörrar med karmar",
        basePrice: "1890 kr",
        rotPrice: "945 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Dörrar",
        room: "Alla rum", 
        location: "inomhus"
      },
      {
        id: "snickeri-3", 
        title: "Hyllsystem/garderober",
        description: "Montering av förvaringslösningar och garderober",
        basePrice: "859 kr/h",
        rotPrice: "430 kr/h",
        priceType: "timpris",
        rotEligible: true,
        category: "Förvaring",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "snickeri-4",
        title: "Platsbyggda lösningar",
        description: "Skräddarsydda inredningslösningar",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Specialarbete",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "snickeri-5",
        title: "Altan/trall/uteplats",
        description: "Byggnation av terrasser och uteplatser",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert", 
        rotEligible: true,
        category: "Ute",
        room: "Utomhus",
        location: "utomhus"
      }
    ]
  },
  {
    title: "Montering",
    slug: "montering", 
    description: "Möbler, maskiner och teknisk utrustning",
    icon: Package,
    basePrice: "759 kr/h",
    rotPrice: "380 kr/h",
    subServices: [
      {
        id: "montering-1",
        title: "IKEA-möbler",
        description: "Montering av alla typer av IKEA-möbler",
        basePrice: "759 kr/h",
        rotPrice: "380 kr/h",
        priceType: "timpris", 
        rotEligible: true,
        category: "Möbler",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "montering-2",
        title: "TV-väggfäste", 
        description: "Säker montering av TV på vägg",
        basePrice: "890 kr",
        rotPrice: "445 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Elektronik",
        room: "Vardagsrum/Sovrum",
        location: "inomhus"
      },
      {
        id: "montering-3",
        title: "Tavlor och speglar",
        description: "Upphängning av tavlor, speglar och konst",
        basePrice: "590 kr",
        rotPrice: "295 kr",
        priceType: "fast",
        rotEligible: true, 
        category: "Inredning",
        room: "Alla rum", 
        location: "inomhus"
      },
      {
        id: "montering-4",
        title: "Vitvaror (kyl, frys, ugn)",
        description: "Installation och anslutning av vitvaror",
        basePrice: "1290 kr",
        rotPrice: "645 kr",
        priceType: "fast",
        rotEligible: true,
        category: "Vitvaror",
        room: "Kök",
        location: "inomhus"
      }
    ]
  },
  {
    title: "Trädgård",
    slug: "tradgard",
    description: "Anläggning, skötsel och underhåll", 
    icon: TreePine,
    basePrice: "659 kr/h",
    rotPrice: "330 kr/h",
    subServices: [
      {
        id: "tradgard-1",
        title: "Gräsklippning",
        description: "Regelbunden gräsklippning och kanttrimning",
        basePrice: "659 kr/h",
        rotPrice: "330 kr/h",
        priceType: "timpris",
        rotEligible: true,
        category: "Skötsel",
        room: "Trädgård",
        location: "utomhus"
      },
      {
        id: "tradgard-2",
        title: "Häckklippning", 
        description: "Beskärning av häckar och buskar",
        basePrice: "659 kr/h",
        rotPrice: "330 kr/h",
        priceType: "timpris",
        rotEligible: true,
        category: "Skötsel", 
        room: "Trädgård",
        location: "utomhus"
      },
      {
        id: "tradgard-3",
        title: "Ogräsrensning",
        description: "Borttagning av ogräs från rabatter och gångar",
        basePrice: "659 kr/h",
        rotPrice: "330 kr/h", 
        priceType: "timpris",
        rotEligible: true,
        category: "Skötsel",
        room: "Trädgård",
        location: "utomhus"
      },
      {
        id: "tradgard-4",
        title: "Plantering och anläggning",
        description: "Plantering av växter och anläggnig av rabatter",
        basePrice: "Begär offert", 
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Anläggning",
        room: "Trädgård", 
        location: "utomhus"
      }
    ]
  },
  {
    title: "Städning",
    slug: "stadning",
    description: "Byggstäd, flyttstäd och regelbunden städning",
    icon: Sparkles, 
    basePrice: "459 kr/h",
    rotPrice: "230 kr/h",
    subServices: [
      {
        id: "stadning-1",
        title: "Hemstäd regelbundet",
        description: "Regelbunden städning av hemmet",
        basePrice: "459 kr/h",
        rotPrice: "230 kr/h",
        priceType: "timpris",
        rotEligible: true,
        category: "Hemstäd",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "stadning-2",
        title: "Flyttstäd",
        description: "Grundlig städning vid flytt",
        basePrice: "Begär offert", 
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Specialstäd",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "stadning-3",
        title: "Byggstäd",
        description: "Städning efter renovering eller byggnation", 
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Specialstäd",
        room: "Alla rum",
        location: "inomhus"
      },
      {
        id: "stadning-4",
        title: "Fönsterputs",
        description: "Putsning av fönster in- och utvändigt",
        basePrice: "690 kr",
        rotPrice: "345 kr",
        priceType: "fast", 
        rotEligible: true,
        category: "Specialstäd",
        room: "Alla rum",
        location: "båda"
      }
    ]
  },
  {
    title: "Projektledning",
    slug: "projektledning",
    description: "Helhetslösningar från start till mål",
    icon: ClipboardList,
    basePrice: "1159 kr/h", 
    rotPrice: "580 kr/h",
    subServices: [
      {
        id: "projektledning-1",
        title: "Badrumsrenovering",
        description: "Komplett projektledning för badrumsrenovering",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Renovering",
        room: "Badrum",
        location: "inomhus"
      },
      {
        id: "projektledning-2", 
        title: "Köksrenovering",
        description: "Total projektledning för köksrenovering", 
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Renovering",
        room: "Kök",
        location: "inomhus"
      },
      {
        id: "projektledning-3",
        title: "Hela hem-projekt",
        description: "Koordinering av större projekt i hela hemmet",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Storprojekt",
        room: "Alla rum",
        location: "inomhus"
      }
    ]
  },
  {
    title: "Markarbeten",
    slug: "markarbeten",
    description: "Grävning, dränering och anläggning",
    icon: Mountain,
    basePrice: "959 kr/h",
    rotPrice: "480 kr/h",
    subServices: [
      {
        id: "markarbeten-1",
        title: "Grävning och schaktning",
        description: "Schaktarbeten för grundläggning och dränering",
        basePrice: "959 kr/h", 
        rotPrice: "480 kr/h",
        priceType: "timpris",
        rotEligible: true,
        category: "Grävning",
        room: "Utomhus",
        location: "utomhus"
      },
      {
        id: "markarbeten-2",
        title: "Dränering",
        description: "Installation av dräneringssystem runt huset",
        basePrice: "Begär offert",
        rotPrice: "Begär offert", 
        priceType: "offert",
        rotEligible: true,
        category: "Dränering",
        room: "Utomhus",
        location: "utomhus"
      }
    ]
  },
  {
    title: "Tekniska installationer",
    slug: "tekniska-installationer",
    description: "Automation, säkerhet och smarta lösningar",
    icon: Cpu,
    basePrice: "1159 kr/h",
    rotPrice: "580 kr/h", 
    subServices: [
      {
        id: "teknik-1",
        title: "Larmsystem", 
        description: "Installation av säkerhetslarm och övervakningssystem",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Säkerhet",
        room: "Alla rum",
        location: "båda"
      },
      {
        id: "teknik-2",
        title: "Smart hem-system",
        description: "Installation av komplett smart hem-automation",
        basePrice: "Begär offert",
        rotPrice: "Begär offert",
        priceType: "offert",
        rotEligible: true,
        category: "Automation",
        room: "Alla rum", 
        location: "inomhus"
      }
    ]
  },
  {
    title: "Fastighetsskötsel",
    slug: "fastighetsskotsel", 
    description: "Löpande underhåll och service",
    icon: Building,
    basePrice: "759 kr/h",
    rotPrice: "380 kr/h",
    subServices: [
      {
        id: "fastighet-1",
        title: "Löpande underhåll",
        description: "Regelbundet underhåll av fastighet och bostad",
        basePrice: "759 kr/h",
        rotPrice: "380 kr/h",
        priceType: "timpris", 
        rotEligible: true,
        category: "Underhåll",
        room: "Alla rum",
        location: "båda"
      },
      {
        id: "fastighet-2",
        title: "Akuta reparationer",
        description: "Snabba insatser vid akuta problem",
        basePrice: "959 kr/h",
        rotPrice: "480 kr/h",
        priceType: "timpris",
        rotEligible: true, 
        category: "Akut", 
        room: "Alla rum",
        location: "båda"
      }
    ]
  }
];