"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Clock, ArrowRight, BookOpen, TrendingUp } from "lucide-react"

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()

  // Mock blog data - replace with actual API call
  const mockBlogs = [
    {
      id: 1,
      title: "The Importance of Regular Blood Donation: A Life-Saving Habit",
      slug: "importance-regular-blood-donation",
      excerpt:
        "Discover why regular blood donation is crucial for maintaining adequate blood supplies and how it benefits both donors and recipients. Learn about the health benefits and community impact.",
      content: `
        <h2>Why Regular Blood Donation Matters</h2>
        <p>Blood donation is one of the most selfless acts a person can perform. Every two seconds, someone in need requires blood, and regular donors are the backbone of our healthcare system.</p>
        
        <h3>Health Benefits for Donors</h3>
        <ul>
          <li>Regular health checkups and screenings</li>
          <li>Reduced risk of heart disease</li>
          <li>Lower blood pressure</li>
          <li>Improved cardiovascular health</li>
        </ul>
        
        <h3>Community Impact</h3>
        <p>A single blood donation can save up to three lives. Regular donors ensure that hospitals always have the blood supply they need for emergencies, surgeries, and treatments.</p>
        
        <h3>Getting Started</h3>
        <p>If you're considering becoming a regular blood donor, consult with your healthcare provider and visit your local blood donation center to learn about eligibility requirements.</p>
      `,
      author: "Dr. Sarah Ahmed",
      authorImage: "/placeholder.svg?height=40&width=40&text=SA",
      publishedAt: "2024-07-15T10:00:00Z",
      readTime: 5,
      category: "Health",
      tags: ["blood donation", "health", "community service"],
      image: "/placeholder.svg?height=300&width=600&text=Blood+Donation+Benefits",
      featured: true,
      views: 1250,
      likes: 89,
    },
    {
      id: 2,
      title: "Understanding Blood Types: What You Need to Know",
      slug: "understanding-blood-types",
      excerpt:
        "A comprehensive guide to blood types, compatibility, and why knowing your blood type is important for both donors and recipients.",
      content: `
        <h2>The ABO Blood Group System</h2>
        <p>The ABO blood group system is the most important blood-typing system in medicine. It consists of four main blood types: A, B, AB, and O.</p>
        
        <h3>Blood Type Compatibility</h3>
        <p>Understanding blood type compatibility is crucial for safe blood transfusions:</p>
        <ul>
          <li><strong>Type O-:</strong> Universal donor, can donate to all blood types</li>
          <li><strong>Type AB+:</strong> Universal recipient, can receive from all blood types</li>
          <li><strong>Type A:</strong> Can donate to A and AB, receive from A and O</li>
          <li><strong>Type B:</strong> Can donate to B and AB, receive from B and O</li>
        </ul>
        
        <h3>Rh Factor</h3>
        <p>The Rh factor is another important component of blood typing, determining whether blood is positive or negative.</p>
      `,
      author: "Dr. Mohammad Rahman",
      authorImage: "/placeholder.svg?height=40&width=40&text=MR",
      publishedAt: "2024-07-12T14:30:00Z",
      readTime: 7,
      category: "Education",
      tags: ["blood types", "medical education", "compatibility"],
      image: "/placeholder.svg?height=300&width=600&text=Blood+Types+Chart",
      featured: false,
      views: 980,
      likes: 67,
    },
    {
      id: 3,
      title: "Blood Donation Myths Debunked: Separating Fact from Fiction",
      slug: "blood-donation-myths-debunked",
      excerpt:
        "Common misconceptions about blood donation can prevent people from becoming donors. Let's address these myths with scientific facts.",
      content: `
        <h2>Common Blood Donation Myths</h2>
        <p>Many people avoid donating blood due to misconceptions. Let's debunk the most common myths:</p>
        
        <h3>Myth 1: Blood donation is painful</h3>
        <p><strong>Fact:</strong> The needle insertion feels like a quick pinch, and most donors report minimal discomfort during the process.</p>
        
        <h3>Myth 2: You can get diseases from donating blood</h3>
        <p><strong>Fact:</strong> All equipment is sterile and used only once. There is no risk of contracting diseases from donating blood.</p>
        
        <h3>Myth 3: Donating blood weakens your immune system</h3>
        <p><strong>Fact:</strong> Your body quickly replenishes donated blood, and regular donation may actually boost your immune system.</p>
        
        <h3>Myth 4: You need to be in perfect health to donate</h3>
        <p><strong>Fact:</strong> Most healthy adults can donate blood. Minor conditions like controlled blood pressure or diabetes don't disqualify you.</p>
      `,
      author: "Nurse Fatima Khan",
      authorImage: "/placeholder.svg?height=40&width=40&text=FK",
      publishedAt: "2024-07-10T09:15:00Z",
      readTime: 4,
      category: "Education",
      tags: ["myths", "facts", "education"],
      image: "/placeholder.svg?height=300&width=600&text=Myth+vs+Fact",
      featured: false,
      views: 756,
      likes: 45,
    },
    {
      id: 4,
      title: "Preparing for Your First Blood Donation: A Complete Guide",
      slug: "preparing-first-blood-donation",
      excerpt:
        "Everything you need to know before your first blood donation, from preparation tips to what to expect during and after the process.",
      content: `
        <h2>Before Your Donation</h2>
        <p>Proper preparation ensures a smooth and successful blood donation experience.</p>
        
        <h3>24 Hours Before</h3>
        <ul>
          <li>Get a good night's sleep (at least 7-8 hours)</li>
          <li>Stay well hydrated</li>
          <li>Avoid alcohol consumption</li>
          <li>Eat iron-rich foods</li>
        </ul>
        
        <h3>Day of Donation</h3>
        <ul>
          <li>Eat a healthy breakfast or lunch</li>
          <li>Drink plenty of water</li>
          <li>Bring valid ID and donor card (if you have one)</li>
          <li>Wear comfortable clothing with sleeves that can be rolled up</li>
        </ul>
        
        <h3>During the Donation</h3>
        <p>The entire process takes about 45-60 minutes, with the actual blood collection taking only 8-10 minutes.</p>
        
        <h3>After Donation</h3>
        <ul>
          <li>Rest for 10-15 minutes</li>
          <li>Enjoy the provided refreshments</li>
          <li>Avoid heavy lifting for the rest of the day</li>
          <li>Continue to drink plenty of fluids</li>
        </ul>
      `,
      author: "Dr. Ahmed Hassan",
      authorImage: "/placeholder.svg?height=40&width=40&text=AH",
      publishedAt: "2024-07-08T11:45:00Z",
      readTime: 6,
      category: "Guide",
      tags: ["first time", "preparation", "guide"],
      image: "/placeholder.svg?height=300&width=600&text=First+Donation+Guide",
      featured: true,
      views: 1100,
      likes: 78,
    },
    {
      id: 5,
      title: "The Global Impact of Blood Donation: Statistics and Stories",
      slug: "global-impact-blood-donation",
      excerpt:
        "Explore the worldwide impact of blood donation through compelling statistics and inspiring stories from around the globe.",
      content: `
        <h2>Blood Donation Worldwide</h2>
        <p>Blood donation is a global effort that saves millions of lives each year. Here are some compelling statistics and stories.</p>
        
        <h3>Global Statistics</h3>
        <ul>
          <li>118.5 million blood donations are collected worldwide annually</li>
          <li>Only 3% of age-eligible people donate blood yearly</li>
          <li>One blood donation can save up to 3 lives</li>
          <li>Every 2 seconds, someone needs blood</li>
        </ul>
        
        <h3>Regional Challenges</h3>
        <p>Different regions face unique challenges in maintaining adequate blood supplies, from infrastructure limitations to cultural barriers.</p>
        
        <h3>Success Stories</h3>
        <p>Countries like Denmark and Singapore have achieved remarkable donation rates through effective awareness campaigns and donor retention programs.</p>
        
        <h3>The Future</h3>
        <p>Emerging technologies and improved donation processes continue to make blood donation more accessible and efficient worldwide.</p>
      `,
      author: "Dr. Maria Santos",
      authorImage: "/placeholder.svg?height=40&width=40&text=MS",
      publishedAt: "2024-07-05T16:20:00Z",
      readTime: 8,
      category: "Research",
      tags: ["global impact", "statistics", "research"],
      image: "/placeholder.svg?height=300&width=600&text=Global+Blood+Donation",
      featured: false,
      views: 892,
      likes: 56,
    },
    {
      id: 6,
      title: "Technology in Blood Banking: Modern Innovations",
      slug: "technology-blood-banking-innovations",
      excerpt:
        "Discover how modern technology is revolutionizing blood banking, from collection to storage and distribution.",
      content: `
        <h2>Digital Transformation in Blood Banking</h2>
        <p>Technology is transforming every aspect of blood banking, making the process safer, more efficient, and more accessible.</p>
        
        <h3>Collection Innovations</h3>
        <ul>
          <li>Mobile blood collection units with GPS tracking</li>
          <li>Automated blood collection systems</li>
          <li>Real-time donor health monitoring</li>
          <li>Digital donor registration and scheduling</li>
        </ul>
        
        <h3>Storage and Testing</h3>
        <ul>
          <li>Advanced pathogen reduction technologies</li>
          <li>Automated blood typing and crossmatching</li>
          <li>Smart storage systems with temperature monitoring</li>
          <li>Blockchain for supply chain transparency</li>
        </ul>
        
        <h3>Distribution and Tracking</h3>
        <p>Modern blood banks use sophisticated inventory management systems to track blood products from donation to transfusion.</p>
        
        <h3>Future Prospects</h3>
        <p>Artificial blood substitutes and lab-grown blood cells represent the next frontier in blood banking technology.</p>
      `,
      author: "Dr. James Wilson",
      authorImage: "/placeholder.svg?height=40&width=40&text=JW",
      publishedAt: "2024-07-02T13:10:00Z",
      readTime: 9,
      category: "Technology",
      tags: ["technology", "innovation", "blood banking"],
      image: "/placeholder.svg?height=300&width=600&text=Blood+Banking+Tech",
      featured: false,
      views: 634,
      likes: 42,
    },
  ]

  const categories = ["all", "Health", "Education", "Guide", "Research", "Technology"]

  useEffect(() => {
    // Simulate API call
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        // const response = await axios.get('/api/blogs?status=published')
        // setBlogs(response.data.blogs)

        await new Promise((resolve) => setTimeout(resolve, 800))
        setBlogs(mockBlogs)
        setFilteredBlogs(mockBlogs)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    // Filter blogs based on search query and category
    let filtered = blogs

    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          blog.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredBlogs(filtered)
  }, [searchQuery, selectedCategory, blogs])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const featuredBlogs = filteredBlogs.filter((blog) => blog.featured)
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blood Donation Blog</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Stay informed with the latest insights, tips, and stories about blood donation and healthcare
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            {searchQuery || selectedCategory !== "all" ? (
              <p>
                Found {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
            ) : (
              <p>{blogs.length} articles available</p>
            )}
          </div>
        </div>

        {/* Featured Articles */}
        {featuredBlogs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  <div className="relative">
                    <img
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(blog.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {blog.readTime} min read
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={blog.authorImage || "/placeholder.svg"}
                          alt={blog.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{blog.views} views</span>
                        <span>{blog.likes} likes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        {regularBlogs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  <div className="relative">
                    <img
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(blog.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {blog.readTime} min
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={blog.authorImage || "/placeholder.svg"}
                          alt={blog.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-gray-700">{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{blog.views}</span>
                        <span>♥ {blog.likes}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-red-600 text-sm font-medium group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? `No articles match your search for "${searchQuery}"`
                : `No articles found in the ${selectedCategory} category`}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-red-800 mb-3">Stay Updated</h3>
            <p className="text-red-700 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest articles about blood donation, health tips, and
              community stories directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 border-red-300 focus:ring-red-400"
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Blog
