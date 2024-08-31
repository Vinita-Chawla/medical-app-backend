const express = require("express");
const app = express();
const cors = require("cors");
const userModel = require("../db/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const verifyMail = require("../utils/verifyMail");
const Token = require("../db/token");


app.use(express.json());
const corsConfig = {
  origin:"*",
  credentials:true,
  methods:["GET","PUT","POST","PATCH","DELETE"]
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig));

app.use(cors());

const Jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT_KEY;

const login = async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    res.send({ result: "No user found" });
  } else if (user && user.verified) {
    let isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (req.body.email && req.body.password) {
      if (isPasswordValid) {
        Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            res.send("Oops! Something went wrong.");
          } else {
            res.status(200).send({ user, auth: token });
          }
        });
      } else {
        res.send("please enter correct details!");
      }
    } else {
      res.send("Email or password is empty!");
    }
  } else {
    res.send({ status: "please verify the user" });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  let existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    return res.send({ result: "User with this email already exists." });
  }


  let user = await userModel.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
    profile: req.file.path,
  });

  Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, async (err, auth) => {
    if (err) {
      res.send("Oops! Something went wrong.");
    } else {
      let token = new Token({
        userId: user._id,
        token: auth,
      });

      await token.save();

      const link = `https://medical-app-backend-one.vercel.app/auth/confirm/${auth}`;
      await verifyMail(user.email, link,"Verfiy your Email");

      res.status(200).send({
        user,
        auth: auth,
        message: "An Email sent to your account, Please Verify!",
      });
    }
  });
};

const emailVerification = async(req, res) => {
  try {
    const token = await Token.findOne({token:req.params.token});
    await userModel.updateOne({_id:token.userId},{$set:{verified:true}});
    await Token.findByIdAndDelete({_id:token._id})
    res.send({status:"Email verified Successfully!"})
  } catch(error) {
    res.status(400).send("An error occured")
  }
};

const forgotPassword = async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });

  Jwt.sign(
    { id: user._id },
    jwtKey,
    { expiresIn: "2h" },
    async (err, token) => {
      if (err) {
        res.send("Oops! Something went wrong.");
      } else {
        const link = `https://medical-app-frontend-blue.vercel.app/reset-password/${user._id}/${token}`;
        await verifyMail(user.email, link, "Reset your Password");
        res.status(200).send({
          message: "An Email sent to your account, Please Reset your password!",
        });
      }
    }
  );
};

const resetPassword = async (req, res) => {
  let { id, token } = req.params;
  let { password } = req.body;
  Jwt.verify(token, jwtKey, { expiresIn: "2h" }, async (err, decoded) => {
    if (err) {
      return res.json({ status: "Error with token" });
    } else {
      let hashedPassword = await bcrypt.hash(password, 10);
      let user = await userModel.updateOne(
        { _id: id },
        { $set: { password: hashedPassword } }
      );
      if (user) {
        res.send({ status: "successful" });
      } else {
        res.send({ status: "not successful" });
      }
    }
  });
};




const failure = (req,res)=>{
  res.send("Login not successful, error");
}





module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  emailVerification,
  failure
};
