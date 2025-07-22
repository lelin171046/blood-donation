"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NavLink, Outlet } from "react-router-dom"
import useAuth from "@/Hook/useAuth"
import useAdmin from "@/Hook/useAdmin"
import {
  Home,
  AudioWaveform,
  Package,
  Magnet,
  Users,
  Menu,
  ShoppingCart,
  DollarSign,
  Calendar,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react"

const DashboardPage = () => {
  const { user, logOut, loading } = useAuth()
  const navigate = useNavigate()
  const [isAdmin] = useAdmin()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((error) => console.error(error.message))
    navigate("/")
  }

  return (
    <div className="h-full flex p-3 space-y-2 w-60 dark:text-gray-800">
      {loading ? (
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-sm font-medium">Loading dashboard...</p>
        </div>
      ) : (
        <div className="divide-y min-h-full dark:divide-gray-300 bg-orange-400">
          <div className="flex items-center p-2 space-x-4">
            <img
              src="https://scontent.fdac147-1.fna.fbcdn.net/v/t39.30808-6/486261248_2476058512747393_5795953151229695811_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeH9m6FBRFjNzYaW1KCPGEQQfJN7EITOept8k3sQhM56mxGKK5zwlTTCW2kMj1u3yTBICJhhWKU2g4B6RpN6SC5H&_nc_ohc=7qEjrsZ7rgYQ7kNvwFWGajY&_nc_oc=AdlbAgzMWS-xpH4uR9HtLV7LqHE8yq9yliRWGiRMx5sTef6QKJaavL8xJmfBjuYEoqo&_nc_zt=23&_nc_ht=scontent.fdac147-1.fna&_nc_gid=_NT6JAmohiXHqIgC-GS4ng&oh=00_AfPiGeE_jBabO5853gyenqz0du72tRu9-5ALdfvlw77MXQ&oe=6865494A"
              alt=""
              className="w-12 h-12 rounded-full dark:bg-gray-500"
            />
            <div>
              <h2 className="text-lg font-semibold">{user?.displayName}</h2>
              <span className="flex items-center space-x-1">
                <a rel="noopener noreferrer" href="#" className="text-xs hover:underline dark:text-gray-600">
                  View profile
                </a>
              </span>
            </div>
          </div>

          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {isAdmin ? (
              <>
                <li className="dark:bg-gray-100 dark:text-gray-900">
                  <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                    <LayoutDashboard className="w-5 h-5 text-gray-600" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <NavLink to={"/dashboard/admin-home"} className="flex items-center p-2 space-x-3 rounded-md">
                    <Home className="w-5 h-5 text-gray-600" />
                    <span>Admin Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/addItem"} className="flex items-center p-2 space-x-3 rounded-md">
                    <AudioWaveform className="w-5 h-5 text-gray-600" />
                    <span>Add Item</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/manageItem"} className="flex items-center p-2 space-x-3 rounded-md">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span>Manage Item</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/bookings"} className="flex items-center p-2 space-x-3 rounded-md">
                    <Magnet className="w-5 h-5 text-gray-600" />
                    <span>Manage Booking</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/dashboard/all-users"} className="flex items-center p-2 space-x-3 rounded-md">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span>All Users</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>

          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <NavLink to={"/dashboard/user-home"} className="flex items-center p-2 space-x-3 rounded-md">
              <Home className="w-5 h-5 text-gray-600" />
              <span>User Home</span>
            </NavLink>
            <ol>
              <li>
                <NavLink to={"/order/salad"} className="flex items-center p-2 space-x-3 rounded-md">
                  <Menu className="w-5 h-5 text-gray-600" />
                  <span>Menu</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard/cart"} className="flex items-center p-2 space-x-3 rounded-md">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <span>My Cart</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard/payment-history"} className="flex items-center p-2 space-x-3 rounded-md">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span>Payment History</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={"/dashboard/reservation"} className="flex items-center p-2 space-x-3 rounded-md">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Reservation</span>
                </NavLink>
              </li>
              <button onClick={handleLogOut}>
                <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span>Logout</span>
                </a>
              </button>
            </ol>
          </ul>
        </div>
      )}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardPage
