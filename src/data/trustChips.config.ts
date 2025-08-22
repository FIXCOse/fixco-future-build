import { 
  Shield, 
  Award, 
  Clock, 
  CheckCircle2, 
  Star, 
  MapPin,
  Calculator,
  Home,
  Tag,
  Eye,
  FileText,
  HandHeart,
  Users,
  Headphones,
  Stamp,
  DollarSign
} from "lucide-react";

export interface TrustChip {
  id: string;
  label: string;
  description?: string;
  icon: any;
  color: string;
  link?: string;
  tooltip?: string;
}

export const TRUST_CHIPS_BASE: TrustChip[] = [
  {
    id: "f_skatt",
    label: "F-skatt",
    description: "Godkänd för ROT & RUT",
    icon: Stamp,
    color: "text-green-500",
    tooltip: "Registrerad för F-skatt - du kan använda ROT och RUT-avdrag"
  },
  {
    id: "insured",
    label: "Försäkrade",
    description: "Ansvarsförsäkring 10M kr",
    icon: Shield,
    color: "text-blue-500",
    tooltip: "Fullständig ansvarsförsäkring på 10 miljoner kronor"
  },
  {
    id: "start_time",
    label: "Start inom < 5 dagar",
    description: "Oftast inom 5 dagar",
    icon: Clock,
    color: "text-primary",
    tooltip: "Vi kan oftast börja ditt projekt inom 5 dagar"
  },
  {
    id: "fixed_price",
    label: "Fast pris",
    description: "Där det är möjligt",
    icon: Tag,
    color: "text-primary",
    link: "/tjanster?filter=fast-pris",
    tooltip: "Fast pris på många av våra tjänster"
  }
];

export const TRUST_CHIPS_EXTENDED: TrustChip[] = [
  ...TRUST_CHIPS_BASE,
  {
    id: "rot_avdrag",
    label: "ROT-avdrag 50%",
    description: "Spara hälften på arbetskostnaden",
    icon: Calculator,
    color: "text-green-500",
    link: "/rot",
    tooltip: "Få 50% av arbetskostnaden tillbaka via ROT-avdrag"
  },
  {
    id: "rut_avdrag",
    label: "RUT-avdrag",
    description: "För hem- och städservice",
    icon: Home,
    color: "text-blue-500",
    link: "/rot",
    tooltip: "RUT-avdrag för hemservice och städning"
  },
  {
    id: "transparent_price",
    label: "Transparent pris",
    description: "Inga dolda kostnader",
    icon: Eye,
    color: "text-primary",
    tooltip: "Alltid öppna och tydliga priser utan överraskningar"
  },
  {
    id: "free_quote",
    label: "Kostnadsfri offert",
    description: "Utan förpliktelse",
    icon: FileText,
    color: "text-green-500",
    tooltip: "Vi ger alltid kostnadsfria offerter utan förpliktelse"
  },
  {
    id: "we_handle_rot",
    label: "Vi sköter ROT",
    description: "Allt administrativt",
    icon: HandHeart,
    color: "text-primary",
    tooltip: "Vi hanterar all ROT-administration åt dig"
  },
  {
    id: "happy_customers",
    label: "2000+ nöjda kunder",
    description: "Över 500 recensioner",
    icon: Users,
    color: "text-yellow-500",
    tooltip: "Över 2000 nöjda kunder och 500+ positiva recensioner"
  },
  {
    id: "fast_support",
    label: "Snabb support",
    description: "Svar inom 2 timmar",
    icon: Headphones,
    color: "text-blue-500",
    tooltip: "Vårt supportteam svarar inom 2 timmar under kontorstid"
  }
];

// Rating chip specifically
export const RATING_CHIP: TrustChip = {
  id: "rating",
  label: "4.9/5 betyg",
  description: "Över 500 recensioner",
  icon: Star,
  color: "text-yellow-500",
  tooltip: "Genomsnittligt betyg 4.9 av 5 baserat på över 500 recensioner"
};

// Location chip specifically
export const LOCATION_CHIP: TrustChip = {
  id: "location",
  label: "Uppsala & Stockholm",
  description: "Lokalt & nationellt",
  icon: MapPin,
  color: "text-primary",
  tooltip: "Vi verkar i Uppsala och Stockholmsområdet"
};