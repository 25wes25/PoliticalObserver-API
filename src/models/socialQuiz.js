const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const socialQuizSchema = new Schema({
    userID: String,
    socialAnswers: [Number],
    socialScore: Number,
});


module.exports = mongoose.model('socialQuiz', socialQuizSchema);