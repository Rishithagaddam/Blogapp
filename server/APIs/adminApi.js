const express=require('express');
const adminApp=express.Router();
const UserAuthor=require('../models/userAuthorModel');
const expressAsyncHandler=require('express-async-handler');
const {requireAuth}=require('@clerk/express')

adminApp.post('/admin',expressAsyncHandler(async(req,res)=>{
    const newUserAuthor=req.body;
    const userInDb=await UserAuthor.findOne({email:newUserAuthor.email})
    if(userInDb!=null){
        if(newUserAuthor.role===userInDb.role){
            res.status(200).send({message:newUserAuthor.role,payload:userInDb})
        }
        else{
            res.status(200).send({message:"Invalid role"})
        }
    }
    else{
        let newUser=new UserAuthor(newUserAuthor);
        let newUserOrAuthorDoc=await newUser.save();
        res.status(201).send({message:newUserOrAuthorDoc.role,payload:newUserOrAuthorDoc})
    }
}));


adminApp.put("/admin/block-unblock/:id",requireAuth({signInUrl:"unauthorized"}) ,expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const { blocked } = req.body; 
  
    if (blocked === undefined) {
      return res.status(400).send({ message: "Blocked status is required" });
    }
  
    // console.log("id:", id, "blocked:", blocked);
  
    try {
      const userAuthor = await UserAuthor.findByIdAndUpdate(
        id,
        { blocked }, 
        { new: true } 
      );
  
      if (!userAuthor) {
        return res.status(404).send({ message: "User not found" });
      }
  
      res.status(200).send({ message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`, payload: userAuthor });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }));
  
  
  adminApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
  })
  
  adminApp.get('/users', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    try {
      const users = await UserAuthor.find({});
      res.status(200).send({ message: "Users fetched successfully", payload: users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }));
  
  module.exports = adminApp;