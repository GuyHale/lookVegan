const { placeSchema, reviewSchema } = require("./schemas.js");
const Place = require("./models/places");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {

        req.flash('error', 'You are already logged in!');
        return res.redirect('/places');
    }
    next();
}

module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        req.flash("error", msg);
        return res.redirect("/places/new");
        // throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    console.log(req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash("error", msg);
        return res.redirect(`/places/${req.params.id}`);
    } else {
        next();
    }
}

module.exports.verifyPlaceAuthor = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id).populate("reviews").populate("author");

    if (!place) {
        req.flash("error", "This place no longer exists!")
        return res.redirect("/places");
    }

    if (!place.author.equals(req.user._id)) {
        req.flash("error", "You must be the author to edit this!");
        return res.redirect(`/places/${id}`);
    }

    next();

}

module.exports.verifyReviewAuthor = async (req, res, next) => {
    const { placeId, revId } = req.params;
    const review = await Review.findById(revId).populate("author");

    if (!review) {
        req.flash("error", "This review no longer exists!");
        return res.redirect(`/places/${placeId}`);
    }


    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You can't delete other people's reviews!");
        return res.redirect(`/places/${placeId}`);
    }

    next();

}