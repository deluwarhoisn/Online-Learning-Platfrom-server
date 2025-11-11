const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// MongoDB credentials
// Database user: Online-DB
// Password: mZXe91cA9MJpcXq2

const uri = "mongodb+srv://Online-DB:mZXe91cA9MJpcXq2@cluster0.syckqzu.mongodb.net/?appName=Cluster0";

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

    const db = client.db('Online-db');
    const coursesCollection = db.collection('Online');
    const viewCollection = db.collection('View');

    // ✅ Get all courses
    app.get('/Online', async (req, res) => {
      const result = await coursesCollection.find().toArray();
      res.send(result);
    });

    // ✅ POST route to add new course
    app.post('/Online', async (req, res) => {
      try {
        const newCourse = req.body;
        const result = await coursesCollection.insertOne(newCourse);
        res.send(result);
      } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).send({ message: 'Failed to add course' });
      }
    });

    // ✅ Example: get /View data
    app.get('/View', async (req, res) => {
      const result2 = await viewCollection.find().toArray();
      res.send(result2);
    });
    

    // ✅ Test connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } finally {
    // Keep connection open for continuous use
  }
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
