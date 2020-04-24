const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const politicianSchema = new Schema({
    name: String,
    bio: String,
});


module.exports = mongoose.model('politician', politicianSchema);
