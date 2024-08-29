const mongoose = require("mongoose");

const featuredSchema = new mongoose.Schema({
    id:Number,
    title:String,
    subTitle:String,
    image:String,
    price:Number,
})



const featuredModel = mongoose.model("featuredproducts", featuredSchema);

module.exports = featuredModel;
