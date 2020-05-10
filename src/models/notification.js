const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var notificationSchema = new Schema({
    title: String,
    body:[{
        sectionTitle: String,
        sectionLink: String,
        sectionLinkText: String,
    }],
    date: String,
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