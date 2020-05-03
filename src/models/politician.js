const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var politicianSchema = new Schema({
    name: String,
    bio: String,
},{
    toJSON: {
        getters: true,
    },
});

politicianSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('politician', politicianSchema);
