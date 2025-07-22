require("dotenv").config()
const express = require("express")
const cors = require("cors")
const multer = require("multer")
const axios = require("axios")
const app = express();


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5001;
const corsOption = {

    origin: [
      'http://localhost:5173',
      "https://localhost:5173"
    //   'https://builder-bd.web.app',
  
    ],
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOption));
  app.use(express.json());



// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0f5vnoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db('bloodDonationDB').collection('users');
    const donationRequestCollection = client.db('bloodDonationDB').collection('donationRequest');
      const paymentCollection = client.db('bloodDonationDB').collection('payment');



      //Making MiddleWire
      const verifyToken = (req, res, next) =>{
        // console.log('inside', req.headers.authorization);
        if(!req.headers.authorization){
          return res.status(401).send({message: 'unauthorized access'})
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded)=>{
          if(err){
            return res.status(401).send({message: 'unauthorized access'})
          }
          req.decoded =decoded

          next()
        })

        
      }
  //JWT token
      app.post('/jwt', async(req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '1h'});

        res.send({token})

      })
       //verify Admin
      const verifyAdmin = async (req, res, next) =>{
        const email = req.decoded.email;
        const query = {email: email}
        const user = await usersCollection.findOne(query);
        const isAdmin = user?.role ==='admin';
        if(!isAdmin){
          return res.status(403).send({message: 'forbidden access'});
        }
        next()
      }
      
     
    //Admin api
      app.get('/users/admin/:email', verifyToken,  async(req, res)=>{
        const email = req.params.email;
        if(email !== req.decoded.email){
          return res.status(403).send({message: 'Unauthorized access'})

        }
        const query = {email: email}
        const user = await usersCollection.findOne(query);
        let admin = false;
        if(user){
          admin = user?.role === 'admin'
        }
        res.send({admin})
      })
    

      //user Api....................
      //all users
      app.get('/users', verifyToken, verifyAdmin, async (req, res)=>{
        
        const result = await usersCollection.find().toArray();
        res.send(result)
      })
      app.post('/users',  async(req, res)=>{
        const user = req.body;
        //checking user 
        const query = {email : user.email}
        const existingUser = await usersCollection.findOne(query);
        if(existingUser){
          return res.send({message: 'user already Exist', insertedId: null})
        }


        const result = await usersCollection.insertOne(user);
        res.send(result);

      })
// Create donation request (for regular users - no admin required)
app.post("/api/donation-requests", async (req, res) => {
 
    const requests = req.body;
    const result = await donationRequestCollection.insertOne(requests)
     res.send(result)
  
})


app.get('/api/donation-requests', async (req, res) => {
     
     const result = await donationRequestCollection.find().toArray();
     res.send(result);
   })
//Find donation req by email
app.get('/api/my-donation-requests/:email', async (req, res) => {
    const email = req.params.email;
        // if(email !== req.decoded.email){
        //   return res.status(403).send({message: 'Unauthorized access'})

        // }
        const query = {requesterEmail: email}
     const result = await donationRequestCollection.find(query).toArray()
     res.send(result);
   })

   // delete donation requests by id

    app.delete('/api/my-donation-requests/:id',  async (req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await donationRequestCollection.deleteOne(query);
        res.send(result)
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Routes that don't need to be inside `run`
app.get('/', (req, res) => {
    res.send('server running ok');
  });
// Start the server
app.listen(port, () => console.log(`Server running on port: ${port}`))