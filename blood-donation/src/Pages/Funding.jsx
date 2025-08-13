"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  Plus,
  Search,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
} from "lucide-react"
import useAuth from "@/Hook/useAuth"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import GiveFundModal from "./GiveFundModal"
import useAxiosSecure from "@/Hook/useAxiosSecure"

const Funding = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [funds, setFunds] = useState([])
  const [filteredFunds, setFilteredFunds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [amountFilter, setAmountFilter] = useState("all")
  const [showGiveFundModal, setShowGiveFundModal] = useState(false)
const axiosSecure = useAxiosSecure()
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Stats state
  const [stats, setStats] = useState({
    totalFunds: 0,
    totalDonors: 0,
    averageDonation: 0,
    thisMonthFunds: 0,
  })

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/funding",
          message: "Please log in to access the funding page",
        },
      })
      return
    }
  }, [user, navigate])

  // Mock funding data - replace with actual API call


  useEffect(() => {
    const fetchFunds = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        const response = await axiosSecure.get('/payments-history', {
          // headers: { Authorization: `Bearer ${user.token}` }
        })
        setFunds(response.data)

        await new Promise((resolve) => setTimeout(resolve, 1000))
        // setFunds(mockFunds)
        setFilteredFunds(response.data)

        // Calculate stats
        const totalAmount = response.data.reduce((sum, fund) => sum + fund.amount, 0)
        const uniqueDonors = new Set(mockFunds.map((fund) => fund.donorId)).size
        const averageAmount = totalAmount / mockFunds.length

        // This month's funds (mock calculation)
        const thisMonth = response.data
          .filter((fund) => {
            const fundDate = new Date(fund.fundingDate)
            const now = new Date()
            return fundDate.getMonth() === now.getMonth() && fundDate.getFullYear() === now.getFullYear()
          })
          .reduce((sum, fund) => sum + fund.amount, 0)

        setStats({
          totalFunds: totalAmount,
          totalDonors: uniqueDonors,
          averageDonation: averageAmount,
          thisMonthFunds: thisMonth,
        })
      } catch (error) {
        console.error("Failed to fetch funds:", error)
        toast.error("Failed to load funding data")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchFunds()
    }
  }, [user])

  // Filter and search functionality
  useEffect(() => {
    let filtered = funds

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (fund) =>
          fund.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.donorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.transactionId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      filtered = filtered.filter((fund) => {
        const fundDate = new Date(fund.fundingDate)
        switch (dateFilter) {
          case "today":
            return fundDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return fundDate >= weekAgo
          case "month":
            return fundDate.getMonth() === now.getMonth() && fundDate.getFullYear() === now.getFullYear()
          case "year":
            return fundDate.getFullYear() === now.getFullYear()
          default:
            return true
        }
      })
    }

    // Amount filter
    if (amountFilter !== "all") {
      filtered = filtered.filter((fund) => {
        switch (amountFilter) {
          case "small":
            return fund.amount < 2000
          case "medium":
            return fund.amount >= 2000 && fund.amount < 5000
          case "large":
            return fund.amount >= 5000 && fund.amount < 10000
          case "xlarge":
            return fund.amount >= 10000
          default:
            return true
        }
      })
    }

    setFilteredFunds(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [searchQuery, dateFilter, amountFilter, funds])

  // Pagination logic
  const totalPages = Math.ceil(filteredFunds.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFunds = filteredFunds.slice(startIndex, endIndex)

  const formatCurrency = (amount, currency = "BDT") => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleExportData = () => {
    // Create CSV content
    const headers = ["Donor Name", "Email", "Amount", "Date", "Payment Method", "Transaction ID", "Message"]
    const csvContent = [
      headers.join(","),
      ...filteredFunds.map((fund) =>
        [
          `"${fund.donorName}"`,
          `"${fund.donorEmail}"`,
          fund.amount,
          `"${formatDate(fund.fundingDate)}"`,
          `"${fund.paymentMethod}"`,
          `"${fund.transactionId}"`,
          `"${fund.message || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `funding-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success("Funding data exported successfully!")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">Please log in to access the funding page.</p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading funding data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Funding Management</h1>
            <p className="text-gray-600">Track and manage all funding contributions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2 bg-transparent">
              <Download size={16} />
              Export Data
            </Button>
            <Button
              onClick={() => setShowGiveFundModal(true)}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Give Fund
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funds</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalFunds)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDonors}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Donation</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageDonation)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.thisMonthFunds)}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by donor name, email, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>

                <select
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent"
                >
                  <option value="all">All Amounts</option>
                  <option value="small">Under ৳2,000</option>
                  <option value="medium">৳2,000 - ৳5,000</option>
                  <option value="large">৳5,000 - ৳10,000</option>
                  <option value="xlarge">Above ৳10,000</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredFunds.length)} of {filteredFunds.length} funding
              records
            </div>
          </CardContent>
        </Card>

        {/* Funding Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Funding Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Donor</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                    {/* <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th> */}
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Payment Method</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Transaction ID</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Message</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentFunds.map((fund) => (
                    <tr key={fund.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{fund.donorName}</div>
                          <div className="text-sm text-gray-500">{fund.donorEmail}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-green-600">{formatCurrency(fund.amount)}</div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {fund.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{fund.transactionId}</code>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={fund.message}>
                          {fund.message || "No message"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                          <Eye size={14} />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Give Fund Modal */}
        {showGiveFundModal && (
          <GiveFundModal
            isOpen={showGiveFundModal}
            onClose={() => setShowGiveFundModal(false)}
            onSuccess={() => {
              setShowGiveFundModal(false)
              // Refresh funds data
              window.location.reload()
            }}
          />
        )}
      </div>
    </div>
  )
}



export default Funding
