const mongoose = require("mongoose");

const recentSchema = new mongoose.Schema({
    id:Number,
    title:String,
    subTitle:String,
    image:String,
    price:Number,
})


const recentModel = mongoose.model("recentproducts", recentSchema);

module.exports = recentModel;
