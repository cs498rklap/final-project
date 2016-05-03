var express = require('express');
var Posts = require('./../models/post');
var router = express.Router();

var postsRoute = router.route('/');

// Get all posts
postsRoute.get(function(req, res) {
    // Create the Query
    var findString = req.query["find"];
    var findField = req.query["findField"];
    var query = null;
    if(findField == '"author"' && findString != undefined && findString != "") {
        query = Posts.find({author: new RegExp(findString.substring(1, findString.length-2), "i")});
    }
    else if(findField == '"title"' && findString != undefined && findString != "") {
        query = Posts.find({title: new RegExp(findString.substring(1, findString.length-2), "i")});
    }
    else if(findField == '"tags"' && findString != undefined && findString != "") {
        query = Posts.find({tags: new RegExp(findString.substring(1, findString.length-2), "i")});
    }
    else {
        query = Posts.find();
    }
    var queryString = req.query["where"];
    if(queryString == undefined || queryString == "") {
        queryString = "{}";
    }
    var queryJson = JSON.parse(queryString);
    query.where(queryJson);

    // Accept additional options from the user
    var sort = req.query.sort;
    if (typeof sort !== "undefined") {
        var sortJson = JSON.parse(sort);
        query.sort(sortJson);
    }
    var select = req.query["select"];
    if (typeof select !== "undefined") {
        var selectJson = JSON.parse(select);
        query.select(selectJson);
    }
    var skip = req.query["skip"];
    if (typeof skip !== "undefined" && !isNaN(parseInt(skip))) {
        query.skip(skip);
    }
    var limit = req.query["limit"];
    if (typeof limit !== "undefined" && !isNaN(parseInt(limit))) {
        query.limit(limit)
    }
    var count = req.query["count"];
    if (typeof count !== "undefined") {
        if(count.toLowerCase() === "true" || count === "1") {
            count = true;
        }
        else {
            count = false;
        }
    }
    if(count) {
        query.count();
    }

    // Run the query
    query.exec(function(err, data){
        if(err) {
            res.status(500);
            res.json({ message: "Error getting the list of posts from the database using the given query options.", data: [] });
            return;
        }
        res.status(200);
        res.json({ message: "OK", data: data });
    });
});

// Post new Post
postsRoute.post(function(req, res) {
    // Get values for the new post from the API call
    // Required:
    var title = req.body['title'];
    var author = req.body['author'];
    var content = req.body['content'];

    // Force required parameters to be defined before posting to the database:
    if( (title == undefined || title == "") && (author == undefined || author == "") && (content == undefined || content == "") ) {
        res.status(500);
        res.json({ message: "Validation Error: A title is required! An author is required! Content is required!", data: [] });
        return;
    }
    if ( (title == undefined || title == "") && (author == undefined || author == "") ) {
        res.status(500);
        res.json({ message: "Validation Error: A title is required! An author is required!", data: [] });
        return;
    }
    if ( (title == undefined || title == "") && (content == undefined || content == "") ) {
        res.status(500);
        res.json({ message: "Validation Error: A title is required! Content is required!", data: [] });
        return;
    }
    if ( (author == undefined || author == "") && (content == undefined || content == "") ) {
        res.status(500);
        res.json({ message: "Validation Error: An author is required! Content is required!", data: [] });
        return;
    }
    if ( ((title == undefined || title == "")) ) {
        res.status(500);
        res.json({ message: "Validation Error: A title is required!", data: [] });
        return;
    }
    if ( (author == undefined || author == "") ) {
        res.status(500);
        res.json( {message: "Validation Error: An author is required!", data: []} );
        return;
    }
    if ( (content == undefined || content == "") ) {
        res.status(500);
        res.json({ message: "Validation Error: Content is required!", data: [] });
        return;
    }

    // Optional:
    var tags = req.body['tags'];
    // Set default values if unspecified before posting to the database:
    if (tags == undefined || tags == "") {
        tags = [];
    }
    // Ignore comments given by the user; force it to be empty
    var comments = [];

    // Create the new post object
    var newPost = new Posts();
    newPost.title = title;
    newPost.author = author;
    newPost.content = content;
    newPost.tags = tags;
    newPost.comments = comments;

    // Save the new post object to the database
    newPost.save(function(err) {
        if (err){
            res.status(500);
            res.json({ message: "Error saving the new post to the database.", data: [] });
            return;
        }
        res.status(201);
        res.json({ message: "Post added.", data: newPost });
    });

});

// OPTIONS request for Posts
postsRoute.options(function(req, res){
    res.writeHead(200);
    res.end();
});

// All development above this line
module.exports = router;