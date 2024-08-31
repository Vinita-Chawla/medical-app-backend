const express = require("express");
const router = express.Router();
const passport = require("passport");

const cors = require("cors");
const app = express();
require("dotenv").config();

const Jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT_KEY;


const corsConfig = {
    origin:"*",
    credentials:true,
    methods:["GET","PUT","POST","PATCH","DELETE"]
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig));

app.use(cors());

const {login,register,forgotPassword,resetPassword,emailVerification,failure} = require("../controllers/auth")

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/confirm/:token").get(emailVerification);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:id/:token").put(resetPassword);

const generateToken=(user)=>{
    return Jwt.sign({user}, jwtKey, { expiresIn: '2h' });
}

// Auth with Google
router.route("/google").get(passport.authenticate("google",{scope:["email","profile"]}));

// Google Auth callback
router.route("/google/callback").get(
    passport.authenticate("google", {failureRedirect: "/auth/failure",}),
    (req, res) => {
      const token = generateToken(req.user); 
      res.redirect(`https://medical-app-frontend-blue.vercel.app/google-success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
  );

// Auth with facebook
router.route("/facebook").get(passport.authenticate("facebook",{scope:["email"]}))

// Facebook Auth callback
router.route('/facebook/callback').get(
  passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
  (req, res) => {
      const token = generateToken(req.user);
      res.redirect(`https://medical-app-frontend-blue.vercel.app/facebook-success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// failure routes
router.route("/failure").get(failure);




module.exports = router;
