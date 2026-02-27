import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] active:shadow-inner disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-2 ring-offset-canvas",
  {
    variants: {
      variant: {
        default: "bg-ink-primary text-canvas hover:bg-ink-primary/90 shadow-lg shadow-ink-primary/10",
        destructive:
          "bg-expense text-white hover:bg-expense/90 shadow-lg shadow-expense/10",
        outline:
          "border border-border-strong bg-white/5 backdrop-blur-md shadow-sm hover:bg-surface-2 hover:text-ink-primary hover:border-growth/30",
        secondary:
          "bg-surface-3 text-ink-primary hover:bg-surface-3/80 shadow-sm",
        ghost:
          "text-ink-secondary hover:bg-surface-2/50 hover:text-ink-primary hover:backdrop-blur-sm",
        link: "text-ink-primary underline-offset-4 hover:underline",
        growth: "bg-gradient-to-br from-growth to-[#2d7a60] text-white hover:shadow-xl hover:shadow-growth/20 shadow-lg shadow-growth/10 transition-all",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-2xl px-8 text-base font-display has-[>svg]:px-6",
        icon: "size-10 rounded-full",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
