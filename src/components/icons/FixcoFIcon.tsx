import { useTheme } from "@/theme/useTheme";
import { OptimizedImage } from "@/components/OptimizedImage";
import fixcoFIcon from "@/assets/fixco-f-icon.png";

interface FixcoFIconProps {
  className?: string;
}

export const FixcoFIcon = ({ className = "" }: FixcoFIconProps) => {
  const { theme } = useTheme();
  
  // Light theme = make icon darker, Dark/Ocean themes = keep as is
  const filterStyle = theme === 'light' 
    ? 'brightness(0.3) saturate(100%)' 
    : 'none';
  
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
