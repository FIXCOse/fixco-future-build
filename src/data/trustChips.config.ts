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
import type { CopyKey } from '@/copy/keys';

export interface TrustChipConfig {
  icon: any;
  color: string;
  backgroundGradient?: string;
  link?: string;
}

export const TRUST_CHIPS_BASE: CopyKey[] = [
  'chips.f_skatt',
  'chips.insured', 
  'chips.start_lt_5',
  'chips.fixed_price'
];

export const TRUST_CHIPS_EXTENDED: CopyKey[] = [
  ...TRUST_CHIPS_BASE,
  'chips.rot_50',
  'chips.rut_50',
  'chips.transparent',
  'chips.free_quote',
  'chips.we_handle_rot',
  'chips.happy_customers',
  'chips.fast_support'
];

// Special chips for rating and location
export const RATING_CHIP: CopyKey = 'chips.happy_customers';
export const LOCATION_CHIP: CopyKey = 'chips.happy_customers';

export const getTrustChipConfig = (chipId: CopyKey): TrustChipConfig => {
  const configs: Partial<Record<CopyKey, TrustChipConfig>> = {
    'chips.f_skatt': {
      icon: Stamp,
      color: "text-green-500",
      backgroundGradient: "bg-gradient-to-r from-green-600 to-emerald-600"
    },
    'chips.insured': {
      icon: Shield,
      color: "text-blue-500", 
      backgroundGradient: "bg-gradient-to-r from-blue-600 to-indigo-600"
    },
    'chips.start_lt_5': {
      icon: Clock,
      color: "text-primary",
      backgroundGradient: "bg-gradient-to-r from-cyan-500 to-blue-500"
    },
    'chips.fixed_price': {
      icon: Tag,
      color: "text-primary",
      backgroundGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
      link: "/tjanster?filter=fast-pris"
    },
    'chips.rot_50': {
      icon: Calculator,
      color: "text-green-500",
      backgroundGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
      link: "/rot"
    },
    'chips.rut_50': {
      icon: Home,
      color: "text-blue-500",
      backgroundGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
      link: "/rut"
    },
    'chips.transparent': {
      icon: Eye,
      color: "text-primary",
      backgroundGradient: "bg-gradient-to-r from-teal-500 to-cyan-500"
    },
    'chips.free_quote': {
      icon: FileText,
      color: "text-green-500",
      backgroundGradient: "bg-gradient-to-r from-lime-500 to-green-500"
    },
    'chips.we_handle_rot': {
      icon: HandHeart,
      color: "text-primary",
      backgroundGradient: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    'chips.happy_customers': {
      icon: Users,
      color: "text-yellow-500",
      backgroundGradient: "bg-gradient-to-r from-yellow-500 to-orange-500"
    },
    'chips.fast_support': {
      icon: Headphones,
      color: "text-blue-500",
      backgroundGradient: "bg-gradient-to-r from-indigo-500 to-purple-500"
    }
  };
  
  return configs[chipId] || {
    icon: CheckCircle2,
    color: "text-primary",
    backgroundGradient: "bg-gradient-to-r from-primary to-primary-variant"
  };
};

// Special configs for rating and location
export const RATING_CONFIG: TrustChipConfig = {
  icon: Star,
  color: "text-yellow-500",
  backgroundGradient: "bg-gradient-to-r from-yellow-400 to-amber-500"
};

export const LOCATION_CONFIG: TrustChipConfig = {
  icon: MapPin,
  color: "text-primary",
  backgroundGradient: "bg-gradient-to-r from-slate-500 to-gray-600"
};