const express = require('express');
const mongoose = require('mongoose');
const user=require('../models/user');
const cors = require('cors');
require('dotenv').config();
const app=express();
app.use(express.json());
app.use(cors());
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/' ,(req, res)=>{
    res.send('helloworld');
})
app.get('/user' , async(req , res)=>{
    try{
        const users= await user.find();
        if(users.length===0){
           return res.send('no user found');
        }
        res.status(200).json(users); 
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
})
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
    const usertoupdate = await user.findById(req.params.id);

    if (!usertoupdate) {
      return res.status(404).send('User not found');
    }

    // agar request me email bheja gaya hai to update karo
    if (req.body.email) {
      usertoupdate.email = req.body.email;
    }

    if (req.body.firstName) {
      usertoupdate.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      usertoupdate.lastName = req.body.lastName;
    }

    if (req.body.password) {
      usertoupdate.password = req.body.password;
    }

    // Save changes
    await usertoupdate.save();

    res.status(200).json(usertoupdate);
  } catch (err) {
  res.status(500).json({ message: err.message });

  }
});

module.exports = app;