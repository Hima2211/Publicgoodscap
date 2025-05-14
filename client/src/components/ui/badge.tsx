import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/20 text-primary hover:bg-primary/30",
        defi:
          "bg-secondary/20 text-secondary hover:bg-secondary/30",
        nft:
          "bg-accent/20 text-accent hover:bg-accent/30",
        dao:
          "bg-warning/20 text-warning hover:bg-warning/30",
        infrastructure:
          "bg-primary/20 text-primary hover:bg-primary/30",
        public_goods:
          "bg-success/20 text-success hover:bg-success/30",
        social:
          "bg-primary/20 text-primary hover:bg-primary/30",
        success:
          "bg-success/20 text-success hover:bg-success/30",
        warning:
          "bg-warning/20 text-warning hover:bg-warning/30",
        destructive:
          "bg-destructive/20 text-destructive hover:bg-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
