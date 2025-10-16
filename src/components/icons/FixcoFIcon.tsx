interface FixcoFIconProps {
  className?: string;
}

export const FixcoFIcon = ({ className = "" }: FixcoFIconProps) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fixco Logo"
    >
      <path d="M25 15 H80 V30 H40 V42 H72 V57 H40 V85 H25 Z" />
    </svg>
  );
};
