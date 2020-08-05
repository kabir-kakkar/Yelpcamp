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
            console.log ("error");
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect ("/campgrounds");
        });
    });
});

// SHOW LOG IN FORM
router.get("/login", function(req, res){
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
    res.redirect("/campgrounds");
});

//MIDDLEWARE
function isLoggedIn (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;