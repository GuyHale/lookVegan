const express = require("express");
const router = express.Router({ mergeParams: true });

const Place = require("../models/places");
const Review = require("../models/review");
const User = require("../models/user")


const { isLoggedIn, validateReview, verifyReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews"); //requiring review controller


const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post("/:id/reviews", isLoggedIn, validateReview,
    catchAsync(reviewController.postReview))



router.delete("/:placeId/reviews/:revId", isLoggedIn, verifyReviewAuthor,
    catchAsync(reviewController.deleteReview))

module.exports = router;