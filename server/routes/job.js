var express = require('express');
var router = express.Router();
var Job = require('../models/job');

var jobRoute = router.route('/:id');

jobRoute.get(function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if(err || !job) {
            res.status(404).send({ message: 'Job not found', data: []});
        }
        else {
            res.status(200).send({ message: 'Job found', data: job});
        }
    });
});

jobRoute.put(function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if(err || !job) {
            res.status(404).send({ message: 'Job not found', data: []});
        }
        else {
            var missing_fields = "";
            if(!req.body.title) {
                missing_fields += "Please enter a title!";
            }
            if(!req.body.company) {
                missing_fields += "Please enter a company!";
            }
            if(!req.body.city) {
                missing_fields += "Please enter a city!";
            }
            if(!req.body.state) {
                missing_fields += "Please enter a state!";
            }
            if(missing_fields !== "") {
                res.status(404).send({message: missing_fields, data:[]});
                return;
            }
            job.title = req.body.title;
            job.company = req.body.company;
            job.city = req.body.city;
            job.state = req.body.state;
            job.link = req.body.link;
            job.deadline = req.body.deadline;
            job.description = req.body.description;
            job.tags = req.body.tags;
            job.save(function(err) {
                if(err) {
                    res.status(404).send({ message: 'Job could not be updated', data: []});
                }
                else {
                    res.status(201).send({ message: 'Job updated', data: job});
                }
            });
        }
    });
});

jobRoute.delete(function(req, res) {
    Job.remove({_id: req.params.id}, function(err) {
        if(err) {
            res.status(404).send({ message: 'Job not found', data: []});
        }
        else {
            res.status(200).send({ message: 'Deleted job', data: []});
        }
    });
});

// All development above this line
module.exports = router;
