import { useRef, useState, useEffect } from 'react';
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
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 100; // Maximum distance for magnetic effect
      
      if (distance < maxDistance) {
        const strength = Math.max(0, 1 - distance / maxDistance);
        setTransform({
          x: deltaX * strength * 0.3,
          y: deltaY * strength * 0.3
        });
      } else {
        setTransform({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTransform({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);
      button.addEventListener('mouseenter', handleMouseEnter);
      
      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
        button.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, [isHovered]);

  const buttonElement = (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out",
        isHovered && "shadow-glow scale-105",
        className
      )}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'all 0.3s ease-out'
      }}
    >
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Animated background gradient */}
      <div 
        className={cn(
          "absolute inset-0 gradient-primary opacity-0 transition-opacity duration-300",
          isHovered && variant === "outline" && "opacity-10"
        )}
      />
      
      {/* Ripple effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 rounded-md transition-all duration-300",
          isHovered && "bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-shift"
        )}
      />
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