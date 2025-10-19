import fixcoAnimatedIcon from "@/assets/fixco-animated-icon.svg";

interface AnimatedFixcoFIconProps {
  className?: string;
}

export const AnimatedFixcoFIcon = ({ className = "" }: AnimatedFixcoFIconProps) => {
  return (
    <img
      src={fixcoAnimatedIcon}
      alt="Fixco Logo"
      className={className}
    />
  );
};
