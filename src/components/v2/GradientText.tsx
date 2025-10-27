import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: "default" | "blue" | "purple" | "rainbow";
}

const gradients = {
  default: "bg-gradient-to-r from-[hsl(262,83%,58%)] to-[hsl(200,100%,50%)]",
  blue: "bg-gradient-to-r from-[hsl(200,100%,50%)] to-[hsl(220,100%,60%)]",
  purple: "bg-gradient-to-r from-[hsl(280,100%,60%)] to-[hsl(320,100%,65%)]",
  rainbow: "bg-gradient-to-r from-[hsl(262,83%,58%)] via-[hsl(200,100%,50%)] to-[hsl(320,100%,65%)]"
};

export const GradientText = ({ 
  children, 
  className = "", 
  gradient = "default" 
}: GradientTextProps) => {
  return (
    <span 
      className={cn(
        "bg-clip-text text-transparent animate-fade-in",
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  );
};
