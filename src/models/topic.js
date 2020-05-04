const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var topicSchema = new Schema({
    title: String,
    category: String,
    subCategory: String,
    description: String,
    body: String,
},{
    toJSON: {
        getters: true,
    },
});

topicSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('topic', topicSchema);
