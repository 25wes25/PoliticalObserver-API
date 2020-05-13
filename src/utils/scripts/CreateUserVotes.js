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
const IssueModel = require('../../models/issue');
const UserIssueModel = require('../../models/userissue');
const IssueDataModel = require('../../models/issueData');

const genderKeys = ['Male', 'Female', 'Other'];
const genderValues = ['male', 'female', 'other'];
const partyKeys = ['Democrat', 'Republican', 'Libertarian', 'Green', 'Constitution', 'Unaligned'];
const partyValues = ['democrat', 'republican', 'libertarian', 'green', 'constitution', 'unaligned'];
const educationKeys = ['None', 'Diploma', 'Associates', 'Bachelors', 'Masters', 'Doctoral'];
const educationValues = ['none', 'diploma', 'associate\'s', 'bachelor\'s', 'master\'s', 'doctoral'];
const ethnicityKeys = ['White', 'AfricanAmerican', 'Asian', 'NativeAmerican', 'Hispanic', 'Other'];
const ethnicityValues = ['white', 'african american', 'asian', 'native american', 'hispanic', 'other'];


StoreUserIssues ();
async function StoreUserIssues () {
    try {
        let issues = await IssueModel.find().exec();
        for (let i = 0; i < 99; i++) {
            let user = await UserModel.find({email: 'test+mockUser' + i.toString() + '@gmail.com'}).exec();
            for(let j = 0; j<issues.length; j++)
            {
                let issueId = issues[j].id;
                let userId = user[0].id;
                let demographicId = user[0].demographicId;
                await createUserIssue(issueId, userId, demographicId);
            }
        }
    }
    catch (error) { console.log(error)}
}


async function createUserIssue(issueId, userId, demographicId) {
    let vote = (Math.random()*2) < 1 ? 'yes': 'no';
    try{
        let userIssueBody = {
            userId : userId,
            issueId : issueId,
            vote : vote,
            date : new Date(),
        }
        const userIssue = new UserIssueModel(userIssueBody);
        userIssue.save(async (error, dbRes) => {
            if (error) return console.error(error);
            let issueDataRes = await IssueDataModel.find({issueId: dbRes.issueId}).exec();
            let issueData = issueDataRes[0];
            let demographic = await DemographicModel.findById(demographicId).exec();
            let gender = String(demographic.gender).toLowerCase();
            let party = String(demographic.partyAffiliation).toLowerCase();
            let education = String(demographic.education).toLowerCase();
            let ethnicity = String(demographic.ethnicity).toLowerCase();
            if(String(dbRes.vote).toLowerCase()==='yes')
            {
                for(let i = 0; i<genderKeys.length; i++) {
                    if(gender===genderValues[i]) {
                        issueData.yes.gender[genderKeys[i]]+=1
                        break;}
                }
                for(let i = 0; i<partyKeys.length; i++) {
                    if(party===partyValues[i]) {
                        issueData.yes.party[partyKeys[i]]+=1
                        break;}
                }
                for(let i = 0; i<educationKeys.length; i++) {
                    if(education===educationValues[i]) {
                        issueData.yes.education[educationKeys[i]]+=1
                        break;}
                }
                for(let i = 0; i<ethnicityKeys.length; i++) {
                    if(ethnicity===ethnicityValues[i]) {
                        issueData.yes.ethnicity[ethnicityKeys[i]]+=1
                        break;}
                }
            } else {
                for(let i = 0; i<genderKeys.length; i++) {
                    if(gender===genderValues[i]) {
                        issueData.no.gender[genderKeys[i]]+=1
                        break;}
                }
                for(let i = 0; i<partyKeys.length; i++) {
                    if(party===partyValues[i]) {
                        issueData.no.party[partyKeys[i]]+=1
                        break;}
                }
                for(let i = 0; i<educationKeys.length; i++) {
                    if(education===educationValues[i]) {
                        issueData.no.education[educationKeys[i]]+=1
                        break;}
                }
                for(let i = 0; i<ethnicityKeys.length; i++) {
                    if(ethnicity===ethnicityValues[i]) {
                        issueData.no.ethnicity[ethnicityKeys[i]]+=1
                        break;}
                }
            }
            await IssueDataModel.findOneAndUpdate({issueId: dbRes.issueId}, {yes: issueData.yes, no:issueData.no}).exec();
        });

    }
    catch(error) {
        console.error(error);
    }
};
