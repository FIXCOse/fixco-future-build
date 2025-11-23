import { ButtonHTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import "./GradientButton.css";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, href, onClick, ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as any) || internalRef;

    // GSAP Hover scale effect
    useEffect(() => {
      if (!buttonRef.current) return;
      
      const button = buttonRef.current;
      
      const onMouseEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      };
      
      const onMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };
      
      button.addEventListener('mouseenter', onMouseEnter);
      button.addEventListener('mouseleave', onMouseLeave);
      
      return () => {
        button.removeEventListener('mouseenter', onMouseEnter);
        button.removeEventListener('mouseleave', onMouseLeave);
      };
    }, [buttonRef]);

    // GSAP Click ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('div');
      ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.transform = 'translate(-50%, -50%)';
      
      button.appendChild(ripple);
      
      gsap.to(ripple, {
        width: 300,
        height: 300,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
      
      if (onClick) onClick();
    };

    const buttonElement = (
      <button ref={buttonRef} className={cn("gradient-button", className)} onClick={handleClick} {...props}>
        <span className="gradient-button-text">{children}</span>
      </button>
    );

    if (href) {
      return (
        <a href={href} className="inline-block">
          {buttonElement}
        </a>
      );
    }

    return buttonElement;
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
