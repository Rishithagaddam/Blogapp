// const exp=require("express")
// const userApp=exp.Router();
// const UserAuthor=require("../models/userAuthorModel")
// const expressAsyncHandler=require("express-async-handler")
// const createUsrtOrAuthor=require("../APIs/createUsrtOrAuthor")
// const Article=require("../models/articleModel")
// //API
// //create new user
// userApp.post("/user",expressAsyncHandler(createUsrtOrAuthor))

// //post comment
// userApp.put("/comment/:articleId", expressAsyncHandler(async (req, res) => {
//   // console.log(req.params.articleId)
//   const commentObj = req.body;

//   const articleWithComment = await Article.findOneAndUpdate(
//     {articleId:req.params.articleId },
//     { $push: { comments: commentObj } }, 
//     { new: true } // Ensures the updated document is returned
//   );
//   // console.log("first",articleWithComment)
//   res.status(200).send({ message: "Comment added", payload: articleWithComment });
// }));



// module.exports=userApp;





const exp=require('express');
const UserAuthor = require('../models/userAuthorModel');
const expressAsyncHandler = require('express-async-handler');
const userApp=exp.Router();
const createUsrtOrAuthor=require("./createUserOrAuthor");
const Article = require('../models/articleModel');


//API to create user
userApp.post('/user',expressAsyncHandler(createUsrtOrAuthor))


// post comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    //add comment obj to array of article
    const articleWithComments=await Article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false})
    //send res
    res.send({message:"comment added",payload:articleWithComments})
}))


//fetch all users
userApp.get("/users",expressAsyncHandler(async (req, res) => {
    const userId = req.headers.authorization?.split(" ")[1]
    // console.log("user",userId)
    const users = await UserAuthor.find({ _id: { $ne: userId },role: { $ne: 'admin' }}).select("-password");
    res.status(200).send({ message: "Users fetched successfully", payload: users });
  
  })
  )

module.exports=userApp;