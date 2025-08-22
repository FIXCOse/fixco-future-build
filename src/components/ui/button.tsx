import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "gradient-primary text-primary-foreground shadow-premium hover:shadow-glow rounded-xl font-semibold gap-[10px] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:translate-x-1",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 rounded-md text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        outline:
          "border-2 border-primary/30 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 rounded-xl font-semibold gap-[10px] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:translate-x-1",
        secondary:
          "border-2 border-primary/30 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 rounded-xl font-semibold gap-[10px] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:translate-x-1",
        ghost: "hover:bg-accent hover:text-accent-foreground gap-2 rounded-md text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        link: "text-primary underline-offset-4 hover:underline gap-2 rounded-md text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        // Legacy CTA variants (keeping for backward compatibility)
        "cta-primary": "gradient-primary text-primary-foreground shadow-premium hover:shadow-glow rounded-xl font-semibold gap-[10px] [&_svg]:size-4 md:[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:translate-x-1",
        "cta-secondary": "border-2 border-primary/30 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 rounded-xl font-semibold gap-[10px] [&_svg]:size-4 md:[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:translate-x-1",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        // CTA sizes (keeping for backward compatibility)
        "cta": "h-11 md:h-11 px-5 md:px-6 text-sm md:text-sm",
        "cta-mobile": "h-10 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
