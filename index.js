const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrsyrpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

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
    await client.connect();

    const cardCollection = client.db('cardDB').collection('card')

    app.get('/card', async (req, res) => {
      const cursor = cardCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/myList/:email', async (req, res) => {
      console.log(req.params.email)
      const result = await cardCollection.find({ email: req.params.email }).toArray();
      res.send(result)

    })
    app.get('/card/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cardCollection.findOne(query)
      console.log(result)
      res.send(result)

  })

    app.post('/card', async (req, res) => {
      const newCard = req.body
      console.log(newCard)
      const result = await cardCollection.insertOne(newCard)
      res.send(result)
    })
    app.put('/card/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateProducts = req.body;
      const products = {
        $set: {
          

          tourist_spot_name: updateProducts.tourist_spot_name,
          country_Name: updateProducts.country_Name,
          image: updateProducts.image,
          location: updateProducts.location,
          short_description: updateProducts.short_description,
          average_cost: updateProducts.average_cost,
          travel_time: updateProducts.travel_time,
          seasonality: updateProducts.seasonality,
         
          totalVisitorsPerYear: updateProducts.totalVisitorsPerYear
        }
      }
      const result = await cardCollection.updateOne(filter, products, options)
      console.log(result);
      res.send(result)
    })
    
    app.delete('/delete/:id', async (req, res) => {
      const result = await cardCollection.deleteOne(
        { _id: new ObjectId(req.params.id) }
      )
      console.log(result)
      res.send(result)
    }
    )




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is running')

})
app.listen(port, () => {
  console.log(`server is running on port:${port}`)
})