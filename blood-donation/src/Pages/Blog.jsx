"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Clock, ArrowRight, BookOpen, TrendingUp } from "lucide-react"
import axios from "axios"
import useAxiosPublic from "@/Hook/useAxiosPublic"
import { useQuery } from "@tanstack/react-query"

const Blog = () => {
  // const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  // const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()
  const axiosPublic = useAxiosPublic();


  const categories = ["all", "Health", "Education", "Guide", "Research", "Technology"]
 const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ["blogs"], // cache key
    queryFn: async () => {
      const res = await axiosPublic.get("/all-blogs");
      return res.data; // must return the actual array
    },
  });

  // useEffect(() => {
  //   // Simulate API call
  //   const fetchBlogs = async () => {
  //     setIsLoading(true)
  //     try {
  //       // Replace with actual API call
  //       const response = await axiosPublic.get('/all-blogs')
  //       setBlogs(response)
  //       console.log(blogs, 'my')

  //       await new Promise((resolve) => setTimeout(resolve, 800))
  //       setBlogs(response)
  //       setFilteredBlogs(response)
  //     } catch (error) {
  //       console.error("Failed to fetch blogs:", error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchBlogs()
  // }, [])

  // useEffect(() => {
  //   // Filter blogs based on search query and category
  //   let filtered = blogs

  //   if (selectedCategory !== "all") {
  //     filtered = filtered.filter((blog) => blog.category === selectedCategory)
  //   }

  //   if (searchQuery.trim()) {
  //     filtered = filtered.filter(
  //       (blog) =>
  //         blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //         blog.author.toLowerCase().includes(searchQuery.toLowerCase()),
  //     )
  //   }

  //   setFilteredBlogs(filtered)
  // }, [searchQuery, selectedCategory, blogs])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // const featuredBlogs = filteredBlogs.filter((blog) => blog.featured)
  // const regularBlogs = filteredBlogs.filter((blog) => !blog.featured)

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
        {blogs?.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {blogs?.map((blog) => (
                <Card
                  key={blog.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  <div className="relative">
                    <img
                      src={blog.thumbnail || "/placeholder.svg"}
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
                        {formatDate(blog.createdAt)}
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
        {blogs?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            </div>

            {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs?.map((blog) => (
                <Card
                  key={blog.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  <div className="relative">
                    <img
                      src={blog.
thumbnail || "/placeholder.svg"}
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
            </div> */}
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
