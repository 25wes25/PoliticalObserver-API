const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const demographicSchema = new Schema({
    ageRange: String,
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
});

module.exports = mongoose.model('demographic', demographicSchema);
