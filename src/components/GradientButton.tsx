import { ButtonHTMLAttributes, forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import "./GradientButton.css";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, href, onClick, ...props }, ref) => {
    const buttonElement = (
      <button ref={ref} className={cn("gradient-button", className)} onClick={onClick} {...props}>
        <span className="gradient-button-text">{children}</span>
      </button>
    );

    if (href) {
      const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
      
      if (isExternal) {
        return (
          <a href={href} className="inline-block">
            {buttonElement}
          </a>
        );
      }
      
      return (
        <Link to={href} className="inline-block">
          {buttonElement}
        </Link>
      );
    }

    return buttonElement;
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
