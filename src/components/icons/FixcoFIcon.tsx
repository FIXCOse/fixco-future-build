import { useTheme } from "@/theme/useTheme";

interface FixcoFIconProps {
  className?: string;
}

export const FixcoFIcon = ({ className = "" }: FixcoFIconProps) => {
  const { theme } = useTheme();
  
  // Light theme = black icon, Dark/Ocean themes = white icon
  const filterStyle = theme === 'light' 
    ? 'brightness(0) saturate(100%)' // Makes it black
    : 'brightness(0) invert(1)'; // Makes it white
  
  return (
    <img 
      src="/assets/fixco-f-icon-black.png" 
      alt="Fixco Logo" 
      className={className}
      style={{ filter: filterStyle }}
    />
  );
};
