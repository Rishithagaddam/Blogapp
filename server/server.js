// const exp=require("express")
// const app=exp();
// const mongoose=require("mongoose");
// const userApp = require("./APIs/userApi");
// const authorApp = require("./APIs/authorApi");
// const adminApp = require("./APIs/adminApi");
// const cors=require("cors")
// require("dotenv").config();  //process .env
// app.use(cors());

// const port=process.env.PORT || 4000

// //db connection
// mongoose.connect(process.env.DBURL).then(
//   (()=>app.listen(port,()=>{
//     console.log(`server listening on port ${port}`)
//     console.log("DB connection success")
//   })))
//   .catch(err=>console.log("Error in DB connection",err))

//   //body parser middleware
// app.use(exp.json())
// //connect api routes
// app.use('/user-api',userApp);
// app.use('/author-api',authorApp)
// app.use('/admin-api',adminApp)


// //error handling
// app.use((err,req,res,next)=>{
//   console.log("err object in express error handler",err);
//   res.send({message:err.message});
// })


const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const userApp = require('./APIs/userApi');
const authorApp = require('./APIs/authorApi');
const adminApp = require('./APIs/adminApi');
const cors = require('cors');

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=>console.log(`server is listening on port ${port}...`))
    console.log('DB connection success')
})
.catch(err=>console.log('Error in DB connection:',err))

app.use(express.json())

app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)


//error handler
app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)

    res.send({message:err.message})
})