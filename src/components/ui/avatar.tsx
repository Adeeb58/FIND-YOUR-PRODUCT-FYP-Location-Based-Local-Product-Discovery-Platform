import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const avatarVariants = cva(
    "relative flex shrink-0 overflow-hidden rounded-full",
    {
        variants: {
            size: {
                xs: "h-6 w-6 text-[10px]",
                sm: "h-8 w-8 text-xs",
                md: "h-10 w-10 text-sm",
                lg: "h-12 w-12 text-base",
                xl: "h-16 w-16 text-lg",
                "2xl": "h-24 w-24 text-2xl",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
)

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
    />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

interface AvatarWithStatusProps
    extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
    status?: "online" | "offline" | "busy" | "away"
    src?: string
    alt?: string
    fallback?: string
}

const AvatarWithStatus = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    AvatarWithStatusProps
>(({ className, size, status, src, alt, fallback, children, ...props }, ref) => {
    const statusColors = {
        online: "bg-green-500",
        offline: "bg-gray-400",
        busy: "bg-red-500",
        away: "bg-amber-500",
    }

    const statusSizes = {
        xs: "h-1.5 w-1.5 border",
        sm: "h-2 w-2 border",
        md: "h-2.5 w-2.5 border-2",
        lg: "h-3 w-3 border-2",
        xl: "h-4 w-4 border-2",
        "2xl": "h-5 w-5 border-2",
    }

    return (
        <div className="relative inline-block">
            <Avatar ref={ref} size={size} className={className} {...props}>
                {src && <AvatarImage src={src} alt={alt || "Avatar"} />}
                {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
                {children}
            </Avatar>
            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 rounded-full border-background",
                        statusColors[status],
                        statusSizes[size || "md"],
                        status === "online" && "animate-pulse"
                    )}
                />
            )}
        </div>
    )
})
AvatarWithStatus.displayName = "AvatarWithStatus"

export { Avatar, AvatarImage, AvatarFallback, AvatarWithStatus, avatarVariants }
