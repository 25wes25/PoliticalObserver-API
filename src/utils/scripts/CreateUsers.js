const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/PoliticalObserver';

// Connect to MongoDB server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected: ', url)
});

db.on('error', err => {
    console.error('Connection error: ', err)
});

const UserModel = require('../../models/user');
const DemographicModel = require('../../models/demographic');
const SettingsModel = require('../../models/settings');

const {gender, state, maritalStatus, ethnicity, education, personalityType, partyAffiliation} = require('../../../constants');

for (let i = 0; i < 100; i++) {
    let userData = {
        email: 'test+mockUser' + i.toString() + '@gmail.com',
        age: Math.floor(Math.random() * 70),
        state: state[Math.floor(Math.random() * state.length)],
        gender: gender[Math.floor(Math.random() * gender.length)],
        ethnicity: ethnicity[Math.floor(Math.random() * ethnicity.length)],
        maritalStatus: maritalStatus[Math.floor(Math.random() * maritalStatus.length)],
        education: education[Math.floor(Math.random() * education.length)],
        occupation: '',
        income: Math.floor(Math.random() * 600000),
        personalityType: personalityType[Math.floor(Math.random() * personalityType.length)],
        partyAffiliation: partyAffiliation[Math.floor(Math.random() * partyAffiliation.length)],
        politicalAffiliation: '',
    };
    const demographic = new DemographicModel(userData);
    demographic.save(async (err, dbRes) => {
        if (err) return console.error(err);
        const demographicResult = new DemographicModel(dbRes);
        userData.demographicId = demographicResult.id;
        const settings = new SettingsModel(userData);
        settings.save(async (err, dbRes) => {
            if (err) return console.error(err);
            const settingsResult = new SettingsModel(dbRes);
            userData.settingsId = settingsResult.id;
            const user = new UserModel(userData);
            user.save(function (err, dbRes) {
                if (err) console.error(err);
            });
        });
    });
}
