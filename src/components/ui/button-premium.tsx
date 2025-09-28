import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-card hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
        ghost: "text-foreground hover:bg-muted/60",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground font-bold shadow-glow hover:shadow-premium hover:scale-105",
        premium: "bg-card border border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40 hover:shadow-premium",
        cta: "bg-primary text-primary-foreground font-bold shadow-premium hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300",
        "cta-primary": "bg-primary text-primary-foreground font-bold shadow-premium hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300",
        "cta-secondary": "bg-secondary text-secondary-foreground border border-border hover:bg-muted hover:scale-[1.02] transition-all duration-300",
        "ghost-premium": "text-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        cta: "h-12 px-8 py-3 text-base rounded-xl",
        icon: "h-10 w-10",
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