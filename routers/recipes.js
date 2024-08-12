const express = require('express');
const router = express.Router();

const {submitRecipe, getAllRecipes, getSingleRecipe} = require("../controllers/recipes")

router.route("/addRecipe").post(submitRecipe);
router.route("/getAllRecipes").get(getAllRecipes);
router.route("/singleRecipe/:id").get(getSingleRecipe);

module.exports = router;