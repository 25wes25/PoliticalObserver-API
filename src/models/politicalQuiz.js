const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var politicalQuizSchema = new Schema({
    userId: String,
    socialAnswers: [Number],
    socialScore: Number,
    econAnswers: [Number],
    econScore: Number,
    politicalScore: String,
},{
    toJSON: {
        getters: true,
    },
});

politicalQuizSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('politicalQuiz', politicalQuizSchema);
