const express =  require("express")
const routes = express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const path = require("path")
const jwt = require("jsonwebtoken")
const User = require("../model/user")

// Signup the User
routes.post("/signup", async (req, res, next)=>{
    const {userName, email, password} = req.body;
if(!userName || !email || !password){
    return res.status(400).json({
        message: "UserName, Email and Password are required."
    })
}
    try{
const userExists = await User.findOne({email, userName})
if(userExists){
    return res.status(400).json({
        message: 'User already exists with this email',
    })
}
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: hashedPassword,
})
await user.save()
res.status(200).json({
    message:"Singup sucessful"
})
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

// login the user
routes.post("/login", async(req, res, next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "Email and Password are required"
        })
    }    
    try{
const user = await User.findOne({email});
if(!user){
    return res.status(404).json({
        message: "user not found"
    });
}
const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
    return res.status(404).json({
        message: "Invalid email and password"
    })
}
const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret', // Replace with your JWT secret
    { expiresIn: '1h' }
);
res.status(201).json({
    message: "login sucessfully",
    token,
})
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

// Get all user

routes.get("/", async(req, res, next)=>{
    try{
const docs = await User.find().select()
res.status(200).json({
    count: docs.length,
    User: docs,
})
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

// Get by Id
routes.get("/:userId" ,async (req, res, next)=>{
    try{
const id = req.params.userId;
const doc = await User.findById(id)
console.log(doc);
if(doc){
    res.status(404).json({
        user: doc,
    })
}else{
    res.status(200).json({
        messege: "No valid entry found for the this provide ID"
    })
}
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

// Update the user

routes.patch("/:userId", async(req, res, next)=>{
    try{
        const id = req.params.userId;
        const {userName, email, password} = req.body;
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate({_id: id}, {
            $set:{
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
            }
        })
        res.status(200).json({
            message: "update sucessfully"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

//delete user
routes.delete("/:userId", async(req, res, next)=>{
    try{
const id = req.params.userId;
await User.deleteOne({_id: id})
res.status(200).json({
    message: "User deleted"
})
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})
module.exports = routes;