import { useTheme } from "@/theme/useTheme";

interface FixcoFIconProps {
  className?: string;
}

export const FixcoFIcon = ({ className = "" }: FixcoFIconProps) => {
  const { theme } = useTheme();
  
  // Light theme = black F, Dark/Ocean themes = white F
  const fillColor = theme === 'light' ? 'currentColor' : 'currentColor';
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 20h60v15H35v10h35v15H35v20H20V20z" />
    </svg>
  );
};
