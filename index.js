const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB credentials
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
    console.log("✅ Connected to MongoDB successfully!");

    const db = client.db('Online-db');
    const coursesCollection = db.collection('Online');
    const enrollCollection = db.collection('Enrollments');

   
    app.get('/', (req, res) => {
      res.send('Server is running 🚀');
    });

    
    app.get('/Online', async (req, res) => {
      try {
        const result = await coursesCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch courses' });
      }
    });


    app.get('/Online/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const course = await coursesCollection.findOne({ _id: new ObjectId(id) });
        if (!course) return res.status(404).send({ message: 'Course not found' });
        res.send(course);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch course' });
      }
    });


    app.post('/Online', async (req, res) => {
      const { title, image, price, duration, category, description } = req.body;
      if (!title || !image || !price) {
        return res.status(400).send({ message: 'Missing required fields' });
      }
      try {
        const result = await coursesCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to add course' });
      }
    });

   
    app.post('/enroll', async (req, res) => {
      const { courseId, userEmail } = req.body;
      if (!courseId || !userEmail) {
        return res.status(400).send({ message: 'Missing required fields' });
      }
      try {
        const result = await enrollCollection.insertOne({ courseId, userEmail, enrolledAt: new Date() });
        res.send({ message: 'Enrollment successful!', enrollmentId: result.insertedId });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Enrollment failed' });
      }
    });

 
    app.get('/view', async (req, res) => {
      const { email } = req.query; 
      if (!email) return res.status(400).send({ message: 'Online' });

      try {
        
        const userEnrollments = await enrollCollection.find({ userEmail: email }).toArray();

       
        const enrolledCourses = await Promise.all(
          userEnrollments.map(async (enroll) => {
            const course = await coursesCollection.findOne({ _id: new ObjectId(enroll.courseId) });
            return { ...course, enrolledAt: enroll.enrolledAt };
          })
        );

        res.send(enrolledCourses);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch enrolled courses' });
      }
    });

  
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

run().catch(console.dir);
