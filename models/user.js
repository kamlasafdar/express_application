const mongoose=require('mongoose');
const userschema =new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    }
});
const user=mongoose.model('users',userschema);
module.exports=user;
