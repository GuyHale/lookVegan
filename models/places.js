const mongoose = require("mongoose");
const Review = require("./review")
const User = require("./user");
const Schema = mongoose.Schema;

//defining our images as it's separate schema as I want to apply a specific thumbnail virtual to only the images
//I can then nest ImagesSchema inside my  PlacesSchema
const ImageSchema = new Schema({

    url: String,
    filename: String

})
//thumbnail virtual -- used when providing a user the deletion functionality for images associated with places
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200,h_200") //dynamically coding
    //in the image size resitrictions cloudinary provide
    //adding w_300 after /upload in the url
})

//allows JSON to parse virtuals, need this to display place titles on cluster map
const opts = { toJSON: { virtuals: true } };

//Creating the main PlaceSchema
const PlaceSchema = new Schema({
    title:
    {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"], //geolocation.type must be "Point"
            required: true

        },
        coordinates: {
            type: [Number],
            required: true

        }
    },
    options: {
        type: [String],
        require: true
    },
    optionPrices: {
        type: [Number],
        require: true
    },
    description: {
        type: String,
        require: true
    },
    images: [ImageSchema],

    reviews: [{
        type: Schema.Types.ObjectId, ref: "Review"

    }],
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    }


}, opts);

//PlaceSchema middleware that populates properties.popUpMarkup with an a tag that links to the info page of "this"
//needed for cluster map
PlaceSchema.virtual("properties.popUpMarkup").get(function () {

    return `<a href=/places/${this._id}>${this.title}</a>`;
});

//a mongoose middleware that deletes every review, asccociated with a place,
// when that place gets deleted
PlaceSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Place", PlaceSchema);