const exp = require('express')
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require('./createUserOrAuthor');
const Article = require("../models/articleModel")
const {requireAuth,clerkMiddleware}=require("@clerk/express")
require('dotenv').config()

//authorApp.use(clerkMiddleware())
//create new author
authorApp.post("/author", expressAsyncHandler(createUserOrAuthor))

//create new article
authorApp.post("/article", requireAuth(), expressAsyncHandler(async (req, res) => {
    try {
        const newArticleObj = req.body;
        const newArticle = new Article(newArticleObj);
        const articleObj = await newArticle.save();
        res.status(201).json({ 
            message: "article published", 
            payload: articleObj 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
}))

// Get all articles - authentication optional
authorApp.get("/articles",requireAuth({signInUrl:"unauthorized"}), expressAsyncHandler(async (req, res) => {
    try {
        const articles = await Article.find({});
        res.status(200).json({ 
            message: "articles", 
            payload: articles 
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ 
            message: error.message 
        });
    }
}));

authorApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})

//modify an article by article id
authorApp.put('/article/:articleId',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async (req, res) => {

    //get modified article
    const modifiedArticle = req.body;
    //update article by article id
    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false })
    //send res
    res.status(200).send({ message: "article modified", payload: latestArticle })
}))


//delete(soft delete) an article by article id
authorApp.put('/articles/:articleId',expressAsyncHandler(async (req, res) => {

    //get modified article
    const modifiedArticle = req.body;
    //update article by article id
    const latestArticle = await Article.findByIdAndUpdate(modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false })
    //send res
    res.status(200).send({ message: "article deleted or restored", payload: latestArticle })
}))

// Get articles by category
authorApp.get("/articles/filter/:category", expressAsyncHandler(async (req, res) => {
    try {
        const category = req.params.category;
        const articles = await Article.find({ category: category });
        res.status(200).json({ 
            message: "articles", 
            payload: articles 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
}));

module.exports = authorApp;