# Yelpcamp
This is the Yelpcamp project done under Udemy's "The Web Developer Bootcamp" taught by Colt Steele.
See the Deployed Version on Heroku Here

## Introduction
In this project, users first have to create an account and then log in, followed by creating a campground and uploading it on Yelpcamp.

This project ensures complete authorization for deciding the correct owner of the campground/comment.

## Features
* Campgrounds 
  * Provides Add Route
  * Provides Edit Route (Authorized Users only)
  * Provides Delete Route (Authorized Users only)
* Comments 
  * Provides Add Route
  * Provides Edit Route (Authorized Users only)
  * Provides Delete Route (Authorized Users only)
  
## How to Run it ?
1. Install MongoDB & Node
2. Clone this project on your device.
```
git clone https://github.com/kabir-kakkar/Yelpcamp.git
npm install
```
3. Start the Project
```
node app.js
```

# Note:
For the deployed version, use the following reference:
Here process.env.DATABASEURL has DATABASEURL = "<The Cloud's Link (Here MongoAtlas Link) where you mongo server is serving>"
```
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require ("passport"),
    LocalStrategy   = require ("passport-local"),
    methodOverride  = require ("method-override"),
    Campground      = require("./models/campgrounds"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    flash           = require("connect-flash"),
    removeAllUsers  = require ("./seedUser.js"),
    seedDB          = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true });
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended:true}));
// __dirname is the directory on which this script is running
// Serve public directory for using stylesheet
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

// Seeding the Database means removing all data that we have already and add a pre defined data to the database
//seedDB();
//removeAllUsers(); // This code removes all Users from the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dogs!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This is a middleware that we pass through every route 
// as we require the data of the user to be passed in the Nav Bar present in the header
// of every ejs page. This is possible if we pass the data of the user through every route
app.use (function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash ("error");
    res.locals.success     = req.flash ("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("listening on http://localhost:3000/");
});
```
