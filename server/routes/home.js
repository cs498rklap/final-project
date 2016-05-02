var express = require('express');
var router = express.Router();

var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
    res.json({ message: 'Congrats, you have successfully connected to our API!  Try accessing /jobs or /posts to use our API.', data: [] });
});

module.exports = router;