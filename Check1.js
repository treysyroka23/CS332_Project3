const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'NewDB';

app.use(express.json());

// Middleware for database connection
app.use(async (req, res, next) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    req.db = client.db(dbName);
    next();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    
    // await client.close();
  }
});

// /api/login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = req.db.collection('users');

  
  const user = await usersCollection.findOne({ username, password });

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// /api/logout endpoint
app.post('/api/logout', (req, res) => {
  // Perform logout operations here (e.g., token revocation)
  res.status(200).json({ message: 'Logout successful' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
