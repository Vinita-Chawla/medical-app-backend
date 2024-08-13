const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const recipeModel = require("../db/recipe")

const submitRecipe = async(req,res)=>{
    let {userId, recipe_title, recipe_category, recipe_summary, recipe_gradients, prep_time, cooking_time, calories} = req.body;
    const recipes = await recipeModel.create({
        userId: userId,
        recipe_title:recipe_title,
        recipe_category:recipe_category,
        recipe_summary:recipe_summary,
        recipe_photo:req.file.path,
        recipe_gradients:JSON.parse(recipe_gradients),
        prep_time:prep_time,
        cooking_time:cooking_time,
        calories:calories,
    })

    res.send(recipes)
}

const getAllRecipes = async(req,res)=>{
    let recipes = await recipeModel.find().populate("userId");
    res.send(recipes);
}

const getSingleRecipe = async(req,res)=>{
    let recipe = await recipeModel.findOne({_id:req.params.id});
    res.send(recipe);
}

const addLikes = async(req,res)=>{
    let {userId, recipeId, isLiked} = req.body;
    let recipe = await recipeModel.updateOne(
        {_id:req.params.id},
        {$push:{likes:{userId:userId,recipeId:recipeId,isLiked:isLiked}}}
    )

    res.send(recipe);
}

const updateLikes = async(req,res)=>{
    let {likes}= req.body;
    let recipe = await recipeModel.updateOne(
        {"likes.userId":req.params.userId, "likes.recipeId": req.params.postId},
        {$set:{"likes.$.isLiked": likes.isLiked}}
    )

    res.send(recipe);
}

module.exports = {submitRecipe, getAllRecipes, getSingleRecipe, addLikes,updateLikes};