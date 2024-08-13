const express = require('express');
const router = express.Router();

const {submitRecipe, getAllRecipes, getSingleRecipe, addLikes,updateLikes} = require("../controllers/recipes")

router.route("/addRecipe").post(submitRecipe);
router.route("/getAllRecipes").get(getAllRecipes);
router.route("/singleRecipe/:id").get(getSingleRecipe);
router.route("/addlikes/:id").post(addLikes);
router.route("/updatelikes/:userId/:postId").put(updateLikes)

module.exports = router;