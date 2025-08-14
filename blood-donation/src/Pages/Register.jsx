
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { Helmet } from "react-helmet"
import useAuth from "@/Hook/useAuth"
import toast from "react-hot-toast"
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city"
import { uploadToImgBB } from "@/Share/ImageUpload"
import useAxiosPublic from "@/Hook/useAxiosPublic"

const Register = () => {
  const { createUser, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const axiosPublic = useAxiosPublic();
  // Location state for country-state-city
  const [country, setCountry] = useState(null)
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      bloodGroup: "",
      password: "",
      confirmPassword: "",
      avatar: null,
      country: "",
      district: "",
      upazila: "",
    },
  })

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data)

      if (data.password !== data.confirmPassword) {
        setErrorMsg("Passwords do not match")
        return
      }

      setErrorMsg("")

      // Create user with Firebase first
      const result = await createUser(data.email, data.password)
      const loggedUser = result.user
      console.log("User created:", loggedUser)

      // Handle profile picture upload
      let photoURL = null
      if (data.avatar && data.avatar[0]) {
        try {
          setUploading(true)
          const uploadResult = await uploadToImgBB(data.avatar[0])
          photoURL = uploadResult.url
          console.log("Image uploaded successfully:", photoURL)
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError)
          toast.error(`Image upload failed: ${uploadError.message}`)
          // Continue without photo
        } finally {
          setUploading(false)
        }
      }

      // Update Firebase user profile
      if (data.name || photoURL) {
        await updateUserProfile(data.name || null, photoURL || null)
        console.log("Profile updated successfully")
      }

      // Save user data to your database (if you have a backend)
      const userData = {
        uid: loggedUser.uid,
        name: data.name,
        email: data.email,
        bloodGroup: data.bloodGroup,
        country: country?.name || "",
        district: state?.name || "",
        upazila: city?.name || "",
        photoURL: photoURL || "",
        role: "", 
        lastDonation: null,
        availability: "Available",
        status: "active",
        createdAt: new Date().toISOString(),
      }

      // If you have a backend API, save user data
      try {
        await axiosPublic.post('/users', userData)
        console.log('User data saved to database')
      } catch (dbError) {
        console.error('Database save error:', dbError)
      }

      toast.success("Account created successfully!")
      reset()
      setAvatarPreview(null)
      navigate("/")
    } catch (error) {
      console.error("Registration error:", error)
      setErrorMsg(error.message || "Registration failed. Please try again.")
      toast.error(error.message || "Registration failed")
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (ImgBB free limit is 32MB, but we'll use 5MB for better UX)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      // Set preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Update form value
      setValue("avatar", e.target.files)
    }
  }

  return (
    <>
      <Helmet>
        <title>Blood Center || Register</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Your Account</h2>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{errorMsg}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>}
              </div>

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
            </div>

            {/* Row 2: Blood Group and Avatar */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Blood Group Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Blood Group *</label>
                <select
                  {...register("bloodGroup", { required: "Blood group is required" })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.bloodGroup.message}</span>
                )}
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Profile Picture (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>

                {avatarPreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(null)
                        setValue("avatar", null)
                      }}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {uploading && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">Uploading to ImgBB...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Location Fields */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location *</label>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Country */}
                <div>
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <CountrySelect
                        containerClassName="form-group"
                        inputClassName="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        onChange={(val) => {
                          setCountry(val)
                          setState(null)
                          setCity(null)
                          field.onChange(val?.name || "")
                        }}
                        placeHolder="Select Country"
                      />
                    )}
                  />
                  {errors.country && <span className="text-red-500 text-sm mt-1 block">{errors.country.message}</span>}
                </div>

                {/* District (State) */}
                <div>
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: "District is required" }}
                    render={({ field }) => (
                      <StateSelect
                        countryid={country?.id}
                        onChange={(val) => {
                          setState(val)
                          setCity(null)
                          field.onChange(val?.name || "")
                        }}
                        inputClassName="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        placeHolder="Select District"
                      />
                    )}
                  />
                  {errors.district && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.district.message}</span>
                  )}
                </div>

                {/* Upazila (City) */}
                <div>
                  <Controller
                    name="upazila"
                    control={control}
                    // rules={{ required: "Upazila is required" }}
                    render={({ field }) => (
                      <CitySelect
                        countryid={country?.id}
                        stateid={state?.id}
                        onChange={(val) => {
                          setCity(val)
                          field.onChange(val?.name || "")
                        }}
                        inputClassName="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                        placeHolder="Select Upazila"
                      />
                    )}
                  />
                  {errors.upazila && <span className="text-red-500 text-sm mt-1 block">{errors.upazila.message}</span>}
                </div>
              </div>
            </div>

            {/* Row 4: Password Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Password *</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="Enter your password"
                />
                {errors.password && <span className="text-red-500 text-sm mt-1 block">{errors.password.message}</span>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1 block">{errors.confirmPassword.message}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full bg-red-600 text-white p-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isSubmitting ? "Creating Account..." : uploading ? "Uploading Image..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?
            <Link to={"/login"} className="text-red-600 hover:text-red-700 font-medium ml-1">
              Sign In
            </Link>
          </p>

          {/* Social Login */}
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">Or sign up with</p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                aria-label="Sign up with Google"
                className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                  <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                </svg>
              </button>
              <button
                type="button"
                aria-label="Sign up with GitHub"
                className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                  <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
