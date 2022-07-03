const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//requiring passport because I'll use passport to encrypt passwords, but also
//passport will isnert usernames and passwords into the database for me
const passportLocalMongoose = require("passport-local-mongoose");

//Creating the UserSchema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);