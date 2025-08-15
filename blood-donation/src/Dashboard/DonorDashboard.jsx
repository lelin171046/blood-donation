"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useAuth from "@/Hook/useAuth"
import {
  User,
  Heart,
  Calendar,
  MapPin,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Edit,
  Trash2,
  ArrowRight,
  Shield,
  UserCheck,
  HandHeart,
} from "lucide-react"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import useAxiosPublic from "@/Hook/useAxiosPublic"

const DonorDashboard = () => {
  const { user } = useAuth()
  const axiosPublic = useAxiosPublic()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState("donor")
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  const {
    data: recentRequests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["donorRequests", user?.email],
    queryFn: async () => {
      if (!user?.email) return []
      const { data } = await axiosPublic.get(`/donation/${user.email}`)
      console.log(data)
      return data || []
    },
    enabled: !!user?.email,
  })

  // Calculate stats when data changes
  useEffect(() => {
    if (recentRequests && Array.isArray(recentRequests)) {
      setStats({
        totalRequests: recentRequests.length,
        pendingRequests: recentRequests.filter((req) => req.status === "pending").length,
        inProgressRequests: recentRequests.filter((req) => req.status === "inprogress").length,
        completedRequests: recentRequests.filter((req) => req.status === "done").length,
        cancelledRequests: recentRequests.filter((req) => req.status === "canceled").length,
      })
    }
  }, [recentRequests])

  // Helper Functions
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5 text-purple-600" />
      case "volunteer":
        return <HandHeart className="h-5 w-5 text-blue-600" />
      case "donor":
        return <Heart className="h-5 w-5 text-red-600" />
      default:
        return <UserCheck className="h-5 w-5 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "volunteer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "donor":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCreateButtonText = () => {
    switch (userRole) {
      case "admin":
        return "Manage Requests"
      case "volunteer":
        return "Create Request"
      case "donor":
        return "Create Request"
      default:
        return "Create Request"
    }
  }

  const getCreateButtonAction = () => {
    switch (userRole) {
      case "admin":
        return () => navigate("/dashboard/all-blood-donation-request")
      case "volunteer":
        return () => navigate("/dashboard/create-donation-request")
      case "donor":
        return () => navigate("/dashboard/create-donation-request")
      default:
        return () => navigate("/dashboard/create-donation-request")
    }
  }

  const getViewAllButtonAction = () => {
    switch (userRole) {
      case "admin":
        return () => navigate("/dashboard/all-blood-donation-request")
      case "volunteer":
        return () => navigate("/dashboard/my-donation-requests")
      case "donor":
        return () => navigate("/dashboard/my-donation-requests")
      default:
        return () => navigate("/dashboard/my-donation-requests")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "inprogress":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "canceled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inprogress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "done":
        return "bg-green-100 text-green-800 border-green-200"
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour12 = hours % 12 || 12
    const ampm = hours >= 12 ? "PM" : "AM"
    return `${hour12}:${minutes} ${ampm}`
  }

  const handleStatusUpdate = async (requestId, newStatus) => {
    setUpdatingStatus(requestId)
    try {
      const endpoint = `/donation/${requestId}`

      await axiosPublic.patch(endpoint, {
        status: newStatus,
      })

      toast.success(`Request marked as ${newStatus}`)

      // Refetch data to update the UI
      refetch()
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update request status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return

    try {
      const endpoint = `/donation/${requestToDelete._id}`

      await axiosPublic.delete(endpoint)

      toast.success("Donation request deleted successfully")
      setShowDeleteModal(false)
      setRequestToDelete(null)

      // Refetch data to update the UI
      refetch()
    } catch (error) {
      console.error("Failed to delete request:", error)
      toast.error("Failed to delete donation request")
    }
  }

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/dashboard",
          message: "Please log in to access your dashboard",
        },
      })
      return
    }

    // Get user role from user object
    const role = user.role || "donor"
    setUserRole(role)
  }, [user, navigate])

  if (!user) {
    return null
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-8 text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-700 mb-4">Failed to load your donation requests. Please try again.</p>
              <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.displayName || user.name || user.email?.split("@")[0] || "User"}!
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(userRole)}`}
                >
                  {getRoleIcon(userRole)}
                  <span className="ml-1 capitalize">{userRole}</span>
                </span>
              </div>
              <p className="text-gray-600">
                {userRole === "admin" && "Manage all donation requests and users in the system"}
                {userRole === "volunteer" && "Create and manage donation requests to help save lives"}
                {userRole === "donor" && "Manage your donation requests and help save lives"}
              </p>
            </div>
            <Button onClick={getCreateButtonAction()} className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
              <Plus size={16} />
              {getCreateButtonText()}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgressRequests}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedRequests}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cancelledRequests}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Requests */}
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading your requests...</p>
            </CardContent>
          </Card>
        ) : recentRequests.length > 0 ? (
          <Card>
            <CardHeader className="bg-white border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Heart className="h-5 w-5 text-red-600" />
                  Recent Donation Requests
                  {userRole === "admin" && <span className="text-sm font-normal text-gray-500">(All Requests)</span>}
                  {userRole === "volunteer" && (
                    <span className="text-sm font-normal text-gray-500">(Your Created Requests)</span>
                  )}
                  {userRole === "donor" && <span className="text-sm font-normal text-gray-500">(Your Requests)</span>}
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={getViewAllButtonAction()}
                  className="flex items-center gap-2 bg-transparent"
                >
                  View All Requests
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donation Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donation Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor Information
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentRequests.slice(0, 3).map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{request.recipientName}</div>
                              <div className="text-sm text-gray-500">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {request.bloodGroup}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <div>
                              <div>{request.recipientDistrict}</div>
                              <div className="text-xs text-gray-500">{request.recipientUpazila}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(request.donationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            {formatTime(request.donationTime)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </span>

                            {/* Status Action Buttons - Only for donors and volunteers on their own requests */}
                            {request.status === "inprogress" &&
                              (userRole === "donor" || userRole === "volunteer" || userRole === "admin") && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(request._id, "done")}
                                    disabled={updatingStatus === request._id}
                                    className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
                                  >
                                    {updatingStatus === request._id ? "..." : "Done"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusUpdate(request._id, "canceled")}
                                    disabled={updatingStatus === request._id}
                                    className="text-red-600 border-red-300 hover:bg-red-50 text-xs px-2 py-1 h-6 bg-transparent"
                                  >
                                    {updatingStatus === request._id ? "..." : "Cancel"}
                                  </Button>
                                </div>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.status === "inprogress" && request.donorInfo ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">{request.donorInfo.name}</div>
                              <div className="text-gray-500">{request.donorInfo.email}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1">
                            {/* Edit button - Only for request owners or admins */}
                            {(userRole === "admin" ||
                              (userRole === "volunteer" && request.createdBy === user.uid) ||
                              (userRole === "donor" && request.requesterId === user.uid)) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/dashboard/edit-request/${request._id}`)}
                                className="bg-transparent"
                                disabled={request.status === "done" || request.status === "canceled"}
                              >
                                <Edit size={14} />
                              </Button>
                            )}

                            {/* Delete button - Only for request owners or admins */}
                            {(userRole === "admin" ||
                              (userRole === "volunteer" && request.createdBy === user.uid) ||
                              (userRole === "donor" && request.requesterId === user.uid)) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRequestToDelete(request)
                                  setShowDeleteModal(true)
                                }}
                                className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                                disabled={request.status === "inprogress"}
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}

                            {/* View button - Available for all */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/dashboard/request-details/${request._id}`)}
                              className="bg-transparent"
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Requests Button */}
              <div className="p-6 border-t bg-gray-50">
                <Button
                  onClick={getViewAllButtonAction()}
                  className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  {userRole === "admin" ? "View All Requests" : "View My All Requests"}
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // No requests state
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <Heart className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {userRole === "admin" ? "No Requests in System" : "No Donation Requests Yet"}
              </h3>
              <p className="text-blue-700 mb-4">
                {userRole === "admin" && "There are no donation requests in the system yet."}
                {userRole === "volunteer" &&
                  "You haven't created any donation requests yet. Create your first request to help someone in need."}
                {userRole === "donor" &&
                  "You haven't created any donation requests yet. Create your first request to help someone in need."}
              </p>
              <Button onClick={getCreateButtonAction()} className="bg-red-600 hover:bg-red-700">
                <Plus size={16} className="mr-2" />
                {userRole === "admin" ? "Manage System" : "Create Your First Request"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && requestToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 size={20} />
                  Delete Donation Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the donation request for{" "}
                  <strong>{requestToDelete.recipientName}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setRequestToDelete(null)
                    }}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteRequest} className="flex-1 bg-red-600 hover:bg-red-700">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default DonorDashboard
