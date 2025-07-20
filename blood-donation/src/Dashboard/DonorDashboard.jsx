"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useAuth from "@/Hook/useAuth"
import {
  Home,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Edit,
  Trash2,
  Eye,
  Plus,
  ArrowRight,
  Heart,
  Activity,
} from "lucide-react"
import toast from "react-hot-toast"

const DonorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recentRequests, setRecentRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)

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
  }, [user, navigate])

  // Mock donation requests data - replace with actual API call
  const mockRequests = [
    {
      id: 1,
      recipientName: "Sarah Ahmed",
      recipientDistrict: "Dhaka",
      recipientUpazila: "Dhanmondi",
      donationDate: "2024-07-25",
      donationTime: "10:00 AM",
      status: "inprogress",
      donorInfo: {
        name: "Ahmed Rahman",
        email: "ahmed.rahman@email.com",
      },
      createdAt: "2024-07-20T08:00:00Z",
      bloodGroup: "A+",
      urgency: "Critical",
    },
    {
      id: 2,
      recipientName: "Mohammad Hasan",
      recipientDistrict: "Chittagong",
      recipientUpazila: "Agrabad",
      donationDate: "2024-07-24",
      donationTime: "2:00 PM",
      status: "pending",
      donorInfo: null,
      createdAt: "2024-07-19T14:30:00Z",
      bloodGroup: "O-",
      urgency: "Urgent",
    },
    {
      id: 3,
      recipientName: "Rashida Begum",
      recipientDistrict: "Dhaka",
      recipientUpazila: "Panthapath",
      donationDate: "2024-07-26",
      donationTime: "9:00 AM",
      status: "done",
      donorInfo: {
        name: "Fatima Khatun",
        email: "fatima.khatun@email.com",
      },
      createdAt: "2024-07-21T10:15:00Z",
      bloodGroup: "B+",
      urgency: "Moderate",
    },
  ]

  useEffect(() => {
    const fetchRecentRequests = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        // const response = await axios.get(`/api/donation-requests/user/${user.uid}?limit=3`)
        // setRecentRequests(response.data.requests)

        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRecentRequests(mockRequests)
      } catch (error) {
        console.error("Failed to fetch recent requests:", error)
        toast.error("Failed to load recent donation requests")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRecentRequests()
    }
  }, [user])

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Replace with actual API call
      // await axios.patch(`/api/donation-requests/${requestId}`, { status: newStatus })

      setRecentRequests((prev) =>
        prev.map((request) => (request.id === requestId ? { ...request, status: newStatus } : request)),
      )

      toast.success(`Request marked as ${newStatus}`)
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update request status")
    }
  }

  const handleDelete = async (requestId) => {
    try {
      // Replace with actual API call
      // await axios.delete(`/api/donation-requests/${requestId}`)

      setRecentRequests((prev) => prev.filter((request) => request.id !== requestId))
      setShowDeleteModal(false)
      setRequestToDelete(null)
      toast.success("Donation request deleted successfully")
    } catch (error) {
      console.error("Failed to delete request:", error)
      toast.error("Failed to delete donation request")
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <Home size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {user.displayName || user.email}!</h1>
                  <p className="text-red-100 text-lg">
                    Thank you for being a life-saver. Your generosity makes a difference every day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{recentRequests.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentRequests.filter((r) => r.status === "done").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentRequests.filter((r) => r.status === "inprogress").length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Donation Requests */}
        {recentRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Recent Donation Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Recipient</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Date & Time</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Donor Info</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{request.recipientName}</div>
                            <div className="text-sm text-gray-500">{request.bloodGroup}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin size={14} />
                            {request.recipientUpazila}, {request.recipientDistrict}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(request.donationDate)}</div>
                            <div className="text-gray-500">{request.donationTime}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}
                            >
                              {request.status}
                            </span>
                            {request.status === "inprogress" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(request.id, "done")}
                                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
                                >
                                  Done
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(request.id, "canceled")}
                                  className="text-red-600 border-red-300 hover:bg-red-50 text-xs px-2 py-1 h-6 bg-transparent"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {request.status === "inprogress" && request.donorInfo ? (
                            <div className="text-sm">
                              <div className="font-medium flex items-center gap-1">
                                <User size={12} />
                                {request.donorInfo.name}
                              </div>
                              <div className="text-gray-500 flex items-center gap-1">
                                <Mail size={12} />
                                {request.donorInfo.email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No donor assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/dashboard/edit-request/${request.id}`)}
                              className="bg-transparent"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRequestToDelete(request)
                                setShowDeleteModal(true)
                              }}
                              className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                            >
                              <Trash2 size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/dashboard/request-details/${request.id}`)}
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
                  onClick={() => navigate("/dashboard/my-donation-requests")}
                  className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  View My All Requests
                  <ArrowRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate("/create-request")}
                className="bg-red-600 hover:bg-red-700 flex items-center gap-2 p-6 h-auto"
              >
                <Plus size={20} />
                <div className="text-left">
                  <div className="font-medium">Create New Request</div>
                  <div className="text-sm opacity-90">Request blood donation</div>
                </div>
              </Button>
              <Button
                onClick={() => navigate("/dashboard/my-donation-requests")}
                variant="outline"
                className="flex items-center gap-2 p-6 h-auto bg-transparent"
              >
                <Activity size={20} />
                <div className="text-left">
                  <div className="font-medium">My All Requests</div>
                  <div className="text-sm text-gray-500">View and manage requests</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  <Button
                    onClick={() => handleDelete(requestToDelete.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
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
