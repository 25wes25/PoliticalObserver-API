const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const issueSchema = new Schema({
    title: String,
    description: String,
    pros: String,
    cons: String,
    notes: String,
    date: String
});


module.exports = mongoose.model('issue', issueSchema);