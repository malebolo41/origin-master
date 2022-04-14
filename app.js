
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//encryption password

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"] });

const User = mongoose.model("User", userSchema);



app.get("/",(req,res)=>{
 res.render("home");
});

app.get("/login",(req,res)=>{
 res.render("login");
});

app.get("/register",(req,res)=>{
 res.render("register");
});

app.post("/register",(req,res)=>{

const newUser = new User({
  email: req.body.username,
  password: req.body.password
});

  newUser.save((err)=>{
    if(!err){
      res.render("secrets");
    } else{
      console.log(err);
    }
  });

});


app.post("/login",(req,res)=>{
 User.findOne({email: req.body.username},(err, result)=>{
  if(err){
    console.log(err);
  } else{
    if(result){
      if(result.password === req.body.password)
      {
        res.render("secrets");
      }
    }
  }

 });

});



app.get("/logout",(req,res)=>{
  res.redirect("/");
});

app.post("/logout",(req,res)=>{
  res.render("/");
});



app.listen("3000",()=>{
  console.log("server started on port 3000");
});
