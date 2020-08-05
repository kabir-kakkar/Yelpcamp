var User      = require("./models/user.js");

function removeUsersfromDB(){
    // Remove all Users
    User.remove({}, function(err){
        if (err) {
            console.log (err);
        } else {
            console.log ("Removed all Users from DB");
        }
    });
}

module.exports = removeUsersfromDB;