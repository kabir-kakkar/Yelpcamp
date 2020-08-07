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

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true });
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
app.listen(PORT, process.env.IP);