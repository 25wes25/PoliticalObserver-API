const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var settingsSchema = new Schema({
    dataSharing: Boolean,
    pushNotifications: Boolean,
    personalized: Boolean,
},{
    toJSON: {
        getters: true,
    },
});

settingsSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('setting', settingsSchema);
