
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Button } from "./button"

// Define custom button variants
const customButtonVariants = cva(
  "font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Custom variants for different pages
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        info: "bg-blue-600 text-white hover:bg-blue-700",
        purple: "bg-purple-600 text-white hover:bg-purple-700",
        pink: "bg-pink-600 text-white hover:bg-pink-700",
        orange: "bg-orange-600 text-white hover:bg-orange-700",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const CustomButton = ({ className, variant, size, ...props }) => {
  return <Button className={cn(customButtonVariants({ variant, size, className }))} {...props} />
}

export default CustomButton
