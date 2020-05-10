const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var notificationSectionSchema = new Schema({
    sectionTitle: String,
    sectionBody: String,
    sectionLink: String,
    sectionLinkText: String,
},{
    toJSON: {
        getters: true,
    },
});

notificationSectionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

var notificationSchema = new Schema({
    title: String,
    body:[notificationSectionSchema],
    date: Date,
},{
    toJSON: {
        getters: true,
    },
});

notificationSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('notification', notificationSchema);
