"use client"

import { useState, useEffect } from "react"
import { useNavigate, NavLink, Outlet } from "react-router-dom"
import useAuth from "@/Hook/useAuth"
import useAdmin from "@/Hook/useAdmin"
import useVolunteer from "@/Hook/useVolunteer"
import {
  Home,
  AudioWaveform,
  Package,
  Magnet,
  Users,
  Menu as MenuIcon,
  ShoppingCart,
  Calendar,
  LogOut,
  Loader2,
  X,
} from "lucide-react"

const DashboardPage = () => {
  const { user, logOut, loading } = useAuth()
  const navigate = useNavigate()
  const [isAdmin] = useAdmin()
  const [isVolunteer] = useVolunteer()
  const isDonor = !isAdmin && !isVolunteer // if not admin or volunteer, treat as donor
console.log(isAdmin, 'ok');
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogOut = () => {
    logOut()
      .then(() => navigate("/"))
      .catch((error) => console.error(error.message))
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-orange-400 p-4">
        <div className="flex items-center space-x-2">
          <img src={user?.photoURL} alt="" className="w-8 h-8 rounded-full" />
          <span className="text-white font-medium">{user?.displayName}</span>
        </div>
        <button onClick={toggleSidebar}>
          {sidebarOpen ? <X className="text-white" /> : <MenuIcon className="text-white" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-60 bg-orange-400 dark:text-gray-800 p-4 space-y-4 md:min-h-screen transition-all duration-300`}
      >
        {loading || isLoading ? (
          <div className="w-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <p className="text-sm font-medium">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Profile */}
            <div className="flex items-center space-x-4">
              <img src={user?.photoURL} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="text-lg font-semibold">{user?.displayName}</h2>
                <span className="text-xs dark:text-gray-600">{user?.email}</span>
              </div>
            </div>

            {/* Nav Items */}
            <ul className="pt-2 space-y-1 text-sm">
              {/* Admin Menu */}
              {isAdmin && (
                <>
                  <li>
                    <NavLink to="/dashboard/dashboard-home" className="flex items-center p-2 space-x-3 rounded-md">
                      <Home className="w-5 h-5 text-gray-600" />
                      <span>Admin Home</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/content-manage/add-blog" className="flex items-center p-2 space-x-3 rounded-md">
                      <AudioWaveform className="w-5 h-5 text-gray-600" />
                      <span>Add Blog Content</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/manage-content" className="flex items-center p-2 space-x-3 rounded-md">
                      <Package className="w-5 h-5 text-gray-600" />
                      <span>Manage Content</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/all-blood-donation-request" className="flex items-center p-2 space-x-3 rounded-md">
                      <Magnet className="w-5 h-5 text-gray-600" />
                      <span>All Donation Request</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/all-users" className="flex items-center p-2 space-x-3 rounded-md">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span>All Users</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Volunteer Menu */}
              {isVolunteer && !isAdmin && (
                <>
                  <li>
                    <NavLink to="/dashboard/create-request" className="flex items-center p-2 space-x-3 rounded-md">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span>Create Request</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/content-manage/add-blog" className="flex items-center p-2 space-x-3 rounded-md">
                      <AudioWaveform className="w-5 h-5 text-gray-600" />
                      <span>Post Blog</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/manage-content" className="flex items-center p-2 space-x-3 rounded-md">
                      <Package className="w-5 h-5 text-gray-600" />
                      <span>Manage Blog</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Donor Menu */}
              {isDonor && (
                <>
                  <li>
                    <NavLink to="/dashboard/donor-dashboard" className="flex items-center p-2 space-x-3 rounded-md">
                      <Home className="w-5 h-5 text-gray-600" />
                      <span>Donor Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/my-donation-requests" className="flex items-center p-2 space-x-3 rounded-md">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                      <span>My Requests</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Logout */}
              <li>
                <button onClick={handleLogOut} className="flex items-center w-full p-2 space-x-3 rounded-md">
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardPage
