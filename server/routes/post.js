var express = require('express');
var router = express.Router();

var Post = require('../models/post');

var postRoute = router.route('/:id');

postRoute.get(function(req, res) {
    Post.findById(req.params.id, function(err, data) {
        if (err) {
            res.status(500);
            res.json({message: 'Unable to retrieve post with specified id', data: err});
        } else {
            if (data) {
                res.status(200);
                res.json({message: 'Post retrieved successfully', data: data});
            } else {
                res.status(404);
                res.json({message: 'Post not found'});
            }
        }
    });
});

postRoute.put(function(req, res) {
    var setAttributes = {
        $set: {}
    };

    if (req.body.title)
        setAttributes.$set.title = req.body.title;
    if (req.body.author)
        setAttributes.$set.author = req.body.author;
    if (req.body.content)
        setAttributes.$set.content = req.body.content;
    if (req.body.tags)
        setAttributes.$set.tags = req.body.tags;
    if (req.body.$pull)
        setAttributes.$pull = req.body.$pull;
    if (req.body.$push)
        setAttributes.$push = req.body.$push;

    var params;
    if (req.body.cid) {
        setAttributes.$set['comments.$.text'] = req.body.ctext;
        Post.findOneAndUpdate({'_id': req.params.id, 'comments._id': req.body.cid}, setAttributes, {new: true}, function(err, data) {
            if (err) {
                res.status(500);
                res.json({message: 'Unable to update post', data: err});
            } else if (data) {
                res.status(200);
                res.json({message: 'Updated post successfully', data: data});
            } else {
                res.status(404);
                res.json({message: 'Unable to find post with id to update', data: data});
            }
        });
    } else {
        Post.findByIdAndUpdate(req.params.id, setAttributes, {new: true}, function(err, data) {
            if (err) {
                res.status(500);
                res.json({message: 'Unable to update post', data: err});
            } else if (data) {
                res.status(200);
                res.json({message: 'Updated post successfully', data: data});
            } else {
                res.status(404);
                res.json({message: 'Unable to find post with id to update', data: data});
            }
        });
    }
});

postRoute.delete(function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err, data) {
        if (err) {
            res.status(500);
            res.json({message: 'Unable to delete post with specified id', data: err});
        } else if (data) {
            res.status(200);
            res.json({message: 'Post deleted successfully'});
        } else {
            res.status(404);
            res.json({message: 'Unable to find post to delete'});
        }
    });
});

// All development above this line
module.exports = router;