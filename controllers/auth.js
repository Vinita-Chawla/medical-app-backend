const express = require("express");
const app = express();
const cors = require("cors");
const userModel = require("../db/user");


const Jwt = require("jsonwebtoken");
let jwtKey = "recipe-app";

app.use(express.json());
app.use(cors());

const login = async(req,res)=>{
  let user = await userModel.findOne(req.body).select("-password");
  if(req.body.email && req.body.password){
    if(user){
     Jwt.sign({user}, jwtKey, {expiresIn:"2h"}, (err, token)=>{
      if(err){
        res.send("Oops! Something went wrong.")
      }
      else{
        res.send({user, auth:token});
      }
     })
    }
    else{
      res.send({result:"No user found!"})
    }
  }
  else{
    res.send({result:"No user found!"})
  }
}


const register = async(req,res)=>{
  let {name, email,password, premium} = req.body;
    let user = await userModel.create({
        name:name,
        email:email,
        password:password,
        profile:req.file.path,
        premium:premium
    })

    user = user.toObject();
    delete user.password;

    Jwt.sign({user}, jwtKey, {expiresIn:"2h"},(err, token)=>{
      if(err){
        res.send("Oops! Something went wrong.")
      }
      else{
        res.send({user, auth:token});
      }
    })
}


const updateUser = async(req,res)=>{

  let { name, email, password, premium } = req.body;
  let updateFields = {};

  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (password) updateFields.password = password;
  if (premium !== undefined) updateFields.premium = premium;
  if (req.file && req.file.path) updateFields.profile = req.file.path;

 let result = await userModel.updateOne(
  {_id: req.params.id}, {$set:updateFields}
 )

 if(result){
  // Fetch the updated user
let user = await userModel.findById(req.params.id);
if (!user) {
  return res.status(404).send("User not found");
}

user = user.toObject();
delete user.password;

 Jwt.sign({user}, jwtKey, {expiresIn:"2h"},(err, token)=>{
   if(err){
     res.send("Oops! Something went wrong.")
   }
   else{
     res.send({user, auth:token});
   }
 })
 }


}

module.exports = {login, register, updateUser}