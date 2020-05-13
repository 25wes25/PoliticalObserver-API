const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let urlSchema = new Schema({
    uri: String,
},{
    toJSON: {
        getters: true,
    },
});

urlSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

var politicianSchema = new Schema({
    name: String,
    position: String,
    party: String,
    state: String,
    dateOfBirth: Date,
    bio: String,
    address: String,
    phone: String,
    website: urlSchema,
    imageUrl: urlSchema,
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
