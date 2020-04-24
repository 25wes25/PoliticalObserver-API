const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    dataSharing: Boolean,
    pushNotifications: Boolean,
    personalized: Boolean,
});


module.exports = mongoose.model('setting', settingsSchema);
