

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, CreditCard, Lock } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_STRIPE)

// Payment Form Component
const PaymentForm = ({ amount, message, user, onSuccess, onClose, setIsProcessing, isProcessing }) => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Create payment intent
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Number.parseFloat(amount),
        }),
      })

      const { clientSecret } = await response.json()

      // Step 2: Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.name || "Anonymous",
            email: user?.email || "",
          },
        },
      })

      if (error) {
        throw error
      }

      if (paymentIntent.status === "succeeded") {
        // Step 3: Save payment record to database
        const paymentData = {
          amount: Number.parseFloat(amount),
          message: message,
          email: user?.email,
          donorId: user?.uid,
          donorName: user?.name,
          transactionId: paymentIntent.id,
          status: "completed",
          currency: "usd",
          paymentMethod: "card",
          cartIds: [], // Empty for donations
        }

        const saveResponse = await fetch("/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        if (saveResponse.ok) {
          toast.success("Thank you for your generous donation!")
          onSuccess()
        } else {
          throw new Error("Failed to save payment record")
        }
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error(error.message || "Payment failed. Please try again.")
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

        <div className="flex items-center gap-2 mt-3 text-sm text-blue-700">
          <Lock size={14} />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

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
          disabled={!stripe || isProcessing || !amount}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {isProcessing ? "Processing..." : `Donate $${amount || "0"}`}
        </Button>
      </div>
    </form>
  )
}

// Main Modal Component
const GiveFundModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

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

            {amount && Number.parseFloat(amount) >= 1 ? (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={amount}
                  message={message}
                  user={user}
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
