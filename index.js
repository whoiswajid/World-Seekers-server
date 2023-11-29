const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nqal8de.mongodb.net/?retryWrites=true&w=majority`;

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

    const usersCollection = client.db('worldSeekerDb').collection('users')
    const toursCollection = client.db('worldSeekerDb').collection('tours')
    const guidesCollection = client.db('worldSeekerDb').collection('guides')
    const bookingsCollection = client.db('worldSeekerDb').collection('bookings')
    const storyCollection = client.db('worldSeekerDb').collection('story')
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();


    //tours
    app.get('/tours', async (req, res) => {
      const cursor = toursCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/tours/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { title: 1, price: 1, tourDetails: 1, images: 1, images1: 1, images2: 1, category: 1, tourPlan1: 1, tourPlan2: 1, }
      }

      const result = await toursCollection.findOne(query, options);
      res.send(result);
    })

    app.post('/tours', async (req, res) => {
      const newPackage = req.body;
      const result = await toursCollection.insertOne(newPackage)
      res.send(result);
    })

    // add story
    app.post('/story', async (req, res) => {
      const newStory = req.body;
      const result = await storyCollection.insertOne(newStory)
      res.send(result);
    })






    //guides

    app.get('/guides', async (req, res) => {
      const cursor = guidesCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/guides/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { name: 1, img: 1, email: 1, from: 1, constact: 1, education: 1, skills: 1 }
      }

      const result = await guidesCollection.findOne(query, options);
      res.send(result);
    })






    app.put('/users/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email: email }
      const options = { upsert: true }
      const isExist = await usersCollection.findOne(query)
      console.log('User found?----->', isExist)
      if (isExist) return res.send(isExist)
      const result = await usersCollection.updateOne(
        query,
        {
          $set: { ...user, timestamp: Date.now() },
        },
        options
      )
      res.send(result)
    })


    // user role

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email
      const result = await usersCollection.findOne({ email })
      res.send(result)
    })


    // all users

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    // update role

    app.put('/users/update/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email: email }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...user,
        },
      }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })




    // bookings

    app.get('/bookings', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })


    app.get('/bookings', async (req, res) => {
      let query = {};
      if (req.query?.GuideName) {
        query = { GuideName: req.query.GuideName }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('seeking the world')
})

app.listen(port, () => {
  console.log(`World seeker  is watcing world on port ${port}`)
})