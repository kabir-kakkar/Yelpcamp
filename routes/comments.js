var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// ====================
// COMMENTS ROUTES
// ====================

// when a user reaches this route, our middleware isLoggedIn kicks in
// if the user is logged in, it calls next, which will show the add a comment form
// if the user is not logged in, then we redirect to "/login" 
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {   
        //create new comment
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash ("error", "Something went wrong");
               console.log(err);
           } else {
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                // save comment
                comment.save();
                //connect new comment to campground
               campground.comments.push(comment);
               campground.save();
                //redirect campground show page
                req.flash ("success", "Successfully added comment");
                res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    // Here we first find the id of the Comment
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect ("back");
        } else {
            // If the ID is found then we plug in the values of campground_id and put in the details of comment
            res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
// We update it to /:comment_id 
router.put ("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    // We find the comment by id and make a update request
    // by passing in the comment_id as first parameter,
    // the body's comment as second parameter (See edit.ejs, comment[text], comment[author] is defined)
    // and then the callback function
    Comment.findByIdAndUpdate (req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            // req.params.id has the campgrounds id as we have used it in app.use("campgrounds/:id/comments") route
            res.redirect ("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTES
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect ("back");
        } else {
            // Req.params.id is for campground's id and not the comment's id
            // for comments's id, it is req.params.comment_id which is picked up from the url 
            req.flash ("success", "Comment deleted!");
            res.redirect ("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;
