const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var issueSchema = new Schema({
    title: String,
    description: String,
    pros: String,
    cons: String,
    notes: String,
    date: Date,
},{
    toJSON: {
        getters: true,
    },
});

issueSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('issue', issueSchema);
