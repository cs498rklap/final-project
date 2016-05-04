// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Packages from user auth tutorial for passport
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// routes
var homeRoute = require('./routes/home');
var jobsRoute = require('./routes/jobs');
var jobRoute = require('./routes/job');
var postsRoute = require('./routes/posts');
var postRoute = require('./routes/post');
var userRoute = require('./routes/user');

// mongodb config
var mongoConfig = require('./models/secret');
mongoose.connect(mongoConfig.url);

// user schema/model
var User = require('./models/user');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 3000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true // maybe change to false
}));

// Use the passport package in our application for user auth

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// Possibly use extra packages needed by passport???
app.use(logger('dev'));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// All our routes will start with /api
app.use('/api', homeRoute);
app.use('/api/jobs', jobsRoute);
app.use('/api/jobs', jobRoute);
app.use('/api/posts', postsRoute);
app.use('/api/posts', postRoute);
app.use('/api/user', userRoute);

app.use('/', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
