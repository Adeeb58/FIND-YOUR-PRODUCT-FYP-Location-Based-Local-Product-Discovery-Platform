import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
                outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
                success:
                    "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm dark:bg-green-600 dark:hover:bg-green-700",
                warning:
                    "border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-sm dark:bg-amber-600 dark:hover:bg-amber-700",
                error:
                    "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-sm dark:bg-red-600 dark:hover:bg-red-700",
                info:
                    "border-transparent bg-sky-500 text-white hover:bg-sky-600 shadow-sm dark:bg-sky-600 dark:hover:bg-sky-700",
                ghost: "hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-0.5 text-[10px]",
                lg: "px-3 py-1 text-sm",
            },
            shape: {
                pill: "rounded-full",
                square: "rounded-md",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "pill",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean
}

function Badge({ className, variant, size, shape, dot, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props}>
            {dot && (
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            )}
            {children}
        </div>
    )
}

export { Badge, badgeVariants }
