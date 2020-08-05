var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

// when a user reaches this route, our middleware isLoggedIn kicks in
// if the user is logged in, it calls next, which will show the add a comment form
// if the user is not logged in, then we redirect to "/login" 
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new.ejs", {campground: campground});
        }
    });
});

// The isLoggedIn middleware is added here as someone could just 
// send a post request through postman and add a comment
router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {   
        //create new comment
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
                //connect new comment to campground
               campground.comments.push(comment);
               campground.save();
                //redirect campground show page
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

//MIDDLEWARE
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
