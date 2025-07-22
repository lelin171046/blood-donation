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
  Shield,
  ShieldOff,
  UserCheck,
  Crown,
  Users,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

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

    // Check if user has admin role (you should implement this check)
    // For now, we'll assume the user is admin
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
            name: "John Doe",
            email: "john@example.com",
            photoURL: "https://via.placeholder.com/40",
            role: "donor",
            status: "active",
            createdAt: "2024-01-15T10:30:00Z",
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            photoURL: "https://via.placeholder.com/40",
            role: "volunteer",
            status: "active",
            createdAt: "2024-02-20T14:15:00Z",
          },
          {
            _id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            photoURL: "https://via.placeholder.com/40",
            role: "donor",
            status: "blocked",
            createdAt: "2024-03-10T09:45:00Z",
          },
          {
            _id: "4",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            photoURL: "https://via.placeholder.com/40",
            role: "admin",
            status: "active",
            createdAt: "2024-01-05T16:20:00Z",
          },
          {
            _id: "5",
            name: "David Brown",
            email: "david@example.com",
            photoURL: "https://via.placeholder.com/40",
            role: "donor",
            status: "active",
            createdAt: "2024-04-12T11:10:00Z",
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
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axiosPublic.patch(`/api/users/${userId}/status`, { status: newStatus })

      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))

      toast.success(`User ${newStatus === "active" ? "unblocked" : "blocked"} successfully`)
      setActiveDropdown(null)
    } catch (error) {
      console.error("Failed to update user status:", error)
      toast.error("Failed to update user status")
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosPublic.patch(`/api/users/${userId}/role`, { role: newRole })

      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))

      toast.success(`User role updated to ${newRole} successfully`)
      setActiveDropdown(null)
    } catch (error) {
      console.error("Failed to update user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "volunteer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "donor":
        return "bg-gray-100 text-gray-800 border-gray-200"
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
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{users.filter((u) => u.status === "blocked").length}</p>
                <p className="text-sm text-gray-600">Blocked Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role === "admin").length}</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
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
                              userData.photoURL ||
                              `https://ui-avatars.com/api/?name=${userData.name}&background=ef4444&color=fff`
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}
                        >
                          {userData.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(userData.status)}`}
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
                            onClick={() => setActiveDropdown(activeDropdown === userData._id ? null : userData._id)}
                            className="bg-transparent"
                          >
                            <MoreVertical size={16} />
                          </Button>

                          {activeDropdown === userData._id && (
                            <div className="absolute right-0 top-8 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                              <div className="py-1">
                                {/* Block/Unblock Actions */}
                                {userData.status === "active" ? (
                                  <button
                                    onClick={() => handleStatusChange(userData._id, "blocked")}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <ShieldOff size={16} />
                                    Block User
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleStatusChange(userData._id, "active")}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <Shield size={16} />
                                    Unblock User
                                  </button>
                                )}

                                {/* Role Change Actions */}
                                {userData.role !== "volunteer" && (
                                  <button
                                    onClick={() => handleRoleChange(userData._id, "volunteer")}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                  >
                                    <UserCheck size={16} />
                                    Make Volunteer
                                  </button>
                                )}

                                {userData.role !== "admin" && (
                                  <button
                                    onClick={() => handleRoleChange(userData._id, "admin")}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                  >
                                    <Crown size={16} />
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
