"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuth from "@/Hook/useAuth"
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  UserCheck,
  Crown,
  Users,
  Ban,
  CheckCircle,
} from "lucide-react"
import toast from "react-hot-toast"
import useAxiosPublic from "@/Hook/useAxiosPublic"

const AllUsersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const axiosPublic = useAxiosPublic()

  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/dashboard/all-users",
          message: "Please log in to access admin panel",
        },
      })
      return
    }
  }, [user, navigate])

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await axiosPublic.get("/api/users")
        setUsers(response.data.users || [])
        setFilteredUsers(response.data.users || [])
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast.error("Failed to load users data")
        // Mock data for development
        const mockUsers = [
          {
            _id: "1",
            name: "Ahmed Rahman",
            email: "ahmed.rahman@email.com",
            role: "donor",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            createdAt: "2024-01-15T10:30:00Z",
          },
          {
            _id: "2",
            name: "Fatima Khatun",
            email: "fatima.khatun@email.com",
            role: "volunteer",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
            createdAt: "2024-02-20T14:15:00Z",
          },
          {
            _id: "3",
            name: "Mohammad Hasan",
            email: "mohammad.hasan@email.com",
            role: "donor",
            status: "blocked",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            createdAt: "2024-03-10T09:45:00Z",
          },
          {
            _id: "4",
            name: "Rashida Begum",
            email: "rashida.begum@email.com",
            role: "admin",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            createdAt: "2024-01-25T16:20:00Z",
          },
          {
            _id: "5",
            name: "Abdul Karim",
            email: "abdul.karim@email.com",
            role: "donor",
            status: "active",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            createdAt: "2024-04-05T11:30:00Z",
          },
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter and search functionality
  useEffect(() => {
    let filtered = users

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [searchQuery, statusFilter, users])

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // User management functions
  const handleBlockUser = async (userId) => {
    try {
      await axiosPublic.patch(`/api/users/${userId}/block`)

      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, status: "blocked" } : user)))

      toast.success("User blocked successfully")
      setActiveDropdown(null)
    } catch (error) {
      console.error("Failed to block user:", error)
      toast.error("Failed to block user")
    }
  }

  const handleUnblockUser = async (userId) => {
    try {
      await axiosPublic.patch(`/api/users/${userId}/unblock`)

      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, status: "active" } : user)))

      toast.success("User unblocked successfully")
      setActiveDropdown(null)
    } catch (error) {
      console.error("Failed to unblock user:", error)
      toast.error("Failed to unblock user")
    }
  }

  const handleMakeVolunteer = async (userId) => {
    try {
      await axiosPublic.patch(`/api/users/${userId}/role`, { role: "volunteer" })

      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: "volunteer" } : user)))

      toast.success("User promoted to volunteer")
      setActiveDropdown(null)
    } catch (error) {
      console.error("Failed to make volunteer:", error)
      toast.error("Failed to make volunteer")
    }
  }

  const handleMakeAdmin = async (userId) => {
    try {
      await axiosPublic.patch(`/api/users/${userId}/role`, { role: "admin" })

      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: "admin" } : user)))

      toast.success("User promoted to admin")
      setActiveDropdown(null)
    } catch (error) {
      console.error("Failed to make admin:", error)
      toast.error("Failed to make admin")
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "volunteer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "donor":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Users</h1>
          <p className="text-gray-600">Manage all registered users in the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{users.length}</div>
              <div className="text-gray-600 text-sm">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {users.filter((u) => u.status === "active").length}
              </div>
              <div className="text-gray-600 text-sm">Active Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {users.filter((u) => u.status === "blocked").length}
              </div>
              <div className="text-gray-600 text-sm">Blocked Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {users.filter((u) => u.role === "admin").length}
              </div>
              <div className="text-gray-600 text-sm">Admins</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Status Filter */}
              <div className="flex items-center gap-3">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Users Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((userData) => (
                    <tr key={userData._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              userData.avatar ||
                              `https://ui-avatars.com/api/?name=${userData.name || "User"}&background=ef4444&color=fff`
                            }
                            alt={userData.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{userData.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{userData.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(userData.role)}`}
                        >
                          {userData.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(userData.status)}`}
                        >
                          {userData.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">{formatDate(userData.createdAt)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveDropdown(activeDropdown === userData._id ? null : userData._id)
                            }}
                            className="bg-transparent"
                          >
                            <MoreVertical size={16} />
                          </Button>

                          {activeDropdown === userData._id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-48">
                              <div className="py-1">
                                {userData.status === "active" ? (
                                  <button
                                    onClick={() => handleBlockUser(userData._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Ban size={14} />
                                    Block User
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUnblockUser(userData._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <CheckCircle size={14} />
                                    Unblock User
                                  </button>
                                )}

                                {userData.role === "donor" && (
                                  <button
                                    onClick={() => handleMakeVolunteer(userData._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                  >
                                    <UserCheck size={14} />
                                    Make Volunteer
                                  </button>
                                )}

                                {(userData.role === "donor" || userData.role === "volunteer") && (
                                  <button
                                    onClick={() => handleMakeAdmin(userData._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                  >
                                    <Crown size={14} />
                                    Make Admin
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Click outside to close dropdown */}
        {activeDropdown && <div className="fixed inset-0 z-5" onClick={() => setActiveDropdown(null)} />}
      </div>
    </div>
  )
}

export default AllUsersPage
