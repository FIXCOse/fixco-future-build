import { 
  Cable, 
  EyeOff, 
  Recycle, 
  Trash2, 
  Wrench, 
  Truck, 
  Sparkles, 
  Lightbulb, 
  Package, 
  Leaf, 
  TreePine, 
  Plus, 
  Square, 
  Flame,
  Shield,
  Droplet,
  Paintbrush,
  Thermometer,
  Smartphone,
  FileText,
  Clock,
  Camera,
  Settings,
  VolumeX,
  Plug,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'cable': Cable,
  'eye-off': EyeOff,
  'recycle': Recycle,
  'trash-2': Trash2,
  'trash': Trash2,
  'wrench': Wrench,
  'truck': Truck,
  'sparkles': Sparkles,
  'lightbulb': Lightbulb,
  'package': Package,
  'leaf': Leaf,
  'tree-pine': TreePine,
  'plus': Plus,
  'square': Square,
  'flame': Flame,
  'shield': Shield,
  'droplet': Droplet,
  'paintbrush': Paintbrush,
  'thermometer': Thermometer,
  'smartphone': Smartphone,
  'file-text': FileText,
  'clock': Clock,
  'camera': Camera,
  'settings': Settings,
  'volume-x': VolumeX,
  'plug': Plug,
};

export const getIconComponent = (iconName: string | null | undefined): LucideIcon => {
  if (!iconName) return Sparkles;
  const IconComponent = iconMap[iconName.toLowerCase()];
  return IconComponent || Sparkles;
};
