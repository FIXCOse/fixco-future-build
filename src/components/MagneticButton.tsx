import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  href?: string;
  magneticStrength?: number;
}

const MagneticButton = ({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  onClick,
  href,
  magneticStrength = 20
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const buttonElement = (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn(className)}
    >
      <span className="relative z-10">
        {children}
      </span>
    </Button>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonElement}
      </a>
    );
  }

  return buttonElement;
};

export default MagneticButton;