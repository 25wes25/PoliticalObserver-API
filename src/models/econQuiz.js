const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const econQuizSchema = new Schema({
    userID: String,
    econAnswers: [Number],
    econScore: Number,
});


module.exports = mongoose.model('econQuiz', econQuizSchema);