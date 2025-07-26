"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
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
  X,
} from "lucide-react"
import useAuth from "@/Hook/useAuth"
import toast from "react-hot-toast"
import useAxiosPublic from "@/Hook/useAxiosPublic"
import useAxiosSecure from "@/Hook/useAxiosSecure"

const DonationRequestDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResponding, setIsResponding] = useState(false)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const axiosPublic = useAxiosSecure()

  console.log(id);

  useEffect(() => {
    // Fetch request details
    const fetchRequestDetails = async () => {
      setIsLoading(true)
      try {
        const response = await axiosPublic.get(`/api/donation-requests/${id}`)
        setRequest(response.data)
        console.log(response.data);
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

  const handleDonateClick = () => {
    if (!user) {
      toast.error("Please log in to donate")
      navigate("/login", {
        state: {
          from: `/donation-request/${id}`,
          message: "Please log in to donate blood",
        },
      })
      return
    }
    setShowDonationModal(true)
  }

  const handleConfirmDonation = async (id) => {
    if (!user) {
      toast.error("Please log in to donate")
      return
    }

    setIsConfirming(true)
    try {
      // Update donation status to in-progress
      await axiosPublic.patch(`/api/donation-requests/${id}/donate`, {
        donorId: user.uid,
        donorName: user.displayName || user.name,
        donorEmail: user.email,
        status: 'in progress'
      })

      // Update local state
      setRequest(prev => ({
        ...prev,
        status: 'inprogress'
      }))

      toast.success("Donation confirmed! The hospital will contact you soon.")
      setShowDonationModal(false)
    } catch (error) {
      console.error("Failed to confirm donation:", error)
      toast.error("Failed to confirm donation. Please try again.")
    } finally {
      setIsConfirming(false)
    }
  }

  const handleRespond = async () => {
    if (!user) {
      toast.error("Please log in to respond to requests")
      return
    }

    setIsResponding(true)
    try {
      await axiosPublic.patch(`/api/donation-requests/${id}`, {
        donorId: user.uid,
        message: "I would like to donate blood for this request"
      })
      
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
        text: `Urgent: ${request.bloodGroup} blood needed for ${request.recipientName} at ${request.hospitalName}`,
        url: window.location.href,
      })
    } else {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inprogress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
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
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-medium bg-red-600 text-white">
                    {request.bloodGroup}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(request.urgency)}`}
                  >
                    {request.urgency}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                  {request.unitsNeeded && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {request.unitsNeeded - (request.unitsCollected || 0)} of {request.unitsNeeded} units needed
                    </span>
                  )}
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
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blood Group</label>
                    <p className="text-gray-900 font-medium">{request.bloodGroup}</p>
                  </div>
                  {request.patientAge && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-gray-900">{request.patientAge}</p>
                    </div>
                  )}
                  {request.patientGender && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{request.patientGender}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700">{request.requestMessage}</p>
                </div>
                {request.medicalCondition && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medical Condition</label>
                    <p className="text-gray-700">{request.medicalCondition}</p>
                  </div>
                )}
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
                    {request.recipientUpazila}, {request.recipientDistrict}
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

            {/* Donate Button */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <Heart className="mx-auto h-16 w-16 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-2">Ready to Save a Life?</h3>
                <p className="text-red-700 mb-6">
                  Your blood donation can make a real difference. Click below to confirm your donation.
                </p>
                <Button
                  onClick={handleDonateClick}
                  disabled={request.status === 'completed' || request.status === 'cancelled'}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  {request.status === 'completed' ? 'Donation Completed' : 
                   request.status === 'cancelled' ? 'Request Cancelled' : 
                   'Donate Now'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time & Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When & Where</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium">{formatDate(request.donationDate)}</p>
                    <p className="text-sm text-gray-500">Needed by</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-red-600" size={20} />
                  <div>
                    <p className="font-medium">{request.donationTime}</p>
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

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleRespond}
                  disabled={isResponding}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-100 bg-transparent mb-3"
                >
                  {isResponding ? "Sending..." : "Contact for More Info"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message Hospital
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Donation Confirmation Modal */}
      {/* Custom Modal with Tailwind CSS */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDonationModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
            {/* Close Button */}
            <button
              onClick={() => setShowDonationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isConfirming}
            >
              <X size={20} />
            </button>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Heart className="text-red-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirm Your Donation
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Please confirm your details to proceed with the blood donation.
              </p>
            </div>
            
            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="donorName" className="block text-sm font-medium text-gray-700">
                  Donor Name
                </label>
                <input
                  id="donorName"
                  type="text"
                  value={user?.displayName || user?.name || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-700">
                  Donor Email
                </label>
                <input
                  id="donorEmail"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> By confirming, you agree to donate blood for this request. 
                  The hospital will contact you to coordinate the donation process.
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDonationModal(false)}
                disabled={isConfirming}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={()=> handleConfirmDonation(request._id)}
                disabled={isConfirming}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConfirming ? "Confirming..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonationRequestDetailsPage