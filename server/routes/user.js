var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username, name: req.body.name, email: req.body.email }),
    req.body.password, function(err, account) {
        if (err) {
            return res.status(500).json({
                message: 'Unable to register user',
                data: err
            });
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
                status: 'Registration successful!'
            });
        });
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                data: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    message: 'Could not log in user',
                    data: err
                });
            }
            res.status(200).json({
                message: 'Login successful!'
            });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({message: 'Bye!'});
});

router.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            message: 'Retrieved user status',
            status: false
        });
    }
    res.status(200).json({
        message: 'Retrieved user status',
        status: true
    });
});

router.get('/info', function(req, res) {
    console.log(req.user);
});

// All development above this line
module.exports = router;