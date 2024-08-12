const express = require('express');
const router = express.Router();

const {login, register, updateUser} = require("../controllers/auth")

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/updateUser/:id").post(updateUser);

module.exports = router;