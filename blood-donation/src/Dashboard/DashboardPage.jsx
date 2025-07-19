import CustomButton from "@/components/ui/custom-button"
import DashboardButton from "@/components/ui/Dashboard-Button"
import FlexibleButton from "@/components/ui/flexible-button"


const DashboardPage = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Page</h1>

      {/* Different styling for dashboard */}
      <div className="space-x-4">
        <CustomButton variant="success">Create New</CustomButton>
        <CustomButton variant="warning">Edit</CustomButton>
        <CustomButton variant="destructive">Delete</CustomButton>
      </div>

      {/* Custom dashboard colors */}
      <div className="space-x-4">
        <FlexibleButton bgColor="bg-emerald-600" textColor="text-white" hoverBgColor="hover:bg-emerald-700">
          Save Changes
        </FlexibleButton>

        <FlexibleButton bgColor="bg-slate-600" textColor="text-white" hoverBgColor="hover:bg-slate-700">
          Cancel
        </FlexibleButton>
      </div>

      {/* Page-specific dashboard buttons */}
      <div className="space-x-4">
        <DashboardButton variant="primary">Dashboard Primary</DashboardButton>
        <DashboardButton variant="secondary">Dashboard Secondary</DashboardButton>
        <DashboardButton variant="danger">Dashboard Danger</DashboardButton>
      </div>
    </div>
  )
}

export default DashboardPage
