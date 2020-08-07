var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

// MIDDLEWARE TO CHECK IF THE USER IS AUTHORIZED TO EDIT OR DELETE THE CAMPGROUND
// i.e., TO CHECK IF THAT USER IS THE CORRECT OWNER OF THE CAMPGROUND 
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user is logged in 
    if (req.isAuthenticated()) {        
        //find the campground with provided ID
       Campground.findById(req.params.id, function(err, foundCampground){
           if (err) {
               res.redirect("back");
           } else {
               // does user own the campground
               // foundCampground.author.id is a Mongoose Object and req.user._id is a string 
               // And hence not the same, therefore comparing both the strings just won't work by '==' or '==='
               // For this purpose we use a mongoose compare method that is .equals() method
               if (foundCampground.author.id.equals(req.user._id)){
                    next();  
                } else {
                    res.redirect("back");
                }
           }
       });
   } else {
       res.redirect ("back");
   }  
}

// MIDDLEWARE TO CHECK IF THE USER IS AUTHORIZED TO EDIT OR DELETE THE CAMPGROUND
// I.E., TO CHECK IF THAT USER IS THE CORRECT OWNER OF THE COMMENT 
middlewareObj.checkCommentsOwnership = function(req, res, next) {
    // is user is logged in 
    if (req.isAuthenticated()) {        
        //find the campground with provided ID
       Comment.findById(req.params.comment_id, function(err, foundComment){
           if (err) {
               res.redirect("back");
           } else {
               // does user own the comment
               // foundComment.author.id is a Mongoose Object and req.user._id is a string 
               // And hence not the same, therefore comparing both the strings just won't work by '==' or '==='
               // For this purpose we use a mongoose compare method that is .equals() method
               if (foundComment.author.id.equals(req.user._id)){
                    next();  
                } else {
                    res.redirect("back");
                }
           }
       });
   } else {
       res.redirect ("back");
   }  
}

//MIDDLEWARE
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;