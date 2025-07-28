"use client"
import { useState, useEffect, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuth from "@/Hook/useAuth"
import useAdmin from "@/Hook/useAdmin"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
  Shield,
} from "lucide-react"
import toast from "react-hot-toast"
import useAxiosPublic from "@/Hook/useAxiosPublic"
import useAxiosSecure from "@/Hook/useAxiosSecure"
import Swal from "sweetalert2"

const AllBloodDonationRequestPage = () => {
  const { user } = useAuth()
  const [isAdmin] = useAdmin()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Check authentication and admin access
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/dashboard/all-blood-donation-request",
          message: "Please log in to access admin panel",
        },
      })
      return
    }

    if (!isAdmin) {
      navigate("/dashboard", {
        state: {
          message: "Admin access required for this page",
        },
      })
      return
    }
  }, [user, isAdmin, navigate])

  // Fetch all donation requests using TanStack Query
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["all-donation-requests"],
    queryFn: async () => {
      const response = await axiosSecure.get("/api/donation-requests/all")
      // Ensure we always return an array
      return response.data
    },
    enabled: !!user && !!isAdmin, // Only run query when user is admin
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("Failed to fetch requests:", error)
      toast.error("Failed to load donation requests")
    },
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, newStatus }) => {
      const response = await axiosSecure.patch(`/api/donation-requests/${requestId}`, {
        status: newStatus,
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      // Update the cache optimistically
      queryClient.setQueryData(["all-donation-requests"], (oldData) => {
        if (!Array.isArray(oldData)) return []
        return oldData.map((request) =>
          request._id === variables.requestId ? { ...request, status: variables.newStatus } : request,
        )
      })
      toast.success(`Request marked as ${variables.newStatus}`)
    },
    onError: (error) => {
      console.error("Failed to update status:", error)
      toast.error("Failed to update request status")
    },
  })

    // Delete request mutation
  const handleDelete = request => {
     Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
  console.log(request._id);
  
          axiosSecure.delete(`/api/my-donation-requests/${request._id}`)
            .then(res => {
              if (res.data.deletedCount > 0) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success"
                });
                refetch()
              }
            })
        }
      });
  }

  // Filter and search functionality using useMemo for performance
  const filteredRequests = useMemo(() => {
    let filtered = Array.isArray(requests) ? requests : []

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.recipientName?.toLowerCase().includes(query) ||
          request.recipientDistrict?.toLowerCase().includes(query) ||
          request.recipientUpazila?.toLowerCase().includes(query) ||
          request.bloodGroup?.toLowerCase().includes(query) ||
          request.hospitalName?.toLowerCase().includes(query) ||
          request.requesterName?.toLowerCase().includes(query) ||
          request.requesterEmail?.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [requests, statusFilter, searchQuery])

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  // Pagination logic
  const totalPages = Math.ceil((filteredRequests?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  // Handler functions
  const handleStatusChange = (requestId, newStatus) => {
    updateStatusMutation.mutate({ requestId, newStatus })
  }



  const handleRefresh = () => {
    refetch()
  }

  // Utility functions
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

  const formatTime = (timeString) => {
    if (!timeString) return ""
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(":")
    const hour12 = hours % 12 || 12
    const ampm = hours >= 12 ? "PM" : "AM"
    return `${hour12}:${minutes} ${ampm}`
  }

  // Calculate urgency based on donation date
  const calculateUrgency = (donationDate) => {
    const today = new Date()
    const donation = new Date(donationDate)
    const diffTime = donation - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return "Critical"
    if (diffDays <= 3) return "Urgent"
    return "Moderate"
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical":
        return "text-red-600 font-semibold"
      case "Urgent":
        return "text-orange-600 font-medium"
      default:
        return "text-green-600"
    }
  }

  // Early returns
  if (!user || !isAdmin) {
    return null
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Calendar className="mx-auto h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Requests</h2>
            <p className="text-gray-600 mb-4">
              {error?.message || "Something went wrong while loading donation requests."}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
              <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all donation requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Shield size={16} />
                <span className="text-sm font-medium">Admin Panel</span>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Blood Donation Requests</h1>
          <p className="text-gray-600">Manage all blood donation requests from all users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {requests.filter((r) => r.status === "inprogress").length}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter((r) => r.status === "done").length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
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
                  placeholder="Search by recipient, requester, location, or blood group..."
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
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length}{" "}
              requests
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              All Donation Requests
              {isFetching && <RefreshCw size={16} className="animate-spin text-gray-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {currentRequests.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donation requests found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No donation requests have been created yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Requester</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Recipient</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Date & Time</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Hospital</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{request.requesterName || "Unknown"}</div>
                              <div className="text-sm text-gray-500">{request.requesterEmail || "No email"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{request.recipientName}</div>
                            <div className="text-sm text-gray-500">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                                {request.bloodGroup}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin size={14} />
                            {request.recipientUpazila}, {request.recipientDistrict}
                          </div>
                          <div className="text-xs text-gray-500">{request.recipientDivision} Division</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-medium">{formatDate(request.donationDate)}</div>
                            <div className="text-gray-500">{formatTime(request.donationTime)}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}
                            >
                              {request.status}
                            </span>
                            <div className={`text-xs ${getUrgencyColor(calculateUrgency(request.donationDate))}`}>
                              {calculateUrgency(request.donationDate)}
                            </div>
                            {request.status === "pending" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(request._id, "in progress")}
                                  disabled={updateStatusMutation.isLoading}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-6"
                                >
                                  {updateStatusMutation.isLoading ? "..." : "Mark In Progress"}
                                </Button>
                              </div>
                            )}
                            {request.status === "inprogress" && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(request._id, "done")}
                                  disabled={updateStatusMutation.isLoading}
                                  className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
                                >
                                  {updateStatusMutation.isLoading ? "..." : "Done"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(request._id, "canceled")}
                                  disabled={updateStatusMutation.isLoading}
                                  className="text-red-600 border-red-300 hover:bg-red-50 text-xs px-2 py-1 h-6 bg-transparent"
                                >
                                  {updateStatusMutation.isLoading ? "..." : "Cancel"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-medium">{request.hospitalName}</div>
                            <div className="text-gray-500 text-xs line-clamp-1">{request.fullAddress}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            <Link to={`/dashboard/update-request/${request._id}`}>
                               <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              disabled={request.status === "done" || request.status === "canceled"}
                            >
                              
                              <Edit size={14} />
                            </Button>
                              </Link>
                           
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(request)}
                              className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                              disabled={request.status === "inprogress"}
                            >
                              <Trash2 size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/donation-request/${request._id}`)}
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
            )}

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
                  <strong>{requestToDelete.recipientName}</strong> created by{" "}
                  <strong>{requestToDelete.requesterName}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setRequestToDelete(null)
                    }}
                    className="flex-1 bg-transparent"
                    disabled={deleteRequestMutation.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDelete(requestToDelete._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={deleteRequestMutation.isLoading}
                  >
                    {deleteRequestMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
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

export default AllBloodDonationRequestPage
