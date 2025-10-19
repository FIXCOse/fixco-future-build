import fixcoAnimatedIcon from "@/assets/fixco-animated-icon.svg";

interface FixcoFIconProps {
  className?: string;
}

export const FixcoFIcon = ({ className = "" }: FixcoFIconProps) => {
  return (
    <img
      src={fixcoAnimatedIcon}
      alt="Fixco Logo"
      className={className}
    />
  );
};
