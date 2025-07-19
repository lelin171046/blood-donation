import { cn } from "@/lib/utils"
import { Button } from "./button"


const DashboardButton = ({ children, variant = "primary", className, ...props }) => {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <Button
      className={cn(variants[variant], "font-medium rounded-md transition-colors duration-150", className)}
      variant="ghost"
      {...props}
    >
      {children}
    </Button>
  )
}

export default DashboardButton
