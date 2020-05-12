const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var politicalIdeologySchema = new Schema({
    ideology: String,
    description: String,
},{
    toJSON: {
        getters: true,
    },
});

politicalIdeologySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('politicalIdeology', politicalIdeologySchema);
