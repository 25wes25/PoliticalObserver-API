const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userIssueSchema = new Schema({
    issueId: String,
    userId: String,
    vote: String,
    date: String
});


module.exports = mongoose.model('user-issue', userIssueSchema);