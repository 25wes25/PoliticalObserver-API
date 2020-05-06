const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var QuizSchema = new Schema({
    userID: String,
    socialAnswers: [Number],
    socialScore: Number,
    econAnswers: [Number],
    econScore: Number,
},{
    toJSON: {
        getters: true,
    },
});

QuizSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);
