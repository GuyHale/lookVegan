const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const userController = require("../controllers/users");

const { isLoggedIn, isLoggedOut } = require("../middleware");

router.route("/register")
    .get(isLoggedOut, userController.getRegister)
    .post(catchAsync(userController.postRegister))

router.route("/login")
    .get(isLoggedOut, userController.getLogin)
    .post(isLoggedOut,
        passport.authenticate("local", { failureFlash: true, failureRedirect: '/login' }),
        userController.postLogin)

router.get("/logout", isLoggedIn, userController.logout)

module.exports = router;