const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())

// user name password
// Online-Learning-Platform
// 3Pjb05Rsb4TWS7tl

const uri = "mongodb+srv://Online-Learning-Platform:3Pjb05Rsb4TWS7tl@cluster0.syckqzu.mongodb.net/?appName=Cluster0";



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('Online-Learning-Platform')
    const collectionDb = db.collection('Learningdb')


    app.get('/Learningdb', async (req, res) => {
      const result = await collectionDb.find().toArray()


      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World! babu')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
module.exports = app