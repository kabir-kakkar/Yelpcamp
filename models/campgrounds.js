var mongoose = require("mongoose");

//Schema Setup
var campgroundSchema = new mongoose.Schema ({
    name: String,
    image: String,
    description: String,
    author: {
       // It is the _id attribute that refers to "User"
       id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       }, 
       // Name of the Authoer
       username: String
    },
    comments: [ 
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

module.exports = mongoose.model("Campground", campgroundSchema);