const express = require("express");
const router = express.Router();

const {featuredProducts, recentProducts, singlefeaturedProduct, singleRecentProduct} = require("../controllers/products")

router.route("/featured").get(featuredProducts);
router.route("/recent").get(recentProducts);
router.route("/singleFeatured/:id").get(singlefeaturedProduct);
router.route("/singleRecent/:id").get(singleRecentProduct);


module.exports = router;

