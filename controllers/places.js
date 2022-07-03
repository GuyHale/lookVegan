const Place = require("../models/places");
const { cloudinary } = require("../cloudinary/index");
//exporting all of my callback functionality for the places routes
//this neatens up my routes code and makes everything more clear
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.mapbox_token;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.placesIndex = async (req, res) => {
    //find all places to display in index page
    const places = await Place.find({});
    res.render("places/index", { places })
}

module.exports.getNewPlace = (req, res) => {
    //render the new plpace form upon get request
    res.render("places/new");
}

module.exports.postNewPlace = async (req, res, next) => {
    //the post request that will be sent after submitting a form for a new place
    //the method in the form will be post and it's action will be to /places

    //validatePlace is an middleware express middleware I've created that is automatically
    //executed whenever this request is made, see definition of function to understand
    //it's purpose

    //catchAsync is a wrapper function defined by me 

    //destructuring the potential information the user included
    const { title, city, option1, price1, option2, price2, option3, price3, des, rating } = req.body;

    //converting city into latitude and longitude, this will enable us to add a map
    const geoData = await geoCoder.forwardGeocode({
        query: `${city}, England`,
        limit: 1
    }).send()


    // map over files array and extract path and filename to add to new place
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // img = "https://source.unsplash.com/collection/69817121";

    //creating a new Place with the destructured info
    const newPlace = new Place({
        title: title,
        location: city,
        options: [option1, option2, option3],
        optionPrices: [price1, price2, price3],
        description: des,
        rating: rating,
        images: images
    })

    //awaiting the saving of this new place
    newPlace.author = req.user._id;

    //adding the type and coordinates information into the geolocation object
    newPlace.geometry = geoData.body.features[0].geometry;
    await newPlace.save();

    console.log(newPlace);

    req.flash("success", `Successfully added ${title}, ${city}!`); //creating a flash
    //alert that will appear momentarily after successfully creating a new place

    res.redirect(`/places/${newPlace._id}`); //redirecting to home page where you can see latest addition
}

module.exports.getPlaceInfo = async (req, res,) => {
    //find specific place wanting to be viewed
    //populate this place with review authors, as well as place author
    const place = await Place.findById(req.params.id).populate({
        path: "reviews",
        populate: { path: "author" } //how to nested populate
    }).populate("author");

    // console.log(place);

    res.render("places/info", { place });
}

module.exports.getEditPlace = async (req, res) => {
    //edit place request
    //find place requested
    //if doesnt exist, redirect to index page with a message
    //if it does exist, render edit form
    const place = await Place.findById(req.params.id)
    if (!place) {
        req.flash("error", "Cannot find that place!");
        return res.redirect('/places');
    }

    res.render("places/edit", { place });
}

module.exports.putEditPlace = async (req, res) => {
    //put request for updating vegan place information

    const { id } = req.params;
    const { title, city, option1, price1, option2, price2, option3, price3, des, rating } = req.body;
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    const place = await Place.findByIdAndUpdate(id, {
        title: title,
        location: city,
        options: [option1, option2, option3],
        optionPrices: [price1, price2, price3],
        description: des,
        rating: rating,


    })

    place.images.push(...images); //push new images into array, need to spread elements
    //into the array, we don't want an array of an array

    //pulling from the images where the filename is in the deleteImages array
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            //delete these images from cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        await place.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    await place.save();

    req.flash("success", `Sucessfully edited ${title}, ${city}`);

    res.redirect(`/places/${id}`); //redirecting to the show page
}


module.exports.deletePlace = async (req, res) => {
    //delete place request
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted place!")
    res.redirect("/places");
}