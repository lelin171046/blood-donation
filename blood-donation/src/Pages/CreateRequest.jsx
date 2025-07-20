"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { districts, upazilas } from "@/components/ui/locationData"
import useAuth from "@/Hook/useAuth"
import { ArrowLeft, User, MapPin, Calendar, Heart, MessageSquare, Plus, AlertCircle, Lock } from "lucide-react"
import toast from "react-hot-toast"

const CreateRequest = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [userStatus, setUserStatus] = useState("active") // This should come from user data
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  })
  const [errors, setErrors] = useState({})

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  // Check authentication and user status
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/dashboard/create-donation-request",
          message: "Please log in to create a donation request",
        },
      })
      return
    }

    // Set user data
    setFormData((prev) => ({
      ...prev,
      requesterName: user.displayName || user.email?.split("@")[0] || "",
      requesterEmail: user.email || "",
    }))

    // Check user status (replace with actual API call)
    const checkUserStatus = async () => {
      try {
        // const response = await axios.get(`/api/users/${user.uid}/status`)
        // setUserStatus(response.data.status)

        // Mock user status check
        setUserStatus("active") // or "blocked"
      } catch (error) {
        console.error("Failed to check user status:", error)
      }
    }

    checkUserStatus()
  }, [user, navigate])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset upazila when district changes
      ...(field === "recipientDistrict" && { recipientUpazila: "" }),
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required"
    }

    if (!formData.recipientDistrict) {
      newErrors.recipientDistrict = "Recipient district is required"
    }

    if (!formData.recipientUpazila) {
      newErrors.recipientUpazila = "Recipient upazila is required"
    }

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required"
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Full address is required"
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required"
    }

    if (!formData.donationDate) {
      newErrors.donationDate = "Donation date is required"
    } else {
      // Check if date is not in the past
      const selectedDate = new Date(formData.donationDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.donationDate = "Donation date cannot be in the past"
      }
    }

    if (!formData.donationTime) {
      newErrors.donationTime = "Donation time is required"
    }

    if (!formData.requestMessage.trim()) {
      newErrors.requestMessage = "Request message is required"
    } else if (formData.requestMessage.trim().length < 20) {
      newErrors.requestMessage = "Request message must be at least 20 characters"
    }

    // Name validation
    if (formData.recipientName.trim().length < 2) {
      newErrors.recipientName = "Recipient name must be at least 2 characters"
    }

    // Hospital name validation
    if (formData.hospitalName.trim().length < 5) {
      newErrors.hospitalName = "Hospital name must be at least 5 characters"
    }

    // Address validation
    if (formData.fullAddress.trim().length < 10) {
      newErrors.fullAddress = "Full address must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user is blocked
    if (userStatus === "blocked") {
      toast.error("Your account is blocked. You cannot create donation requests.")
      return
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsLoading(true)

    try {
      // Prepare request data
      const requestData = {
        ...formData,
        requesterId: user.uid,
        status: "pending", // Default status
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Replace with actual API call
      // const response = await axios.post('/api/donation-requests', requestData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Donation request created successfully!")
      navigate("/dashboard/my-donation-requests")
    } catch (error) {
      console.error("Failed to create donation request:", error)
      toast.error("Failed to create donation request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  if (!user) {
    return null
  }

  // Show blocked user message
  if (userStatus === "blocked") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Blocked</h2>
            <p className="text-gray-600 mb-4">
              Your account has been blocked. You cannot create donation requests at this time.
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="outline">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Donation Request</h1>
          <p className="text-gray-600">Fill out the form below to request blood donation</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="bg-red-50 border-b">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Plus size={20} />
              New Donation Request
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Requester Information (Read-only) */}
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={18} />
                  Requester Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requester Name</label>
                    <Input
                      type="text"
                      value={formData.requesterName}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requester Email</label>
                    <Input
                      type="email"
                      value={formData.requesterEmail}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-red-600" />
                  Recipient Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                    <Input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange("recipientName", e.target.value)}
                      placeholder="Enter recipient's full name"
                      className={errors.recipientName ? "border-red-500" : ""}
                    />
                    {errors.recipientName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.recipientName}
                      </p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group *</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white ${
                        errors.bloodGroup ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.bloodGroup}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Location Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient District *</label>
                    <select
                      value={formData.recipientDistrict}
                      onChange={(e) => handleInputChange("recipientDistrict", e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white ${
                        errors.recipientDistrict ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {errors.recipientDistrict && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.recipientDistrict}
                      </p>
                    )}
                  </div>

                  {/* Upazila */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Upazila *</label>
                    <select
                      value={formData.recipientUpazila}
                      onChange={(e) => handleInputChange("recipientUpazila", e.target.value)}
                      disabled={!formData.recipientDistrict}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors.recipientUpazila ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Upazila</option>
                      {formData.recipientDistrict &&
                        upazilas[formData.recipientDistrict]?.map((upazila) => (
                          <option key={upazila} value={upazila}>
                            {upazila}
                          </option>
                        ))}
                    </select>
                    {errors.recipientUpazila && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.recipientUpazila}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  {/* Hospital Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
                    <Input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                      placeholder="e.g., Dhaka Medical College Hospital"
                      className={errors.hospitalName ? "border-red-500" : ""}
                    />
                    {errors.hospitalName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.hospitalName}
                      </p>
                    )}
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                    <Input
                      type="text"
                      value={formData.fullAddress}
                      onChange={(e) => handleInputChange("fullAddress", e.target.value)}
                      placeholder="e.g., Zahir Raihan Rd, Dhaka"
                      className={errors.fullAddress ? "border-red-500" : ""}
                    />
                    {errors.fullAddress && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.fullAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Donation Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-green-600" />
                  Donation Schedule
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Donation Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Donation Date *</label>
                    <Input
                      type="date"
                      value={formData.donationDate}
                      onChange={(e) => handleInputChange("donationDate", e.target.value)}
                      min={getMinDate()}
                      className={errors.donationDate ? "border-red-500" : ""}
                    />
                    {errors.donationDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.donationDate}
                      </p>
                    )}
                  </div>

                  {/* Donation Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Donation Time *</label>
                    <Input
                      type="time"
                      value={formData.donationTime}
                      onChange={(e) => handleInputChange("donationTime", e.target.value)}
                      className={errors.donationTime ? "border-red-500" : ""}
                    />
                    {errors.donationTime && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.donationTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Message */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={18} className="text-purple-600" />
                  Request Details
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Message *</label>
                  <textarea
                    value={formData.requestMessage}
                    onChange={(e) => handleInputChange("requestMessage", e.target.value)}
                    placeholder="Please describe why you need blood donation, the urgency, and any other relevant details..."
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none ${
                      errors.requestMessage ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="5"
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.requestMessage ? (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.requestMessage}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">Minimum 20 characters required</p>
                    )}
                    <p className="text-gray-500 text-sm">{formData.requestMessage.length}/500</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Request...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Create Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3">💡 Tips for Creating a Good Request</h3>
            <ul className="text-blue-700 text-sm space-y-2">
              <li>• Provide accurate recipient information and location details</li>
              <li>• Choose a realistic donation date and time</li>
              <li>• Write a clear and detailed request message explaining the urgency</li>
              <li>• Double-check the hospital name and address</li>
              <li>• Make sure your contact information is up to date</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateRequest
