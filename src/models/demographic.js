const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var demographicSchema = new Schema({
    age: Number,
    gender: String,
    ethnicity: String,
    maritalStatus: String,
    education: String,
    occupation: String,
    incomeLevel: String,
    state: String,
    personalityType: String,
    partyAffiliation: String,
    politicalAffiliation: String,
},{
    toJSON: {
        getters: true,
    },
});

demographicSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('demographic', demographicSchema);
