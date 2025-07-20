"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuth from "@/Hook/useAuth"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import toast from "react-hot-toast"

const MyDonationRequests = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/dashboard/my-donation-requests",
          message: "Please log in to access your donation requests",
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
    {
      id: 4,
      recipientName: "Abdul Karim",
      recipientDistrict: "Rajshahi",
      recipientUpazila: "Boalia",
      donationDate: "2024-07-23",
      donationTime: "11:30 AM",
      status: "canceled",
      donorInfo: null,
      createdAt: "2024-07-18T16:45:00Z",
      bloodGroup: "AB+",
      urgency: "Critical",
    },
    {
      id: 5,
      recipientName: "Nasir Ahmed",
      recipientDistrict: "Dhaka",
      recipientUpazila: "Eskaton",
      donationDate: "2024-07-24",
      donationTime: "3:30 PM",
      status: "pending",
      donorInfo: null,
      createdAt: "2024-07-20T12:20:00Z",
      bloodGroup: "O+",
      urgency: "Urgent",
    },
    {
      id: 6,
      recipientName: "Fatima Khatun",
      recipientDistrict: "Sylhet",
      recipientUpazila: "Sadar",
      donationDate: "2024-07-27",
      donationTime: "8:00 AM",
      status: "inprogress",
      donorInfo: {
        name: "Ibrahim Hassan",
        email: "ibrahim.hassan@email.com",
      },
      createdAt: "2024-07-22T09:30:00Z",
      bloodGroup: "A-",
      urgency: "Critical",
    },
    {
      id: 7,
      recipientName: "Kamal Uddin",
      recipientDistrict: "Khulna",
      recipientUpazila: "Khalishpur",
      donationDate: "2024-07-28",
      donationTime: "2:00 PM",
      status: "done",
      donorInfo: {
        name: "Salma Khatun",
        email: "salma.khatun@email.com",
      },
      createdAt: "2024-07-23T14:15:00Z",
      bloodGroup: "B-",
      urgency: "Moderate",
    },
    {
      id: 8,
      recipientName: "Rubina Akter",
      recipientDistrict: "Barisal",
      recipientUpazila: "Sadar",
      donationDate: "2024-07-29",
      donationTime: "10:30 AM",
      status: "pending",
      donorInfo: null,
      createdAt: "2024-07-24T11:45:00Z",
      bloodGroup: "O+",
      urgency: "Urgent",
    },
  ]

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        // const response = await axios.get(`/api/donation-requests/user/${user.uid}`)
        // setRequests(response.data.requests)

        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRequests(mockRequests)
        setFilteredRequests(mockRequests)
      } catch (error) {
        console.error("Failed to fetch requests:", error)
        toast.error("Failed to load donation requests")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchRequests()
    }
  }, [user])

  // Filter and search functionality
  useEffect(() => {
    let filtered = requests

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (request) =>
          request.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.recipientDistrict.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.recipientUpazila.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredRequests(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [searchQuery, statusFilter, requests])

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Replace with actual API call
      // await axios.patch(`/api/donation-requests/${requestId}`, { status: newStatus })

      setRequests((prev) =>
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

      setRequests((prev) => prev.filter((request) => request.id !== requestId))
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
          <p className="text-gray-600">Loading your donation requests...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donation Requests</h1>
          <p className="text-gray-600">Manage all your blood donation requests</p>
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
                  placeholder="Search by recipient name, location, or blood group..."
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
              Donation Requests
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
                  {currentRequests.map((request) => (
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

export default MyDonationRequests
