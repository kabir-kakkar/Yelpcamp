var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema ({
    username: String,
    password: String
});

// This adds the passport methods to our user i.e., p
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);