"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Hospital,
  ArrowLeft,
  AlertCircle,
  Heart,
  Share2,
  MessageCircle,
} from "lucide-react"
import useAuth from "@/Hook/useAuth"
import toast from "react-hot-toast"
import useAxiosPublic from "@/Hook/useAxiosPublic"
// import Card from "@/components/ui/Card"

const DonationRequestDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResponding, setIsResponding] = useState(false)
  const axiosPublic = useAxiosPublic()
  console.log(id);
  // Mock data - replace with actual API call
  const mockRequests = {
    1: {
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
      email: "dr.rahman@dmch.gov.bd",
      description:
        "Patient needs blood for emergency surgery. Multiple units required due to severe blood loss from accident. Patient is currently in ICU and surgery is scheduled for tomorrow morning.",
      status: "pending",
      createdAt: "2024-07-20T08:00:00Z",
      hospital: "Dhaka Medical College Hospital",
      hospitalAddress: "Bakshibazar, Dhaka-1000",
      unitsNeeded: 3,
      unitsCollected: 1,
      medicalCondition: "Severe trauma from road accident",
      patientAge: 28,
      patientGender: "Female",
      additionalNotes:
        "Patient has no known allergies. Family is present at the hospital. Please contact Dr. Rahman before coming to donate.",
      emergencyContact: "+880 1712-345679",
      donationInstructions:
        "Please bring valid ID and ensure you have eaten before donation. Donation center is on the 2nd floor of the hospital.",
    },
  }

  useEffect(() => {
    // Check if user is logged in
    // if (!user) {
    //   navigate("/login", {
    //     state: {
    //       from: `/donation-request/${id}`,
    //       message: "Please log in to view donation request details",
    //     },
    //   })
    //   return
    // }

    // Fetch request details
    const fetchRequestDetails = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        const response = await axiosPublic.get(`/api/donation-requests/${id}`)
        setRequest(response.data)
        console.log(response.data);

        // Simulate loading delay

      } catch (error) {
        console.error("Failed to fetch request details:", error)
        toast.error("Failed to load request details")
        navigate("/donation-requests")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequestDetails()
  }, [id, user, navigate])

  const handleRespond = async () => {
    if (!user) {
      toast.error("Please log in to respond to requests")
      return
    }

    setIsResponding(true)
    try {
      // Replace with actual API call
      await axiosPublic.post(`/api/donation-requests/${id}`, {
        donorId: user.uid,
        message: "I would like to donate blood for this request"
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Response sent successfully! The hospital will contact you soon.")
    } catch (error) {
      console.error("Failed to respond:", error)
      toast.error("Failed to send response. Please try again.")
    } finally {
      setIsResponding(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Blood Donation Request - ${request.recipientName}`,
        text: `Urgent: ${request.bloodGroup} blood needed for ${request.recipientName} at ${request.
          hospitalName}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Not Found</h2>
            <p className="text-gray-600 mb-4">
              The donation request you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/donation-requests")}>Back to Requests</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/donation-requests"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to All Requests
          </Link>
        </div>

        {/* Header Card */}
        <Card className="mb-8 border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-gray-900 mb-2">Blood Donation Request</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-medium bg-red-600 text-white">
                    {request.bloodGroup}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(request.urgency)}`}
                  >
                    {request.urgency}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {request.unitsNeeded - request.unitsCollected} of {request.unitsNeeded} units needed
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 size={16} className="mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Patient Name</label>
                    <p className="text-gray-900 font-medium">{request.recipientName}</p>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{request.patientAge} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{request.patientGender}</p>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blood Group</label>
                    <p className="text-gray-900 font-medium">{request.bloodGroup}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700">{request.requestMessage}</p>
                </div>
                {request.additionalNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                    <p className="text-gray-700">{request.additionalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hospital Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital size={20} />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Hospital Name</label>
                  <p className="text-gray-900 font-medium">{request.hospitalName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-700 flex items-start gap-2">
                    <MapPin size={16} className="mt-1 text-gray-400" />
                    {request.fullAddress}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-700">
                    {request.
                      recipientUpazila}, {request.
                        recipientDistrict}
                  </p>
                </div>
                {request.donationInstructions && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Donation Instructions</label>
                    <p className="text-gray-700">{request.donationInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Heart className="mx-auto h-12 w-12 text-red-600 mb-2" />
                  <h3 className="font-semibold text-red-800">Ready to Help?</h3>
                  <p className="text-sm text-red-700 mt-1">Your donation can save a life</p>
                </div>
                <Button
                  onClick={handleRespond}
                  disabled={isResponding}
                  className="w-full bg-red-600 hover:bg-red-700 mb-3"
                >
                  {isResponding ? "Sending..." : "I Want to Donate"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Contact Hospital
                </Button>
              </CardContent>
            </Card>

            {/* Time & Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When & Where</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium">{formatDate(request.
                      donationDate)}</p>
                    <p className="text-sm text-gray-500">Needed by</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium">{request.
                      donationTime}</p>
                    <p className="text-sm text-gray-500">Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium">{request.hospitalName}</p>
                    <p className="text-sm text-gray-500">{request.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Person</label>
                  <p className="font-medium">{request.contactPerson}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-red-600" size={16} />
                  <a href={`tel:${request.phone}`} className="text-red-600 hover:text-red-700 font-medium">
                    {request.phone}
                  </a>
                </div>
                {request.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="text-red-600" size={16} />
                    <a href={`mailto:${request.email}`} className="text-red-600 hover:text-red-700">
                      {request.email}
                    </a>
                  </div>
                )}
                {request.emergencyContact && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                    <a
                      href={`tel:${request.emergencyContact}`}
                      className="block text-red-600 hover:text-red-700 font-medium"
                    >
                      {request.emergencyContact}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collection Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Units Collected</span>
                    <span>
                      {request.unitsCollected} of {request.unitsNeeded}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(request.unitsCollected / request.unitsNeeded) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {request.unitsNeeded - request.unitsCollected} more unit
                    {request.unitsNeeded - request.unitsCollected !== 1 ? "s" : ""} needed
                  </p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationRequestDetailsPage
