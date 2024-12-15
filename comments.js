// Create web server
// npm install express
// npm install body-parser
// npm install mongoose
// npm install ejs
// npm install express-sanitizer
// npm install method-override
// npm install express-session
// npm install connect-flash
// npm install passport
// npm install passport-local
// npm install passport-local-mongoose

// 1. Set up a web server
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// 2. Connect to the database
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// 3. Set up body-parser
app.use(bodyParser.urlencoded({extended: true}));

// 4. Set up ejs
app.set("view engine", "ejs");

// 5. Set up express static
app.use(express.static(__dirname + "/public"));

// 6. Set up express-sanitizer
app.use(expressSanitizer());

// 7. Set up method-override
app.use(methodOverride("_method"));

// 8. Set up flash
app.use(flash());

// 9. Set up passport
app.use(require("express-session")({
    secret: "I love you",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

// 10. Set up middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// 11. Set up routes
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        };
    });
});
