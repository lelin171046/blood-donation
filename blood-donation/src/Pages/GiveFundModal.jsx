"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, CreditCard, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import useAxiosSecure from "@/Hook/useAxiosSecure"
import { useNavigate } from "react-router-dom"
import useAuth from "@/Hook/useAuth"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_STRIPE)

// Payment Form Component
const PaymentForm = ({ amount, message, onSuccess, onClose, setIsProcessing, isProcessing }) => {
  const stripe = useStripe()
  const elements = useElements()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [clientSecret, setClientSecret] = useState("")
  const [error, setError] = useState("")
  const [transactionId, setTransactionId] = useState("")

  const totalAmount = Number.parseFloat(amount)

  useEffect(() => {
    if (totalAmount > 0 && user) {
      // Add user check to ensure user is still logged in
      axiosSecure
        .post("/create-checkout-session", { price: totalAmount })
        .then((res) => {
          console.log("Payment intent created:", res.data)
          setClientSecret(res.data.clientSecret)
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err)
          // Don't show auth errors to user, just payment initialization error
          if (err.response?.status === 401 || err.response?.status === 403) {
            toast.error("Session expired. Please refresh and try again.")
          } else {
            toast.error("Failed to initialize payment. Please try again.")
          }
        })
    }
  }, [axiosSecure, totalAmount, user])

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Check if user is still logged in before processing
    if (!user) {
      toast.error("Please log in to make a donation.")
      onClose()
      return
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please wait and try again.")
      return
    }

    if (!clientSecret) {
      toast.error("Payment not initialized. Please try again.")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const card = elements.getElement(CardElement)

      if (card == null) {
        toast.error("Card information is required.")
        setIsProcessing(false)
        return
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: user?.displayName || user?.name || "Anonymous",
          email: user?.email || "anonymous@example.com",
        },
      })

      if (paymentMethodError) {
        console.error("Payment method error:", paymentMethodError)
        setError(paymentMethodError.message)
        toast.error(paymentMethodError.message)
        setIsProcessing(false)
        return
      }

      console.log("Payment method created:", paymentMethod)

      // Confirm payment
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous@example.com",
            name: user?.displayName || user?.name || "Anonymous",
          },
        },
      })

      if (confirmError) {
        console.error("Payment confirmation error:", confirmError)
        setError(confirmError.message)
        toast.error(confirmError.message)
        setIsProcessing(false)
        return
      }

      console.log("Payment intent confirmed:", paymentIntent)

      if (paymentIntent.status === "succeeded") {
        setTransactionId(paymentIntent.id)

        // Double-check user is still logged in before saving
        if (!user) {
          toast.error("Session expired. Payment was processed but record may not be saved.")
          setIsProcessing(false)
          return
        }

        // Save payment to database
        const payment = {
          donorEmail: user?.email,
          donorName: user?.displayName || user?.name,
          transactionId: paymentIntent.id,
          amount: totalAmount,
          message: message,
          date: new Date(),
          status: "completed",
          currency: "usd",
          paymentMethod: "card",
          cartIds: [], // Empty for donations
        }

        try {
          const res = await axiosSecure.post("/payment", payment)
          console.log("Payment saved:", res.data)

          if (res.data?.paymentResult?.insertedId) {
            toast.success("Payment Successful! Thank you for your donation.")

            // Close modal first, then navigate
            onSuccess()

            // Use setTimeout to ensure modal closes before navigation
            setTimeout(() => {
              navigate("/funding")
            }, 100)
          } else {
            toast.error("Payment processed but failed to save record. Please contact support.")
          }
        } catch (saveError) {
          console.error("Error saving payment:", saveError)

          // Handle auth errors specifically
          if (saveError.response?.status === 401 || saveError.response?.status === 403) {
            toast.error("Payment successful but session expired. Please check your payment history.")
          } else {
            toast.error("Payment processed but failed to save record. Please contact support.")
          }
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError(error.message)
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <CreditCard size={16} />
          <span className="font-medium">Payment Details</span>
        </div>

        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement options={cardElementOptions} />
        </div>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-2 mt-3 text-sm text-blue-700">
          <Lock size={14} />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      {!clientSecret && totalAmount > 0 && (
        <div className="text-center text-sm text-gray-500">Initializing payment...</div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing || !amount || !user}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {isProcessing ? "Processing..." : `Donate $${amount || "0"}`}
        </Button>
      </div>
    </form>
  )
}

// Main Modal Component
const GiveFundModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  const handleClose = () => {
    if (!isProcessing) {
      setAmount("")
      setMessage("")
      onClose()
    }
  }

  const handleSuccess = () => {
    setAmount("")
    setMessage("")
    onSuccess()
  }

  // Don't render if user is not logged in
  if (!user) {
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            Give Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* User info display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                Donating as: <span className="font-medium">{user?.displayName || user?.name || user?.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount (USD) *</label>
              <Input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (minimum $1)"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message of support..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
                rows="3"
                maxLength="200"
                disabled={isProcessing}
              />
              <div className="text-xs text-gray-500 mt-1">{message.length}/200 characters</div>
            </div>

            {/* Show payment form only when amount is valid */}
            {amount && Number.parseFloat(amount) >= 1 ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={amount}
                  message={message}
                  onSuccess={handleSuccess}
                  onClose={handleClose}
                  setIsProcessing={setIsProcessing}
                  isProcessing={isProcessing}
                />
              </Elements>
            ) : (
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button disabled className="flex-1 bg-gray-400">
                  Enter Amount to Continue
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GiveFundModal
