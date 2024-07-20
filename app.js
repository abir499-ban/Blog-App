require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const PORT  = process.env.PORT;
const UserRouter = require('./routes/user');
const {connectToMongoDB} = require('./connection');
const cookie_parser = require('cookie-parser');
const { checkAuth } = require('./middleware/authentication');
const BlogRoute = require('./routes/blog');
const Blog = require('./model/blog');

connectToMongoDB(process.env.MONGO_URL); //connection to mongoDB

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());    //Middle-ware to use body of req object
app.use(express.urlencoded({extended:false})); //To access the body of req object
app.use(express.static(path.resolve('./public')));   //A MIDDLEWARE TO TELL EXPRESS THAT MAKE THE PUBLIC FOLDER STATIC SO THAT ITS CONTENTS CAN BE ACCESSED
app.use(cookie_parser());
app.use(checkAuth("token"));

app.get('/', async(req,res) =>{
    const allBlogs = await Blog.find({});
    res.render("home",{
       user:req.user,
       allBlogs : allBlogs,
    });
})
app.use('/', UserRouter);
app.use('/blog', BlogRoute);

app.listen(PORT, ()=>
{
    console.log("Server is live")
})