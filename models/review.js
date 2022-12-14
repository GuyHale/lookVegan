const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user")

//Creating the reviewSchema
const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    }

});

module.exports = mongoose.model("Review", reviewSchema);

