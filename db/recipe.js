const mongoose = require("mongoose");
const recipeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"users"
    },
    recipe_title:String,
    recipe_category:String,
    recipe_summary:String,
    recipe_photo:String,
    recipe_gradients:[String],
    prep_time:String,
    cooking_time:String,
    calories:String,
    likes:[{
        userId:{type:mongoose.Schema.ObjectId,ref:"users"}, 
        recipeId:{type:mongoose.Schema.ObjectId,ref:"recipes"},
        isLiked:Boolean
    }]
})

const recipeModel = mongoose.model("recipes", recipeSchema);

module.exports = recipeModel;