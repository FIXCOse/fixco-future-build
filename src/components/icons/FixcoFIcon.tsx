import { OptimizedImage } from "@/components/OptimizedImage";
import { useTheme } from "@/theme/useTheme";
import fixcoFIcon from "@/assets/fixco-f-icon-static.png";

interface FixcoFIconProps {
  className?: string;
  disableFilter?: boolean;
}

export const FixcoFIcon = ({ className = "", disableFilter = false }: FixcoFIconProps) => {
  const { theme } = useTheme();
  
  // Justera färg baserat på tema
  const filterStyle = disableFilter 
    ? 'none'
    : (theme === 'light' ? 'brightness(0.3) saturate(100%)' : 'none');
  
  return (
    <OptimizedImage
      src={fixcoFIcon}
      alt="Fixco Logo"
      className={className}
      style={{ filter: filterStyle }}
      priority
    />
  );
};
