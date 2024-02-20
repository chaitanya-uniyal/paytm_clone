const express = require("express");
const zod = require("zod");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../db");
const {JWT_SECRET} = require("../config");
const router = express.Router();


const signupBody = zod.object({
    userName: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})

router.post("/signup",async(req,res)=>{
    const success = signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "incorrect inputs"
        })
    } 
    
    const checkExistingUser = await User.findOne({
        username: req.body,username,
    })
    if(checkExistingUser){
        
        return res.status(411).json({
            message: "user already exists"
    })
}
    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password,
    })

    const userId = user._id;

    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message: "user created succesfully",
        token: token
    })
});


const signinBody = zod.object({
    userName: zod.string().email(),
    password: zod.string(),
})

router.use("/signin",async(req,res)=>{
    const success = signinBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "invalid credentials"
        })
    }

    const checkUserExists = await user.findOne({
        userName: req.body.userName,
        password: req.body.password,
    });
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})
module.exports = router;