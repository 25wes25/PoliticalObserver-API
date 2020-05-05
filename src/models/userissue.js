const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userIssueSchema = new Schema({
    userId: String,
    issueId: String,
    vote: String,
    date: Date,
},{
    toJSON: {
        getters: true,
    },
});

userIssueSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('user-issue', userIssueSchema);
