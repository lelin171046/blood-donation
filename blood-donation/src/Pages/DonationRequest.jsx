"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Clock, User, Eye, AlertCircle } from "lucide-react"
import useAuth from "@/Hook/useAuth"
import { Button } from "@/components/ui/button"


const DonationRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()
  const { user } = useAuth() // Get current user

  // Mock donation requests data - replace with actual API call
  const mockRequests = [
    {
      id: 1,
      recipientName: "Sarah Ahmed",
      bloodGroup: "A+",
      location: "Dhaka Medical College Hospital, Dhaka",
      district: "Dhaka",
      upazila: "Dhanmondi",
      date: "2024-07-25",
      time: "10:00 AM",
      urgency: "Critical",
      contactPerson: "Dr. Rahman",
      phone: "+880 1712-345678",
      description: "Patient needs blood for emergency surgery. Multiple units required.",
      status: "pending",
      createdAt: "2024-07-20T08:00:00Z",
      hospital: "Dhaka Medical College Hospital",
      unitsNeeded: 3,
    },
    {
      id: 2,
      recipientName: "Mohammad Hasan",
      bloodGroup: "O-",
      location: "Chittagong Medical College, Chittagong",
      district: "Chittagong",
      upazila: "Agrabad",
      date: "2024-07-24",
      time: "2:00 PM",
      urgency: "Urgent",
      contactPerson: "Nurse Fatima",
      phone: "+880 1812-345678",
      description: "Emergency blood requirement for accident victim",
      status: "pending",
      createdAt: "2024-07-19T14:30:00Z",
      hospital: "Chittagong Medical College",
      unitsNeeded: 2,
    },
    {
      id: 3,
      recipientName: "Rashida Begum",
      bloodGroup: "B+",
      location: "Square Hospital, Dhaka",
      district: "Dhaka",
      upazila: "Panthapath",
      date: "2024-07-26",
      time: "9:00 AM",
      urgency: "Moderate",
      contactPerson: "Dr. Khan",
      phone: "+880 1912-345678",
      description: "Blood needed for childbirth complications",
      status: "pending",
      createdAt: "2024-07-21T10:15:00Z",
      hospital: "Square Hospital",
      unitsNeeded: 1,
    },
    {
      id: 4,
      recipientName: "Abdul Karim",
      bloodGroup: "AB+",
      location: "Rajshahi Medical College, Rajshahi",
      district: "Rajshahi",
      upazila: "Boalia",
      date: "2024-07-23",
      time: "11:30 AM",
      urgency: "Critical",
      contactPerson: "Dr. Sultana",
      phone: "+880 1612-345678",
      description: "Blood required for cancer treatment - ongoing therapy",
      status: "pending",
      createdAt: "2024-07-18T16:45:00Z",
      hospital: "Rajshahi Medical College",
      unitsNeeded: 4,
    },
    {
      id: 5,
      recipientName: "Nasir Ahmed",
      bloodGroup: "O+",
      location: "Holy Family Hospital, Dhaka",
      district: "Dhaka",
      upazila: "Eskaton",
      date: "2024-07-24",
      time: "3:30 PM",
      urgency: "Urgent",
      contactPerson: "Dr. Islam",
      phone: "+880 1512-345678",
      description: "Emergency blood transfusion needed for surgery",
      status: "pending",
      createdAt: "2024-07-20T12:20:00Z",
      hospital: "Holy Family Hospital",
      unitsNeeded: 2,
    },
    {
      id: 6,
      recipientName: "Fatima Khatun",
      bloodGroup: "A-",
      location: "Ibn Sina Hospital, Sylhet",
      district: "Sylhet",
      upazila: "Sadar",
      date: "2024-07-27",
      time: "8:00 AM",
      urgency: "Critical",
      contactPerson: "Dr. Ahmed",
      phone: "+880 1712-987654",
      description: "Urgent blood needed for maternal complications",
      status: "pending",
      createdAt: "2024-07-22T09:30:00Z",
      hospital: "Ibn Sina Hospital",
      unitsNeeded: 2,
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch donation requests
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        // Replace this with actual API call
        // const response = await axios.get('/api/donation-requests?status=pending')
        // setRequests(response.data.requests)

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRequests(mockRequests.filter((req) => req.status === "pending"))
      } catch (error) {
        console.error("Failed to fetch donation requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleViewDetails = (requestId) => {
    // Check if user is logged in
    if (!user) {
      // Store the intended destination and redirect to login
      navigate("/login", {
        state: {
          from: `/donation-request/${requestId}`,
          message: "Please log in to view donation request details",
        },
      })
      return
    }

    // User is logged in, navigate to details page
    navigate(`/donation-request/${requestId}`)
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
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true
    return request.urgency.toLowerCase() === filter
  })

  const sortedRequests = filteredRequests.sort((a, b) => {
    // Sort by urgency (Critical > Urgent > Moderate) then by date
    const urgencyOrder = { critical: 3, urgent: 2, moderate: 1 }
    const urgencyDiff = urgencyOrder[b.urgency.toLowerCase()] - urgencyOrder[a.urgency.toLowerCase()]

    if (urgencyDiff !== 0) return urgencyDiff

    return new Date(a.date) - new Date(b.date)
  })

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
              <div className="text-3xl font-bold text-red-700 mb-2">
                {requests.filter((r) => r.urgency === "Critical").length}
              </div>
              <div className="text-red-700 text-sm">Critical Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-700 mb-2">
                {requests.filter((r) => r.urgency === "Urgent").length}
              </div>
              <div className="text-orange-700 text-sm">Urgent Cases</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">24/7</div>
              <div className="text-green-700 text-sm">Support Available</div>
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
            Critical ({requests.filter((r) => r.urgency === "Critical").length})
          </button>
          <button
            onClick={() => setFilter("urgent")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "urgent"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Urgent ({requests.filter((r) => r.urgency === "Urgent").length})
          </button>
          <button
            onClick={() => setFilter("moderate")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "moderate"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Moderate ({requests.filter((r) => r.urgency === "Moderate").length})
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
                {filter === "all" ? "All Requests" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}(
                {sortedRequests.length})
              </h2>
            </div>

            {/* Card View */}
            <div className="grid gap-6">
              {sortedRequests.map((request) => (
                <Card
                  key={request.id}
                  className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
                    request.urgency === "Critical"
                      ? "border-l-red-500 bg-red-50/30"
                      : request.urgency === "Urgent"
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
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}
                              >
                                {request.urgency}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {request.unitsNeeded} unit{request.unitsNeeded > 1 ? "s" : ""} needed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} />
                          <span className="text-sm">{request.location}</span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                      </div>

                      {/* Date & Time - 1 column */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <div>
                            <div className="text-sm font-medium">{formatDate(request.date)}</div>
                            <div className="text-xs text-gray-500">Needed by</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} />
                          <div>
                            <div className="text-sm font-medium">{request.time}</div>
                            <div className="text-xs text-gray-500">Time</div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info - 1 column */}
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{request.contactPerson}</div>
                          <div className="text-gray-500">{request.hospital}</div>
                        </div>
                        <div className="text-xs text-gray-500">Posted: {formatDate(request.createdAt)}</div>
                      </div>

                      {/* Action Button - 1 column */}
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleViewDetails(request.id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <Eye size={16} />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                onClick={() => navigate("/submit-request")}
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

export default DonationRequestsPage
