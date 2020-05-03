const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var socialQuizSchema = new Schema({
    userID: String,
    socialAnswers: [Number],
    socialScore: Number,
},{
    toJSON: {
        getters: true,
    },
});

socialQuizSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('socialQuiz', socialQuizSchema);
