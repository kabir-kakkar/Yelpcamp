var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

// LANDING PAGE
router.get("/", function(req, res){
    res.render ("landing.ejs");
});

// ==================
// AUTH ROUTES
// ==================

// SIGN UP ROUTE
router.get("/register", function(req, res){
    res.render("register");
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register ( newUser , req.body.password, function(err, user){
        if (err) {
            req.flash ("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash ("success", "Welcome to Yelpcamp " + user.username);
            res.redirect ("/campgrounds");
        });
    });
});

// SHOW LOG IN FORM
router.get("/login", function(req, res){
    // Per the docs, you can either set a flash message on the 
    // req.flash object before returning a res.redirect() or 
    //you can pass the req.flash object into the res.render() function.
    res.render("login.ejs");
});

// POST REQUEST FOR LOG IN
// app.post ("/route", middleware, callbackfunction)
router.post ("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
            // THIS CALLBACK DOESN'T DO ANYTHING
});

// LOG OUT ROUTE
router.get("/logout", function(req, res){
    // Passport exposes a logout() function on req (also aliased as logOut()) 
    //that can be called from any route handler which needs to terminate a login session. 
    //Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;