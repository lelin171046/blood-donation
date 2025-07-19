"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  BookOpen,
  Tag,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react"
import toast from "react-hot-toast"

const BlogDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // Mock blog data - replace with actual API call
  const mockBlogs = {
    "importance-regular-blood-donation": {
      id: 1,
      title: "The Importance of Regular Blood Donation: A Life-Saving Habit",
      slug: "importance-regular-blood-donation",
      excerpt:
        "Discover why regular blood donation is crucial for maintaining adequate blood supplies and how it benefits both donors and recipients. Learn about the health benefits and community impact.",
      content: `
        <div class="prose prose-lg max-w-none">
          <h2>Why Regular Blood Donation Matters</h2>
          <p>Blood donation is one of the most selfless acts a person can perform. Every two seconds, someone in need requires blood, and regular donors are the backbone of our healthcare system. The demand for blood is constant, but the supply often falls short, making regular donors absolutely essential.</p>
          
          <p>When you become a regular blood donor, you're not just giving blood once – you're making a commitment to save lives on an ongoing basis. This consistency is what allows blood banks to maintain adequate supplies and respond to emergencies effectively.</p>
          
          <h3>Health Benefits for Donors</h3>
          <p>While the primary motivation for blood donation should be helping others, donors also receive significant health benefits:</p>
          <ul>
            <li><strong>Regular health checkups and screenings:</strong> Every time you donate, you receive a mini-physical exam and blood tests that can detect potential health issues early.</li>
            <li><strong>Reduced risk of heart disease:</strong> Regular blood donation helps reduce iron levels in the blood, which can lower the risk of heart disease and stroke.</li>
            <li><strong>Lower blood pressure:</strong> Studies have shown that regular blood donation can help maintain healthy blood pressure levels.</li>
            <li><strong>Improved cardiovascular health:</strong> The process of donating blood stimulates the production of new blood cells, keeping your cardiovascular system healthy.</li>
            <li><strong>Calorie burning:</strong> Donating blood burns approximately 650 calories as your body works to replenish the donated blood.</li>
          </ul>
          
          <h3>Community Impact</h3>
          <p>The impact of regular blood donation extends far beyond individual health benefits. Here's how your donations make a difference:</p>
          
          <p><strong>Emergency Preparedness:</strong> Hospitals need a constant supply of blood for emergency situations. Car accidents, natural disasters, and other emergencies can create sudden spikes in demand that can only be met if there's an adequate supply on hand.</p>
          
          <p><strong>Surgical Procedures:</strong> Many surgical procedures require blood transfusions. From routine surgeries to complex operations, having blood available can mean the difference between life and death.</p>
          
          <p><strong>Cancer Treatment:</strong> Cancer patients often need regular blood transfusions as part of their treatment. Regular donors help ensure these patients can continue their fight against cancer.</p>
          
          <p><strong>Chronic Conditions:</strong> Patients with conditions like sickle cell disease, thalassemia, and other blood disorders rely on regular transfusions to maintain their health.</p>
          
          <h3>The Numbers Don't Lie</h3>
          <p>Consider these compelling statistics:</p>
          <ul>
            <li>A single blood donation can save up to three lives</li>
            <li>Every two seconds, someone in the United States needs blood</li>
            <li>Only 3% of age-eligible people donate blood yearly</li>
            <li>One in seven people entering a hospital needs blood</li>
            <li>Blood cannot be manufactured – it can only come from generous donors</li>
          </ul>
          
          <h3>Getting Started as a Regular Donor</h3>
          <p>If you're considering becoming a regular blood donor, here's what you need to know:</p>
          
          <p><strong>Eligibility Requirements:</strong> Most healthy adults aged 17-65 (or older in some states) who weigh at least 110 pounds can donate blood. However, specific requirements may vary, so it's best to check with your local blood center.</p>
          
          <p><strong>Frequency:</strong> You can donate whole blood every 56 days (8 weeks). This gives your body time to fully replenish the donated blood.</p>
          
          <p><strong>Preparation:</strong> Before donating, make sure to eat a healthy meal, stay hydrated, and get a good night's sleep. Avoid alcohol for 24 hours before donation.</p>
          
          <p><strong>What to Expect:</strong> The entire process takes about an hour, but the actual blood collection only takes 8-10 minutes. You'll have a brief health screening, then donate, and finally rest and enjoy refreshments.</p>
          
          <h3>Making It a Habit</h3>
          <p>The key to becoming a successful regular donor is making it a habit. Here are some tips:</p>
          <ul>
            <li>Schedule your next appointment before you leave the donation center</li>
            <li>Set reminders on your phone or calendar</li>
            <li>Find a donation center that's convenient to your home or work</li>
            <li>Consider it part of your regular health routine, like annual check-ups</li>
            <li>Bring a friend – donating together can make it more enjoyable and help both of you stay committed</li>
          </ul>
          
          <h3>Overcoming Common Concerns</h3>
          <p>Many people have concerns about blood donation that prevent them from starting. Let's address the most common ones:</p>
          
          <p><strong>"It's painful":</strong> Most donors report that the needle insertion feels like a quick pinch, and there's minimal discomfort during the actual donation.</p>
          
          <p><strong>"I don't have time":</strong> The entire process takes about an hour, and many donation centers offer flexible scheduling, including evening and weekend hours.</p>
          
          <p><strong>"I'm afraid of needles":</strong> This is understandable, but many people find that the knowledge they're saving lives helps them overcome this fear. The staff is also trained to help nervous donors feel comfortable.</p>
          
          <p><strong>"I might get sick":</strong> All equipment is sterile and used only once. There's no risk of contracting diseases from donating blood.</p>
          
          <h3>The Ripple Effect</h3>
          <p>When you become a regular blood donor, you often inspire others to do the same. Your commitment can create a ripple effect in your community, encouraging friends, family members, and colleagues to also become donors. This multiplier effect is one of the most powerful aspects of regular blood donation.</p>
          
          <h3>Conclusion</h3>
          <p>Regular blood donation is more than just a good deed – it's a life-saving habit that benefits both donors and recipients. The health benefits you receive, combined with the knowledge that you're helping save lives, make blood donation one of the most rewarding activities you can participate in.</p>
          
          <p>If you're not already a regular donor, consider making your first appointment today. If you are a regular donor, thank you for your commitment to saving lives. Your generosity makes a difference every single day.</p>
          
          <p>Remember, blood cannot be manufactured or stored indefinitely. The only source is generous donors like you. By making regular blood donation a habit, you're ensuring that blood will be available when someone needs it most – and that someone could be anyone, including your own family members.</p>
        </div>
      `,
      author: "Dr. Sarah Ahmed",
      authorBio:
        "Dr. Sarah Ahmed is a hematologist with over 15 years of experience in blood banking and transfusion medicine. She currently serves as the Medical Director at the National Blood Center.",
      authorImage: "/placeholder.svg?height=80&width=80&text=SA",
      publishedAt: "2024-07-15T10:00:00Z",
      updatedAt: "2024-07-15T10:00:00Z",
      readTime: 12,
      category: "Health",
      tags: ["blood donation", "health", "community service", "regular donation"],
      image: "/placeholder.svg?height=400&width=800&text=Blood+Donation+Benefits",
      featured: true,
      views: 1250,
      likes: 89,
      comments: 23,
    },
    // Add other blog entries here...
  }

  const mockRelatedBlogs = [
    {
      id: 2,
      title: "Understanding Blood Types: What You Need to Know",
      slug: "understanding-blood-types",
      excerpt: "A comprehensive guide to blood types, compatibility, and why knowing your blood type is important.",
      image: "/placeholder.svg?height=200&width=300&text=Blood+Types",
      readTime: 7,
      publishedAt: "2024-07-12T14:30:00Z",
    },
    {
      id: 4,
      title: "Preparing for Your First Blood Donation: A Complete Guide",
      slug: "preparing-first-blood-donation",
      excerpt: "Everything you need to know before your first blood donation, from preparation tips to what to expect.",
      image: "/placeholder.svg?height=200&width=300&text=First+Donation",
      readTime: 6,
      publishedAt: "2024-07-08T11:45:00Z",
    },
    {
      id: 3,
      title: "Blood Donation Myths Debunked: Separating Fact from Fiction",
      slug: "blood-donation-myths-debunked",
      excerpt: "Common misconceptions about blood donation can prevent people from becoming donors.",
      image: "/placeholder.svg?height=200&width=300&text=Myths+Facts",
      readTime: 4,
      publishedAt: "2024-07-10T09:15:00Z",
    },
  ]

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        // const response = await axios.get(`/api/blogs/${slug}`)
        // setBlog(response.data.blog)
        // setRelatedBlogs(response.data.relatedBlogs)

        await new Promise((resolve) => setTimeout(resolve, 800))

        const blogData = mockBlogs[slug]
        if (blogData) {
          setBlog(blogData)
          setLikeCount(blogData.likes)
          setRelatedBlogs(mockRelatedBlogs)
        } else {
          throw new Error("Blog not found")
        }
      } catch (error) {
        console.error("Failed to fetch blog details:", error)
        navigate("/blog")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogDetails()
  }, [slug, navigate])

  const handleLike = async () => {
    try {
      // Replace with actual API call
      // await axios.post(`/api/blogs/${blog.id}/like`)

      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      toast.success(isLiked ? "Like removed" : "Article liked!")
    } catch (error) {
      console.error("Failed to like article:", error)
      toast.error("Failed to like article")
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = blog?.title || ""
    const text = blog?.excerpt || ""

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank",
        )
        break
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
          "_blank",
        )
        break
      case "copy":
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
        break
      default:
        if (navigator.share) {
          navigator.share({ title, text, url })
        }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Link to="/blog" className="inline-flex items-center text-white hover:text-red-200 font-medium">
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Blog
                </Link>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                {blog.featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{blog.title}</h1>
              <p className="text-xl text-gray-200 mb-6 max-w-3xl">{blog.excerpt}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Meta */}
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={blog.authorImage || "/placeholder.svg"}
                      alt={blog.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{blog.author}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(blog.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {blog.readTime} min read
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      {blog.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      {blog.comments}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={`flex items-center gap-1 ${isLiked ? "text-red-600 border-red-600" : ""}`}
                    >
                      <Heart size={16} className={isLiked ? "fill-current" : ""} />
                      {likeCount}
                    </Button>

                    <div className="relative group">
                      <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                        <Share2 size={16} />
                        Share
                      </Button>
                      <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShare("facebook")}
                            className="p-2 hover:bg-blue-50 rounded text-blue-600"
                          >
                            <Facebook size={16} />
                          </button>
                          <button
                            onClick={() => handleShare("twitter")}
                            className="p-2 hover:bg-blue-50 rounded text-blue-400"
                          >
                            <Twitter size={16} />
                          </button>
                          <button
                            onClick={() => handleShare("linkedin")}
                            className="p-2 hover:bg-blue-50 rounded text-blue-700"
                          >
                            <Linkedin size={16} />
                          </button>
                          <button
                            onClick={() => handleShare("copy")}
                            className="p-2 hover:bg-gray-50 rounded text-gray-600"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={18} className="text-red-600" />
                  <h3 className="font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-700 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Author Bio */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={blog.authorImage || "/placeholder.svg"}
                    alt={blog.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">About {blog.author}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{blog.authorBio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <div
                      key={relatedBlog.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={relatedBlog.image || "/placeholder.svg"}
                          alt={relatedBlog.title}
                          className="w-16 h-16 rounded object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock size={12} />
                            {relatedBlog.readTime} min
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-red-800 mb-2">Stay Updated</h3>
                <p className="text-red-700 text-sm mb-4">
                  Get the latest articles about blood donation and health delivered to your inbox.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700">Subscribe</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails
