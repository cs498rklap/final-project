var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    company: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    link: {type: String},
    deadline: {type: Date},
    description: {type: String},
    tags: {type: [String]},
    dateCreated: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Job', JobSchema);