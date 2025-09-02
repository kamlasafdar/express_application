// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const user = require('../models/user'); // correct path since server.js is in server/

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => {
    res.send('helloworld');
});

app.get('/user', async (req, res) => {
    try {
        const users = await user.find();
        if (users.length === 0) {
            return res.send('no user found');
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});

app.post('/user', async (req, res) => {
    try {
        const newUser = new user(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const deletedUser = await user.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const userToUpdate = await user.findById(req.params.id);

        if (!userToUpdate) {
            return res.status(404).send('User not found');
        }

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

// Render requires listen()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
