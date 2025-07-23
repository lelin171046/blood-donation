"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Clock, User, Eye, AlertCircle } from "lucide-react"
import useAuth from "@/Hook/useAuth"
import { Button } from "@/components/ui/button"
import useAxiosPublic from "@/Hook/useAxiosPublic"

const DonationRequests = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()
  const { user } = useAuth()
  const axiosPublic = useAxiosPublic()

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        const response = await axiosPublic.get("/api/donation-requests")
        console.log(response.data, "API Response")

        // Filter only pending requests
        const pendingRequests = response.data.filter((req) => req.status === "pending")
        setRequests(pendingRequests)
      } catch (error) {
        console.error("Failed to fetch donation requests:", error)
        setRequests([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [axiosPublic])

// const handleViewDetails = (id) => {
//   if (!user) {
//     navigate("/login", {
//       state: {
//         from: `/donation-request/${id}`,
//         message: "Please log in to view donation request details",
//       },
//     })
//     return
//   }
//   navigate(`/donation-request/${id}`)
// }
  // Calculate urgency based on donation date
  const calculateUrgency = (donationDate) => {
    if (!donationDate) return "moderate"

    const today = new Date()
    const requestDate = new Date(donationDate)
    const diffTime = requestDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return "critical"
    if (diffDays <= 3) return "urgent"
    return "moderate"
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBloodGroupColor = (bloodGroup) => {
    return "bg-red-600 text-white"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"

    // Handle time format (HH:MM to 12-hour format)
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Filter requests based on calculated urgency
  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true
    const urgency = calculateUrgency(request.donationDate)
    return urgency.toLowerCase() === filter
  })

  // Sort requests by urgency and date
  const sortedRequests = filteredRequests.sort((a, b) => {
    const urgencyOrder = { critical: 3, urgent: 2, moderate: 1 }
    const urgencyA = calculateUrgency(a.donationDate).toLowerCase()
    const urgencyB = calculateUrgency(b.donationDate).toLowerCase()

    const urgencyDiff = urgencyOrder[urgencyB] - urgencyOrder[urgencyA]
    if (urgencyDiff !== 0) return urgencyDiff

    return new Date(a.donationDate) - new Date(b.donationDate)
  })

  // Calculate stats based on urgency
  const criticalCount = requests.filter((r) => calculateUrgency(r.donationDate) === "critical").length
  const urgentCount = requests.filter((r) => calculateUrgency(r.donationDate) === "urgent").length
  const moderateCount = requests.filter((r) => calculateUrgency(r.donationDate) === "moderate").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donation Requests</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help save lives by responding to these urgent blood donation requests from hospitals and medical centers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{requests.length}</div>
              <div className="text-gray-600 text-sm">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-700 mb-2">{criticalCount}</div>
              <div className="text-red-700 text-sm">Critical Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-700 mb-2">{urgentCount}</div>
              <div className="text-orange-700 text-sm">Urgent Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">{moderateCount}</div>
              <div className="text-green-700 text-sm">Moderate Cases</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "critical"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilter("urgent")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "urgent"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Urgent ({urgentCount})
          </button>
          <button
            onClick={() => setFilter("moderate")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "moderate"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Moderate ({moderateCount})
          </button>
        </div>

        {/* Donation Requests */}
        {sortedRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-gray-500 text-lg mb-2">No donation requests found</div>
              <div className="text-gray-400">
                {filter === "all"
                  ? "There are currently no pending donation requests."
                  : `No ${filter} requests at the moment.`}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {filter === "all" ? "All Requests" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`} (
                {sortedRequests.length})
              </h2>
            </div>

            {/* Card View */}
            <div className="grid gap-6">
              {sortedRequests.map((request) => {
                const urgency = calculateUrgency(request.donationDate)

                return (
                  <Card
                    key={request._id}
                    className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
                      urgency === "critical"
                        ? "border-l-red-500 bg-red-50/30"
                        : urgency === "urgent"
                          ? "border-l-orange-500 bg-orange-50/30"
                          : "border-l-yellow-500 bg-yellow-50/30"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="grid lg:grid-cols-5 gap-6 items-center">
                        {/* Patient Info - 2 columns */}
                        <div className="lg:col-span-2 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-2">
                                <User size={20} />
                                {request.recipientName}
                              </h3>
                              <div className="flex items-center gap-3 mb-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBloodGroupColor(request.bloodGroup)}`}
                                >
                                  {request.bloodGroup}
                                </span>
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(urgency)}`}
                                >
                                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} />
                            <span className="text-sm">
                              {request.hospitalName}, {request.recipientDistrict}, {request.recipientUpazila}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">{request.requestMessage}</p>
                        </div>

                        {/* Date & Time - 1 column */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            <div>
                              <div className="text-sm font-medium">{formatDate(request.donationDate)}</div>
                              <div className="text-xs text-gray-500">Needed by</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={16} />
                            <div>
                              <div className="text-sm font-medium">{formatTime(request.donationTime)}</div>
                              <div className="text-xs text-gray-500">Time</div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info - 1 column */}
                        <div className="space-y-2">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{request.requesterName}</div>
                            <div className="text-gray-500">{request.hospitalName}</div>
                            <div className="text-xs text-gray-400">{request.requesterEmail}</div>
                          </div>
                          <div className="text-xs text-gray-500">Posted: {formatDate(request.createdAt)}</div>
                        </div>

                        {/* Action Button - 1 column */}
                        <div className="flex justify-end">
                         
                          <Button>
                            <Link to={`/donation-request/${request._id}`}
                          //  onClick={() => handleViewDetails(request._id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                          >
                            <Eye size={16} />
                            View Details
                          </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold text-red-800 mb-3">Need to Submit a Donation Request?</h3>
            <p className="text-red-700 mb-6 max-w-2xl mx-auto">
              If you or someone you know needs blood, you can submit a request here. Our community of donors will be
              notified and can respond quickly to help save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/dashboard/create-request")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
              >
                Submit Blood Request
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/how-it-works")}
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent px-8 py-3"
              >
                How It Works
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <div className="mt-8 text-center">
          <div className="bg-red-600 text-white p-4 rounded-lg inline-block">
            <div className="font-semibold mb-1">Emergency Hotline</div>
            <div className="text-lg">📞 +880-1234-567890</div>
            <div className="text-sm opacity-90">Available 24/7 for critical cases</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationRequests
