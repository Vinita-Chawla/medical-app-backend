const express = require("express");
const cors = require("cors");
const featuredModel = require("../db/featuredProducts");
const recentModel = require("../db/recentProducts");
const app = express();

app.use(express.json());
app.use(cors());


const featuredProducts = async(req,res)=>{
    const featuredProducts = await featuredModel.find();
    res.send(featuredProducts)
}

const recentProducts = async(req,res)=>{
    const recentProducts = await recentModel.find();
    res.send(recentProducts);
}

const singlefeaturedProduct= async(req,res)=>{
    let id = req.params.id;

   const singleProduct = await featuredModel.findOne({id:id});
   res.send(singleProduct)

}

const singleRecentProduct = async(req,res)=>{
    let id = req.params.id;
    const singleProduct = await recentModel.findOne({id:id});
    res.send(singleProduct)
}


module.exports = {featuredProducts, recentProducts, singleRecentProduct, singlefeaturedProduct}