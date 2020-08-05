var express = require("express");
// We add all the routes to the router because
var router  = express.Router(); 
var Campground = require("../models/campgrounds");

// ==================
// CAMPGROUND ROUTES
// ==================

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounda from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log (err);
        } else {
            res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
        }
    });  
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, function (req, res){
    // get data from form
    var name = req.body.name; // fetch name of post
    var image = req.body.image; // fetch image of post
    var description = req.body.description;  // fetch description of post
    var author = {
        id: req.user._id,
        username: req.user.username
    } // Fetch Username and ID from User
     // Put it all into one object and push it later on
    var newCampground = {name: name, image: image, description: description, author: author};
    
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //console.log (foundCampground);
            //render show template with that campground
            res.render("campgrounds/show.ejs", {campground: foundCampground});
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
