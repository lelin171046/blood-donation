require("dotenv").config()
const express = require("express")
const cors = require("cors")
const multer = require("multer")
const axios = require("axios")
const FormData = require("form-data")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
const uri = `mongodb+srv://blood-donation:ZE4Jvs7T9e35vggm@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Database collections
let usersCollection
let donationRequestsCollection

async function connectDB() {
  try {
    await client.connect()
    console.log("Connected to MongoDB!")

    const db = client.db("bloodDonationDB")
    usersCollection = db.collection("users")
    donationRequestsCollection = db.collection("donationRequests")

    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ bloodGroup: 1 })
    await usersCollection.createIndex({ district: 1 })
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}

// Image upload endpoint
app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" })
    }

    // Create form data for ImgBB
    const formData = new FormData()
    formData.append("image", req.file.buffer.toString("base64"))
    formData.append("key", process.env.IMGBB_API_KEY)

    // Upload to ImgBB
    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })

    if (response.data.success) {
      res.json({
        success: true,
        imageUrl: response.data.data.url,
        deleteUrl: response.data.data.delete_url,
      })
    } else {
      throw new Error("ImgBB upload failed")
    }
  } catch (error) {
    console.error("Image upload error:", error)
    res.status(500).json({
      error: "Image upload failed",
      details: error.message,
    })
  }
})

// User registration endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const userData = req.body

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: userData.email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" })
    }

    // Add timestamp
    userData.createdAt = new Date()
    userData.updatedAt = new Date()
    userData.status = "active"

    // Insert user
    const result = await usersCollection.insertOne(userData)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("User registration error:", error)
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    })
  }
})

// Get user profile
app.get("/api/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params
    const user = await usersCollection.findOne({ uid })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Remove sensitive information
    const { password, ...userProfile } = user
    res.json(userProfile)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Failed to get user profile" })
  }
})

// Search donors endpoint
app.get("/api/donors/search", async (req, res) => {
  try {
    const { bloodGroup, district, upazila } = req.query

    // Build search query
    const searchQuery = { status: "active" }

    if (bloodGroup) searchQuery.bloodGroup = bloodGroup
    if (district) searchQuery.district = district
    if (upazila) searchQuery.upazila = upazila

    const donors = await usersCollection
      .find(searchQuery)
      .project({
        name: 1,
        bloodGroup: 1,
        district: 1,
        upazila: 1,
        photoURL: 1,
        lastDonation: 1,
        availability: 1,
        phone: 1,
      })
      .toArray()

    res.json({
      success: true,
      donors,
      count: donors.length,
    })
  } catch (error) {
    console.error("Search donors error:", error)
    res.status(500).json({ error: "Search failed" })
  }
})

// Get donation requests
app.get("/api/donation-requests", async (req, res) => {
  try {
    const { status = "pending" } = req.query

    const requests = await donationRequestsCollection.find({ status }).sort({ createdAt: -1 }).toArray()

    res.json({
      success: true,
      requests,
      count: requests.length,
    })
  } catch (error) {
    console.error("Get donation requests error:", error)
    res.status(500).json({ error: "Failed to get donation requests" })
  }
})

// Create donation request
app.post("/api/donation-requests", async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await donationRequestsCollection.insertOne(requestData)

    res.status(201).json({
      success: true,
      message: "Donation request created successfully",
      requestId: result.insertedId,
    })
  } catch (error) {
    console.error("Create donation request error:", error)
    res.status(500).json({ error: "Failed to create donation request" })
  }
})

// Get single donation request
app.get("/api/donation-requests/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid request ID" })
    }

    const request = await donationRequestsCollection.findOne({ _id: new ObjectId(id) })

    if (!request) {
      return res.status(404).json({ error: "Donation request not found" })
    }

    res.json({
      success: true,
      request,
    })
  } catch (error) {
    console.error("Get donation request error:", error)
    res.status(500).json({ error: "Failed to get donation request" })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 5MB." })
    }
  }

  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// Start server
async function startServer() {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startServer().catch(console.error)

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...")
  await client.close()
  process.exit(0)
})
