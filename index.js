const express = require("express");
const app = express();
require("./db/config");
const cors = require("cors");

const auth_routes = require("./routers/auth");
const recipe_routes = require("./routers/recipes")

const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("./db/cloudinaryConfig");

const stripe = require("stripe")(
  "sk_test_51NqbIGBttcRVBy3MYXkus2GMikCglZ1BBtZqOMortgPVkIiKT5ldSWRDGwTo4Vl7c0ondXjlamokmYAezlxlQBAy00Exf37gl4"
);

app.use(express.json());
app.use(cors());


const Jwt = require("jsonwebtoken");
let jwtKey = "recipe-app";

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
    folder: "recipe-app/images",
    format: async (req, file) => "png", 
    public_id: (req, file) => Date.now() + "_" + file.originalname,
    }
})

const upload = multer({
    storage:storage
})


app.use("/auth",upload.single("profile"),auth_routes);
app.use("/recipe",upload.single("recipe_photo"),verifyToken,recipe_routes);

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




app.post("/", async (req, res) => {
  try {
      let { id, amount, interval,name,email,plan } = req.body;

      if (!id) {
        return res.status(400).send("Payment method ID is required");
    }
    
      // Create a new customer
      const customer = await stripe.customers.create({
          name: name,
          email:email,
      });

      // Attach the payment method to the customer
      await stripe.paymentMethods.attach(id, {
          customer: customer.id,
      });

      // Set the payment method as the default for the customer
      await stripe.customers.update(customer.id, {
          invoice_settings: {
              default_payment_method: id,
          },
      });

      // Create a new price
      const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: Math.round(amount*100),
          recurring: {
              interval: interval,
          },
          product_data: {
              name: plan,
          },
      });

      // Create a new subscription
      const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [
              {
                  price: price.id,
              },
          ],
          default_payment_method: id,
      });

      return res.send("Subscription successful");
  } 
  catch (err) {
      console.error("Error:", err.message);
      res.status(500).send("An error occurred: " + err.message);
  }
});
  

app.listen("5000");