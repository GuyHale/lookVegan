const express = require("express");
const router = express.Router();
const multer = require("multer"); //requiring multer, lets us parse files and 
//regular inputs from the same form
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");
const { placeSchema } = require("../schemas.js");
const { isLoggedIn, validatePlace, verifyPlaceAuthor } = require("../middleware");
const placesController = require("../controllers/places");

const ExpressError = require("../utils/ExpressError");
const Place = require("../models/places");

//using router.route("/somepath") which allows me to chain on different requests
//that have the same url path, but different methods ie get/post etc
//this saves a few lines of code
router.route("/")
    .get(catchAsync(placesController.placesIndex))
    //upload.array("x") -- x has to match the file input name in the upload form
    .post(isLoggedIn, upload.array("image"), validatePlace, catchAsync(placesController.postNewPlace))


router.get("/new", isLoggedIn, placesController.getNewPlace)

//same here, can chain my get, put and delete requests on to router.route("/:id")
router.route("/:id")
    .get(catchAsync(placesController.getPlaceInfo))
    .put(isLoggedIn, upload.array("image"), verifyPlaceAuthor, validatePlace,
        catchAsync(placesController.putEditPlace))
    .delete(isLoggedIn, verifyPlaceAuthor, catchAsync(placesController.deletePlace))

router.get("/:id/edit", isLoggedIn, verifyPlaceAuthor,
    catchAsync(placesController.getEditPlace))


module.exports = router;