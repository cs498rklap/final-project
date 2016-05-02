var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    user: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    tags: {type: [String]},
    content: {type: String, required: true},
    comments: {type: [
        {
            username: {type: String, required: true},
            text: {type: String, required: true},
            timestamp: {type: Date, default: Date.now}
        }
    ]}
});

module.exports = mongoose.model('Post', PostSchema);