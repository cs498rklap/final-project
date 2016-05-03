var express = require('express');
var router = express.Router();
var Job = require('../models/job');

var jobRoute = router.route('/:id');

jobRoute.get(function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if (err) {
            res.status(500).json({ message: 'Unable to retrieve job with specified id', data: err });
        } else if (!job) {
            res.status(404).json({ message: 'Job not found'});
        } else {
            res.status(200).json({ message: 'Job found', data: job});
        }
    });
});

jobRoute.put(function(req, res) {
    Job.findById(req.params.id, function(err, job) {
        if (err) {
            res.status(500).json({ message: 'Unable to update job with specified id', data: err });
        } else if(!job) {
            res.status(404).json({ message: 'Job not found' });
        }
        else {
            var missing_fields = "";
            if(!req.body.title) {
                missing_fields += "Please enter a title!\n";
            }
            if(!req.body.company) {
                missing_fields += "Please enter a company!\n";
            }
            if(!req.body.city) {
                missing_fields += "Please enter a city!\n";
            }
            if(!req.body.state) {
                missing_fields += "Please enter a state!\n";
            }
            if(missing_fields !== "") {
                res.status(404).json({ message: missing_fields });
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
                    res.status(500).json({ message: 'Job could not be updated', data: err});
                }
                else {
                    res.status(201).json({ message: 'Job updated', data: job});
                }
            });
        }
    });
});

jobRoute.delete(function(req, res) {
    Job.remove({_id: req.params.id}, function(err) {
        if(err) {
            res.status(404).json({ message: 'Job not found', data: err});
        }
        else {
            res.status(200).json({ message: 'Deleted job'});
        }
    });
});

// All development above this line
module.exports = router;