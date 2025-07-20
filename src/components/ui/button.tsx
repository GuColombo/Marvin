import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-callout font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-medium hover:-translate-y-0.5 hover:shadow-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        outline:
          "border border-border bg-background-elevated/50 backdrop-blur-sm hover:bg-accent-hover hover:text-accent-foreground shadow-subtle hover:shadow-soft hover:border-border-subtle",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-subtle hover:shadow-soft hover:-translate-y-0.5",
        ghost: "hover:bg-accent-hover hover:text-accent-foreground transition-smooth",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        glass: "bg-background-glass/60 backdrop-blur-xl border border-border-subtle text-foreground hover:bg-background-glass/80 shadow-glass hover:shadow-soft",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-caption-1",
        lg: "h-14 rounded-xl px-10 text-body font-semibold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-xl",
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
