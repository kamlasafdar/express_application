const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in env");
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = conn;
  console.log("✅ MongoDB connected (serverless)");
  return cachedDb;
}

// Routes
app.get('/', async (req, res) => {
  res.send('helloworld');
});

app.get('/user', async (req, res) => {
  try {
    await connectToDatabase();
    const users = await User.find();
    if (!users.length) return res.send('no user found');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.post('/user', async (req, res) => {
  try {
    await connectToDatabase();
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).send('User not found');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) return res.status(404).send('User not found');

    if (req.body.email) userToUpdate.email = req.body.email;
    if (req.body.firstName) userToUpdate.firstName = req.body.firstName;
    if (req.body.lastName) userToUpdate.lastName = req.body.lastName;
    if (req.body.password) userToUpdate.password = req.body.password;

    await userToUpdate.save();
    res.status(200).json(userToUpdate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = serverless(app);
