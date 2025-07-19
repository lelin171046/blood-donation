"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Helmet } from "react-helmet"
import useAuth from "@/Hook/useAuth"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

const Login = () => {
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Get the redirect path from location state (for protected routes)
  const from = location.state?.from || "/"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data) => {
    try {
      console.log("Login Data:", data)

      // Clear any previous error messages
      setErrorMsg("")

      // Sign in with Firebase
      const result = await signIn(data.email, data.password)
      const loggedUser = result.user
      console.log("User logged in:", loggedUser)

      // Handle remember me functionality
      if (data.rememberMe) {
        localStorage.setItem("rememberUser", data.email)
      } else {
        localStorage.removeItem("rememberUser")
      }

      toast.success("Login successful!")
      reset()

      // Redirect to the intended page or home
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login error:", error)
      let errorMessage = "Login failed. Please try again."

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address."
          break
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again."
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address format."
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        default:
          errorMessage = error.message || errorMessage
      }

      setErrorMsg(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg("")
      const result = await signInWithGoogle()
      console.log("Google sign in successful:", result.user)
      toast.success("Google sign in successful!")
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Google sign in error:", error)
      setErrorMsg("Google sign in failed. Please try again.")
      toast.error("Google sign in failed")
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setErrorMsg("")
      const result = await signInWithGithub()
      console.log("GitHub sign in successful:", result.user)
      toast.success("GitHub sign in successful!")
      navigate(from, { replace: true })
    } catch (error) {
      console.error("GitHub sign in error:", error)
      setErrorMsg("GitHub sign in failed. Please try again.")
      toast.error("GitHub sign in failed")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Helmet>
        <title>Blood Center || Login</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-8">Sign in to your account to continue</p>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Registration Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?
            <Link to={"/register"} className="text-red-600 hover:text-red-700 font-medium ml-1">
              Create Account
            </Link>
          </p>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Additional Links */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-red-600 hover:text-red-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-red-600 hover:text-red-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
