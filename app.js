var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require ("passport"),
    LocalStrategy   = require ("passport-local"),
    Campground      = require("./models/campgrounds.js"),
    Comment         = require("./models/comment.js"),
    User            = require ("./models/user.js"),
    seedDB          = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
// __dirname is the directory on which this script is running
// Serve public directory for using stylesheet
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
// Seeding the Database means removing all data that we have already and add a pre defined data to the database
//seedDB();

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

app.get("/", function(req, res){
    res.render ("landing.ejs");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs");
});

//CREATE - add new campground to DB
app.post("/campgrounds", function (req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description}; 
    
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
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log (foundCampground);
            //render show template with that campground
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new.ejs", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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

// ==================
// AUTH ROUTES
// ==================

app.get("/register", function(req, res){
    res.render("register");
});

//HANDLE SIGN UP LOGIC
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login.ejs");
});

// POST REQUEST FOR LOG IN
// app.post ("/route", middleware, callbackfunction)
app.post ("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
            // THIS CALLBACK DOESN'T DO ANYTHING
});

app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started!");
 });