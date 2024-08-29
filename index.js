const express = require("express");
const app = express();
require("./db/config");
const cors = require("cors");

const corsConfig = {
    origin:"*",
    credentials:true,
    methods:["GET","PUT","POST","PATCH","DELETE"]
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig));

app.use(cors());


require("./google_passport");
require("./facebook-passport");
require("dotenv").config();

const Jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

const auth_routes = require("./routers/auth");
const products_routes = require("./routers/products");

const webhook = require("./webhook")
const bodyParser = require("body-parser")

const stripe = require('stripe')('sk_test_51NqbIGBttcRVBy3MYXkus2GMikCglZ1BBtZqOMortgPVkIiKT5ldSWRDGwTo4Vl7c0ondXjlamokmYAezlxlQBAy00Exf37gl4');

app.use((req,res,next)=>{
    if(req.originalUrl === "/stripe_webhooks"){
        next()
    }
    else{
        express.json()(req,res,next);
    }
})

app.post("/stripe_webhooks", bodyParser.raw({type:"application/json"}), webhook )



const session = require("express-session");
const passport = require("passport");

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());


app.post("/",async(req,res)=>{
    let line_items = req.body;

    const session = await stripe.checkout.sessions.create({
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        line_items:line_items,
        mode: 'payment',
      });

  
      return res.status(200).json({session})
})


const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("./db/cloudinaryConfig");




const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder: "medical-app/images",
        format: async (req, file) => "png", 
        public_id: (req, file) => Date.now() + "_" + file.originalname,
    }
})

const upload = multer({
    storage:storage
})


app.use("/auth",upload.single("profile"), auth_routes);
app.use("/products", verifyToken,products_routes);

app.get("/",(req,res)=>{
    res.send("home page")
})

function verifyToken(req, res,next){
    let token = req.headers["authorization"];
    if(token){
        token = token.split(" ")[1];
        Jwt.verify(token, jwtKey, (err,valid)=>{
            if(err){
                res.status(401).send({result: "Please provide valid token"})
            }
            else{
                next()
            }
        })
    }
    else{
        res.status(403).send({result: "Please provide token with header"})
    }
 
}




  

app.listen("5000");