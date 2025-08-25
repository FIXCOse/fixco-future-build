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
  backgroundGradient?: string;
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
    backgroundGradient: "bg-gradient-to-r from-green-600 to-emerald-600",
    tooltip: "Registrerad för F-skatt - du kan använda ROT och RUT-avdrag"
  },
  {
    id: "insured",
    label: "Försäkrade",
    description: "Ansvarsförsäkring 10M kr",
    icon: Shield,
    color: "text-blue-500",
    backgroundGradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
    tooltip: "Fullständig ansvarsförsäkring på 10 miljoner kronor"
  },
  {
    id: "start_time",
    label: "Start inom < 5 dagar",
    description: "Oftast inom 5 dagar",
    icon: Clock,
    color: "text-primary",
    backgroundGradient: "bg-gradient-to-r from-cyan-500 to-blue-500",
    tooltip: "Vi kan oftast börja ditt projekt inom 5 dagar"
  },
  {
    id: "fixed_price",
    label: "Fast pris",
    description: "Där det är möjligt",
    icon: Tag,
    color: "text-primary",
    backgroundGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
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
    backgroundGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    link: "/rot",
    tooltip: "Få 50% av arbetskostnaden tillbaka via ROT-avdrag"
  },
  {
    id: "rut_avdrag",
    label: "RUT-avdrag 50%",
    description: "För hushållsnära tjänster",
    icon: Home,
    color: "text-blue-500",
    backgroundGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    link: "/rut",
    tooltip: "50% avdrag på arbetskostnaden för hemservice, städning och trädgård"
  },
  {
    id: "transparent_price",
    label: "Transparent pris",
    description: "Inga dolda kostnader",
    icon: Eye,
    color: "text-primary",
    backgroundGradient: "bg-gradient-to-r from-teal-500 to-cyan-500",
    tooltip: "Alltid öppna och tydliga priser utan överraskningar"
  },
  {
    id: "free_quote",
    label: "Kostnadsfri offert",
    description: "Utan förpliktelse",
    icon: FileText,
    color: "text-green-500",
    backgroundGradient: "bg-gradient-to-r from-lime-500 to-green-500",
    tooltip: "Vi ger alltid kostnadsfria offerter utan förpliktelse"
  },
  {
    id: "we_handle_rot",
    label: "Vi sköter ROT",
    description: "Allt administrativt",
    icon: HandHeart,
    color: "text-primary",
    backgroundGradient: "bg-gradient-to-r from-pink-500 to-rose-500",
    tooltip: "Vi hanterar all ROT-administration åt dig"
  },
  {
    id: "happy_customers",
    label: "2000+ nöjda kunder",
    description: "Över 500 recensioner",
    icon: Users,
    color: "text-yellow-500",
    backgroundGradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    tooltip: "Över 2000 nöjda kunder och 500+ positiva recensioner"
  },
  {
    id: "fast_support",
    label: "Snabb support",
    description: "Svar inom 2 timmar",
    icon: Headphones,
    color: "text-blue-500",
    backgroundGradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
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
  backgroundGradient: "bg-gradient-to-r from-yellow-400 to-amber-500",
  tooltip: "Genomsnittligt betyg 4.9 av 5 baserat på över 500 recensioner"
};

// Location chip specifically
export const LOCATION_CHIP: TrustChip = {
  id: "location",
  label: "Uppsala & Stockholm",
  description: "Lokalt & nationellt",
  icon: MapPin,
  color: "text-primary",
  backgroundGradient: "bg-gradient-to-r from-slate-500 to-gray-600",
  tooltip: "Vi verkar i Uppsala och Stockholmsområdet"
};