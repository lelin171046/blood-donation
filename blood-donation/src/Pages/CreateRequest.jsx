"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import useAxiosPublic from "@/Hook/useAxiosPublic"
import useAuth from "@/Hook/useAuth"
import { toast } from "react-hot-toast"
import useAxiosSecure from "@/Hook/useAxiosSecure"

const initialFormData = {
  recipientName: "",
  bloodGroup: "",
  recipientDistrict: "",
  recipientDivision: "",
  recipientUpazila: "",
  donationDate: "",
  donationTime: "",
  hospitalName: "",
  fullAddress: "",
  requestMessage: "",
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const CreateRequest = () => {
  const [formData, setFormData] = useState(initialFormData)

  const { user, userStatus } = useAuth()
  const axiosPublic = useAxiosSecure()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const requiredFields = [
      "recipientName",
      "bloodGroup",
      "recipientDistrict",
      "recipientDivision",
      "recipientUpazila",
      "donationDate",
      "donationTime",
      "hospitalName",
      "fullAddress",
    ]
    return requiredFields.every((field) => formData[field].trim() !== "")
  }

  // Mutation function
  const createDonationRequest = async (requestData) => {
    const response = await axiosPublic.post("/api/donation-requests", requestData)
    if (response.data?.insertedId) {
      return response.data
    } else {
      throw new Error(response.data.message || "Failed to create request")
    }
  }

  const mutation = useMutation({
    mutationFn: createDonationRequest,
    onSuccess: () => {
      toast.success("Donation request created successfully!")
      navigate("/dashboard/my-donation-requests")
    },
    onError: (error) => {
      console.error("Mutation error:", error)
      toast.error(error.message || "Something went wrong")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (userStatus === "blocked") {
      toast.error("Your account is blocked. You cannot create donation requests.")
      return
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields.")
      return
    }

    const requestData = {
      ...formData,
      requesterId: user?.uid,
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mutation.mutate(requestData)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-red-600">Create Donation Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">District</label>
            <input
              type="text"
              name="recipientDistrict"
              value={formData.recipientDistrict}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Division</label>
            <input
              type="text"
              name="recipientDivision"
              value={formData.recipientDivision}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Upazila</label>
            <input
              type="text"
              name="recipientUpazila"
              value={formData.recipientUpazila}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Donation Date</label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Donation Time</label>
            <input
              type="time"
              name="donationTime"
              value={formData.donationTime}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Hospital Name</label>
          <input
            type="text"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Full Address</label>
          <textarea
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Request Message (optional)</label>
          <textarea
            name="requestMessage"
            value={formData.requestMessage}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {mutation.isPending ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  )
}

export default CreateRequest
