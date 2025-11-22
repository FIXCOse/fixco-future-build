import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import "./GradientButton.css";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button ref={ref} className={cn("gradient-button", className)} {...props}>
        <span className="gradient-button-text">{children}</span>
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
