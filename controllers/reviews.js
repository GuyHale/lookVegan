const Place = require("../models/places");
const Review = require("../models/review");
const User = require("../models/user")

//review controller for review routes callback functionality

module.exports.postReview = async (req, res, next) => {
    //posting new review POST request 
    //validateReview middleware defined by me, ensures reviews match
    //requirements I've made using Joi validations
    //eg length of review must exceed a certain value, and the body is required

    //wrapAsync is a wrapper function defined by me to catch errors
    // console.log("Post request worked");
    const { id } = req.params;
    const place = await Place.findById(id);
    const review = await new Review(req.body); //create new review
    review.author = req.user._id;

    place.reviews.push(review);

    // console.log(review.author);

    await review.save();
    await place.save();




    // const reviews = Review.populate("place").findById({ place: { _id: id } });
    req.flash("success", "Successfully posted review!");
    res.redirect(`/places/${id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    //review delete request

    const { placeId, revId } = req.params;

    //finding the place and updating the reviews array to no loner contain the review
    //with revId, $pull is the special mongoose operator that removes the element
    //from the array
    await Place.findByIdAndUpdate(placeId, { $pull: { reviews: revId } });

    //then delete the review from the reviews collections
    await Review.findByIdAndDelete(revId);

    req.flash("success", "Successfully deleted review!");


    res.redirect(`/places/${placeId}`);


}