"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { districts, upazilas } from "@/components/ui/locationData"
import { MapPin, Phone, Calendar, User, Search, Users, Heart } from "lucide-react"

const SearchPage = () => {
  const [searchForm, setSearchForm] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  })
  const [donors, setDonors] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock donor data for demonstration - replace with actual API call
  const mockDonors = [
    {
      id: 1,
      name: "Ahmed Rahman",
      bloodGroup: "A+",
      district: "Dhaka",
      upazila: "Dhanmondi",
      phone: "+880 1712-345678",
      lastDonation: "2024-01-15",
      availability: "Available",
      profileImage: "/placeholder.svg?height=60&width=60&text=AR",
    },
    {
      id: 2,
      name: "Fatima Khatun",
      bloodGroup: "O+",
      district: "Chittagong",
      upazila: "Agrabad",
      phone: "+880 1812-345678",
      lastDonation: "2023-12-20",
      availability: "Available",
      profileImage: "/placeholder.svg?height=60&width=60&text=FK",
    },
    {
      id: 3,
      name: "Mohammad Ali",
      bloodGroup: "B+",
      district: "Rajshahi",
      upazila: "Boalia",
      phone: "+880 1912-345678",
      lastDonation: "2024-02-10",
      availability: "Available",
      profileImage: "/placeholder.svg?height=60&width=60&text=MA",
    },
    {
      id: 4,
      name: "Rashida Begum",
      bloodGroup: "A+",
      district: "Dhaka",
      upazila: "Gulshan",
      phone: "+880 1612-345678",
      lastDonation: "2024-01-28",
      availability: "Available",
      profileImage: "/placeholder.svg?height=60&width=60&text=RB",
    },
    {
      id: 5,
      name: "Abdul Karim",
      bloodGroup: "O+",
      district: "Dhaka",
      upazila: "Dhanmondi",
      phone: "+880 1512-345678",
      lastDonation: "2024-02-05",
      availability: "Available",
      profileImage: "/placeholder.svg?height=60&width=60&text=AK",
    },
    {
      id: 6,
      name: "Nasir Ahmed",
      bloodGroup: "AB+",
      district: "Chittagong",
      upazila: "Nasirabad",
      phone: "+880 1412-345678",
      lastDonation: "2024-01-20",
      availability: "Available",
      profileImage: "/placeholder.svg?height=60&width=60&text=NA",
    },
  ]

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleInputChange = (field, value) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
      // Reset upazila when district changes
      ...(field === "district" && { upazila: "" }),
    }))
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setHasSearched(true)

    // Simulate API call
    setTimeout(() => {
      // Filter mock data based on search criteria
      const filteredDonors = mockDonors.filter((donor) => {
        return (
          (!searchForm.bloodGroup || donor.bloodGroup === searchForm.bloodGroup) &&
          (!searchForm.district || donor.district === searchForm.district) &&
          (!searchForm.upazila || donor.upazila === searchForm.upazila)
        )
      })

      setDonors(filteredDonors)
      setIsLoading(false)
    }, 1000)
  }

  const resetSearch = () => {
    setSearchForm({ bloodGroup: "", district: "", upazila: "" })
    setDonors([])
    setHasSearched(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Blood Donors</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for blood donors in your area. Connect with generous donors who can help save lives.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-red-50 border-b">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Search size={24} />
              Search for Donors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Blood Group */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Heart size={16} className="text-red-500" />
                    Blood Group *
                  </label>
                  <select
                    value={searchForm.bloodGroup}
                    onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    District *
                  </label>
                  <select
                    value={searchForm.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin size={16} className="text-green-500" />
                    Upazila
                  </label>
                  <select
                    value={searchForm.upazila}
                    onChange={(e) => handleInputChange("upazila", e.target.value)}
                    disabled={!searchForm.district}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Upazila (Optional)</option>
                    {searchForm.district &&
                      upazilas[searchForm.district]?.map((upazila) => (
                        <option key={upazila} value={upazila}>
                          {upazila}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Search Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !searchForm.bloodGroup || !searchForm.district}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Search Donors
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetSearch}
                  className="px-8 py-3 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users size={24} />
                Search Results ({donors.length} donors found)
              </h2>
            </div>

            {donors.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="text-gray-500 text-lg mb-4">
                    <Users size={48} className="mx-auto mb-4 text-gray-400" />
                    No donors found matching your criteria
                  </div>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or search in nearby areas.</p>
                  <Button
                    onClick={resetSearch}
                    variant="outline"
                    className="bg-transparent border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Try New Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <Card
                    key={donor.id}
                    className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Donor Profile */}
                        <div className="flex items-center gap-4">
                          <img
                            src={donor.profileImage || "/placeholder.svg"}
                            alt={donor.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <User size={18} />
                              {donor.name}
                            </h3>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                                {donor.bloodGroup}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-blue-500" />
                          <span className="text-sm">
                            {donor.upazila}, {donor.district}
                          </span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} className="text-green-500" />
                          <a href={`tel:${donor.phone}`} className="text-sm hover:text-red-600 transition-colors">
                            {donor.phone}
                          </a>
                        </div>

                        {/* Last Donation */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-purple-500" />
                          <span className="text-sm">Last donated: {donor.lastDonation}</span>
                        </div>

                        {/* Availability Status */}
                        <div className="pt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ● {donor.availability}
                          </span>
                        </div>

                        {/* Contact Button */}
                        <div className="pt-4 space-y-2">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                            <Phone size={16} className="mr-2" />
                            Contact Donor
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial State - No Search Performed */}
        {!hasSearched && (
          <Card className="text-center py-16 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent>
              <div className="max-w-md mx-auto">
                <Search size={64} className="mx-auto mb-6 text-red-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Find Donors?</h3>
                <p className="text-gray-600 mb-6">
                  Fill out the search form above with your required blood group and location to find available donors in
                  your area.
                </p>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-gray-900 mb-2">Search Tips:</h4>
                  <ul className="text-sm text-gray-600 text-left space-y-1">
                    <li>• Blood group and district are required fields</li>
                    <li>• Upazila is optional but helps narrow results</li>
                    <li>• Try nearby districts if no results found</li>
                    <li>• Contact donors directly via phone</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-3">Want to Become a Donor?</h3>
            <p className="mb-6 max-w-2xl mx-auto opacity-90">
              Join our community of life-savers. Register as a blood donor and help save lives in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3">Register as Donor</Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SearchPage
