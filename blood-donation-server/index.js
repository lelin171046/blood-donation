require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blood-donation-server-steel.vercel.app" // Replace with your actual frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const usersCollection = client.db("bloodDonationDB").collection("users");
    const donationRequestCollection = client.db("bloodDonationDB").collection("donationRequest");

    // Middleware: Verify JWT token
    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // Middleware: Verify Admin Role
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });
      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // JWT Token
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
      res.send({ token });
    });

    // Check Admin
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "unauthorized access" });
      }
      const user = await usersCollection.findOne({ email });
      res.send({ admin: user?.role === "admin" });
    });

    // Create User
    app.post("/users", async (req, res) => {
      const user = req.body;
      const existing = await usersCollection.findOne({ email: user.email });
      if (existing) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get All Users
    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Make Admin
    app.patch("/users/admin/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: "admin" } }
      );
      res.send(result);
    });

    // Make Volunteer
    app.patch("/users/volunteer/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: "volunteer" } }
      );
      res.send(result);
    });

    // Block/Activate User
    app.patch("/users/status/:email", verifyToken, verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const { status } = req.body;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { status } }
      );
      res.send(result);
    });

    // Create Donation Request
    app.post("/api/donation-requests", verifyToken, async (req, res) => {
      const request = req.body;
      const result = await donationRequestCollection.insertOne(request);
      res.send(result);
    });

    // Get All Donation Requests (Admin only)
    app.get("/api/donation-requests/all", verifyToken, verifyAdmin, async (req, res) => {
      const result = await donationRequestCollection.find().toArray();
      res.send(result);
    });

    // Get Donation Requests by User
    app.get("/api/my-donation-requests/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "unauthorized access" });
      }
      const result = await donationRequestCollection.find({ requesterEmail: email }).toArray();
      res.send(result);
    });

    // Delete Donation Request
    app.delete("/api/my-donation-requests/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await donationRequestCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Get Donation Request by ID
    app.get("/api/donation-requests/:id", async (req, res) => {
      const id = req.params.id;
      const result = await donationRequestCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Update Donation Request Status
    app.patch("/api/donation-requests/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const result = await donationRequestCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status || "In progress" } }
      );
      res.send(result);
    });

    // Ping DB
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ DB Connection Error", err);
  }
}

run();

// Root
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});