const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    demographicId: String,
    settingsId: String,
});


module.exports = mongoose.model('user', userSchema);
