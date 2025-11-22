import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import "./GradientButton.css";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, href, ...props }, ref) => {
    const buttonElement = (
      <button ref={ref} className={cn("gradient-button", className)} {...props}>
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
