import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js"
import fetchuser from "../middleware/fetchuser.js"

const router = express.Router();

//Create a User , POST request , no login required , api/auth/createuser
router.post('/createuser',[
    body('name','Name should be atleast 3 character').isLength({min:3}),
    body('email','Enter valid email').isEmail(),
    body('password','Password should be strong enough').isLength({min:3}),
], async (req,res)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors : errors.array()})
    }
    try{
        let user = await User.findOne({email : req.body.email});
        if(user){
            return res.status(400).json({errors : "User already exists."})
        }

        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            mobile : req.body.mobile,
            country : req.body.country
        })
        res.json({authtoken : user.id})
    }
    catch(error){
        res.status(500).send("Internal Server Error")
    }
})


//Login User , POST request , no login required , api/auth/login
router.post('/login',async (req,res)=>{
    try{
        let user=await User.findOne({email : req.body.email, password : req.body.password})
        if(!user){
            return res.status(400).json({errors : "No User Exist"})
        }
        res.json({authtoken : user.id})
    }catch(error){
        res.status(500).send("Internal server error.")
    }
})


//Get a User , POST request , login required , api/auth/getuser
router.get('/getuser', fetchuser, async (req,res)=>{
    try{
        let user=await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(400).json({error : "user not exist"})
        }
        res.send(user)
    }catch(error){
        res.status(500).send("Internal server error");
    }
})


//Edit User Details [name,password], Login Required, api/auth/edituser
router.put('/edituser',fetchuser,async (req,res)=>{
    try{
        let {email,name,mobile,country,password,newPassword} = req.body;
        let user = await User.findOne({email,password});
        if(user && user.id===req.user.id){
            let newUser ={name,mobile,country}
            newPassword?newUser={...newUser, password : newPassword}:'';
            
            user = await User.findByIdAndUpdate(user.id,{$set : newUser}, {new : true})
            user = await User.findById(req.user._id).select("-password")
            res.send(user)
        }
        else{
            res.status(400).json({error : "Invalid Credintials"})
        }
    }
    catch(error){
        res.status(500).send('internal server error')
    }
})

export default router;