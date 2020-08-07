var express = require("express");
// We add all the routes to the router because
var router  = express.Router(); 
var Campground = require("../models/campgrounds");
var middleware = require("../middleware/index.js");

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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res){
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

// EDIT CAMPGROUNDS GET ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render ("campgrounds/edit", {campground: foundCampground});
    });
});

// EDIT CAMPGROUNDS PUT REQUEST ROUTE FOR UPDATING THE DETAILS OF THE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground 
    // redirect to campground's show page

    // We have put campground's name, image and description into one object 
    // via name=campground[name], etc in campgrounds/edit.ejs so that we get a proper group of campground's 
    // details which we request it via req.body.campground

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete ("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // This functions finds the campground by id and removes it from the database.
    Campground.findByIdAndRemove (req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect ("/campgrounds");
        }
    })
});

module.exports = router;
