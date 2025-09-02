// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Debug route to check env variables
app.get('/env', (req, res) => {
    res.json({
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI
    });
});

// Optional: safe MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.warn("⚠️ MONGO_URI is undefined! MongoDB connection skipped for testing.");
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log("✅ MongoDB connected"))
        .catch(err => console.error("❌ MongoDB connection error:", err));
}

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
