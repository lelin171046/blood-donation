require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe  = require("stripe")(process.env.Payment_Secret_Key)

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blood-donation-e5309.web.app",
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
    const donationBlogCollection = client.db("bloodDonationDB").collection("donationBlog")
    const paymentCollection = client.db("bloodDonationDB").collection("donationPayment")

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

    // Middleware: Verify Volunteer Role
    const verifyVolunteer = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });
      if (!user || user.role !== "volunteer" || "admin" ) {
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

      // Check volunteer
    app.get("/users/volunteer/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "unauthorized access" });
      }
      const user = await usersCollection.findOne({ email });
      const result = { volunteer: user?.role === "volunteer" }
      console.log(result);
      res.send(result);
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
    app.get("/users", verifyToken, verifyVolunteer, async (req, res) => {
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
    app.post("/api/donation-requests", verifyToken, verifyVolunteer, async (req, res) => {
      const request = req.body;
      const result = await donationRequestCollection.insertOne(request);
      res.send(result);
    });

    // Get All Donation Requests (Admin only)
    app.get("/api/donation-requests/all", verifyToken, async (req, res) => {
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

    // Update donation status to "in progress"
app.patch("/api/donation-requests/:id/donate", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { donorId, donorName, donorEmail, status } = req.body;

  try {
    const result = await donationRequestCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          donorId,
          donorName,
          donorEmail,
          status: status || "in progress",
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Donation request not found or already updated." });
    }

    res.send({ message: "Donation status updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).send({ message: "Failed to update donation status" });
  }
});

//Find the donor donation by email
app.get('/donation/:email', async (req, res)=>{
  const email = req.params.email;
  console.log(email);
  const query = {donorEmail: email};
  const result = await donationRequestCollection.find(query).toArray()
  // console.log(result);
  res.send(result)
})

///add blog

  app.post("/add-blog", verifyToken, verifyVolunteer, async (req, res) => {
      const request = req.body;
      const result = await donationBlogCollection.insertOne(request);
      res.send(result);
    });
//get blogs===========
app.get('/all-blogs', async (req, res)=>{
  const result = await donationBlogCollection.find().toArray()
  res.send(result)
})
//blog details
 app.get("/all-blogs/:id", async (req, res) => {
      const id = req.params.id;
      const result = await donationBlogCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
/// Delete blog--------------
app.delete("/all-blogs/:id", verifyToken, verifyVolunteer, async (req, res) => {
      const id = req.params.id;
      const result = await donationBlogCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
 //Payment------------------------------------payment

      app.post('/create-checkout-session', async (req, res) =>{
        const { price } = req.body;
        const amount = parseInt(price * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
        })
        res.send({
          clientSecret: paymentIntent.client_secret
        })


      })

        //store user payment info
      app.post('/payment', async (req, res)=>{
        const payment = req.body;
        const paymentResult = await paymentCollection.insertOne(payment);
        
        // console.log('pay info', payment)
        res.send({paymentResult,})
      })

       //payment history get
      app.get('/payments-history', verifyToken, async (req,res)=>{
       
        const result = await paymentCollection.find().toArray();
        res.send(result)
      })
// update full request by ID
app.patch('/donation-requests/:id', verifyToken, async (req, res) =>{
  const { id } = req.params;
  
} )

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