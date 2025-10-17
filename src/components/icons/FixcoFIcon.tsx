import { useTheme } from "@/theme/useTheme";

interface FixcoFIconProps {
  className?: string;
}

export const FixcoFIcon = ({ className = "" }: FixcoFIconProps) => {
  const { theme } = useTheme();
  
  // Light theme = make white F black, Dark/Ocean themes = keep white F
  const filterStyle = theme === 'light' 
    ? 'brightness(0) saturate(100%)' // Makes white F black
    : 'none'; // Keep white F as is
  
  return (
    <img 
      src="/assets/fixco-icon.webp" 
      alt="Fixco Logo" 
      className={className}
      style={{ filter: filterStyle }}
    />
  );
};
