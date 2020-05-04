const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var issueDataSchema = new Schema({
    issueId: String,
    yes: {
        gender:{Male: Number, Female: Number, Other: Number}
    },
    no:{
        gender:{Male: Number, Female: Number, Other: Number}
    }
},{
    toJSON: {
        getters: true,
    },
});

issueDataSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('issueData', issueDataSchema);