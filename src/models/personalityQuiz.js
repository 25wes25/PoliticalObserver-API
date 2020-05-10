const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var personalityQuizSchema = new Schema({
    userId: String,
    mindAnswers: [Number],
    energyAnswers: [Number],
    natureAnswers: [Number],
    tacticAnswers: [Number],
    personalityScore: String,
},{
    toJSON: {
        getters: true,
    },
});

personalityQuizSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('personalityQuiz', personalityQuizSchema);
