
import { cn } from "@/lib/utils"
import { Button } from "./button"

const FlexibleButton = ({
  children,
  bgColor = "bg-blue-600",
  textColor = "text-white",
  hoverBgColor = "hover:bg-blue-700",
  hoverTextColor = "hover:text-white",
  size = "default",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  }

  return (
    <Button
      className={cn(
        bgColor,
        textColor,
        hoverBgColor,
        hoverTextColor,
        sizeClasses[size],
        "transition-colors duration-200",
        className,
      )}
      variant="ghost" // Use ghost to remove default styling
      {...props}
    >
      {children}
    </Button>
  )
}

export default FlexibleButton
