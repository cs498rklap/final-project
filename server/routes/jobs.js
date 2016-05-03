var express = require('express');
var router = express.Router();

var Job = require('../models/job');

var jobsRoute = router.route('/');

jobsRoute.get(function(req, res) {
    var query = Job.find();
    if (req.query.where&&req.query.where!="") {
        query=query = Job.find(eval("("+req.query.where+")"));
    }
    if(req.query.sort&&req.query.sort!=""){
        query=query.sort(eval("("+req.query.sort+")"));
    }
    if(req.query.select&&req.query.select!=""){
        query=query.select(eval("("+req.query.select+")"));
    }
    if(req.query.skip&&req.query.skip!=""){
        query=query.skip(req.query.skip);
    }
    if(req.query.limit&&req.query.limit!=""){
        query=query.limit(req.query.limit);
    }
    if(req.query.count&&req.query.count!=""){
        query=query.count();
    }
    query.exec(function (err, results){
        if (err) {
            console.log(err);
            res.status(500);
            res.json({message: "Failed to retrieve jobs", data: []});
            res.end();
        } else {
            res.status(200);
            res.json({message: "OK", data: results});
            res.end();
        }
    });
});

jobsRoute.post(function(req, res) {
    var title = req.body['title'];
    var company = req.body['company'];
    var city = req.body['city'];
    var state = req.body['state'];
    var link = req.body['link'];
    var description = req.body['description'];
    var tags = req.body['tags'];
    var deadline = req.body['deadline'];
    var author = req.body['author'];
    var user = req.body['user'];

    var errorMessage = "Validation Error:";
    var deadlinePassed = false;
    if (deadline && deadline!="") {
        deadlinePassed=true;
    }
    if (!title || title=="") {
        errorMessage=errorMessage.concat(" A job title is required!");
    }
    if (!company || company=="") {
        errorMessage=errorMessage.concat(" A company name is required!");
    }
    if (!city || city=="") {
        errorMessage=errorMessage.concat(" A city is required!");
    }
    if (!state || state=="") {
        errorMessage=errorMessage.concat(" A state is required!");
    }
    if (!user || user=="" || !author || author=="") {
        errorMessage=errorMessage.concat(" Failed to pass in authors information properly!");
    }
    if (!(errorMessage=="Validation Error:")){
        res.status(500);
        res.json({message: errorMessage, data:[]});
        res.end();
    } else {
        var deadlineDate = new Date(deadline);
        //If date was not a valid string format check to see if integer
        if (isNaN(deadlineDate.getTime())){
            deadlineDate = new Date(parseInt(deadline));
        }
        if (isNaN(deadlineDate.getTime()) && deadlinePassed ) {
            res.status(500);
            res.json({
                message: "Validation Error: Cast to Date failed for value \"" + deadline + "\" at path \"deadline\" ",
                data: []
            });
            res.end();
        } else {
            var newJob = new Job();
            newJob.title = title;
            newJob.company = company;
            newJob.city = city;
            newJob.state = state;
            newJob.author = author;
            newJob.user = user;
            if (link) {
                newJob.link = link;
            }
            if (description) {
                newJob.description = description;
            }
            if (tags) {
                newJob.tags = tags;
            }
            if (deadlinePassed) {
                newJob.deadline = deadlineDate;
            }
            newJob.save(function (err, job) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.json({message: "Failed to save job", data: []});
                    res.end();
                } else {
                    res.status(201);
                    res.json({message: "Job added", data: job});
                    res.end();
                }
            });
        }
    }
});

jobsRoute.options(function(req, res) {
    res.writeHead(200);
    res.end();
});
// All development above this line
module.exports = router;