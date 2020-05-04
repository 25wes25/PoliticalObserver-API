const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueModel = require('../models/issue');
const UserIssueModel = require('../models/userissue');
const DemographicModel = require('../models/demographic');
const IssueDataModel = require('../models/issueData');
const UserModel = require('../models/user');

router.get('/userissues/userid/:userid', getUserIssueByUserId);
router.post('/userissues/', createUserIssue);


// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;
const genderKeys = ['Male', 'Female', 'Other'];
const genderValues = ['male', 'female', 'other'];
const partyKeys = ['Democrat', 'Republican', 'Libertarian', 'Green', 'Constitution', 'Unaligned'];
const partyValues = ['democrat', 'republican', 'libertarian', 'green', 'constitution', 'unaligned'];
const educationKeys = ['None', 'Diploma', 'Associates', 'Bachelors', 'Masters', 'Doctoral'];
const educationValues = ['none', 'diploma', 'associates', 'bachelors', 'masters', 'doctoral'];
const ethnicityKeys = ['White', 'AfricanAmerican', 'Asian', 'NativeAmerican', 'Hispanic', 'Other'];
const ethnicityValues = ['white', 'african american', 'asian', 'native american', 'hispanic', 'other'];

//get all issue that a user have voted on
async function getUserIssueByUserId(request, response, next) {
    try {
        let userIssues = await UserIssueModel.find({userId: String(request.params.userid).toLowerCase()}).exec();
        let votedIssuesAndStats = [];
        for(let i = 0; i<userIssues.length; i++)
        {
            let issueId = String(userIssues[i].issueId);
            let issue = await IssueModel.findById(issueId).exec();
            let stats = await getStatsForOneIssue(issueId);
            let issueAndStats = {
                issueId: userIssues[i].issueId,
                userId: userIssues[i].userId,
                vote: userIssues[i].vote,
                title: issue.title,
                description: issue.description,
                pros: issue.pros,
                cons: issue.cons,
                date: userIssues[i].date,
                yes : stats.yes,
                no : stats.no,
                total : stats.total
            }
            votedIssuesAndStats.push(issueAndStats);
        }
        response.statusCode = statusOK;
        response.send(votedIssuesAndStats);
    } catch (error) {
        next(error);
    }
}

//Helper function for getUserIssueByUserId
//Gets stats for number of yes/no votes on an issue id
async function getStatsForOneIssue(id) {
    try {
        let stats = {};
        let userIssues = await UserIssueModel.find({issueId: id}).exec();
        let voteYes = 0;
        let voteNo = 0;
        for(let i = 0; i<userIssues.length; i++)
        {
            if(userIssues[i].vote == "yes")
                voteYes++;
            else
                voteNo++;
        }
        stats =
            {
                yes : String(voteYes),
                no : String(voteNo),
                total : String(voteYes+voteNo)
            }
        return stats;
    } catch (error) {
    }
}

async function createUserIssue(request, response, next) {
    // get data from request
    let newObject = request.body;
    try{
        //check if issue exists
        let userIssueFounded = await UserIssueModel.find({issueId: request.body.issueId, userId: String(request.body.userId).toLowerCase()}).exec();
        if(userIssueFounded.length == 0)
        {
            // add data to MongoDB database
            const userIssue = new UserIssueModel(newObject);
            userIssue.save(async (error, dbRes) => {
                if (error) return console.error(error);
                //find and update the existing issueData accordingly
                let issueDataRes = await IssueDataModel.find({issueId: userIssue.issueId}).exec();
                let issueData = issueDataRes[0];
                let user = await UserModel.findById(userIssue.userId).exec();
                let demographic = await DemographicModel.findById(user.demographicId).exec();
                let gender = String(demographic.gender).toLowerCase();
                let party = String(demographic.partyAffiliation).toLowerCase();
                let education = String(demographic.education).toLowerCase();
                let ethnicity = String(demographic.ethnicity).toLowerCase();
                if(String(userIssue.vote).toLowerCase()==='yes')
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
                await IssueDataModel.findOneAndUpdate({issueId: userIssue.issueId}, {yes: issueData.yes, no:issueData.no}).exec();

                response.statusCode = statusOK;
                response.send(new UserIssueModel(dbRes));
            });
        }
        else //if user has voted before on the issue, do nothing
            response.send(null);
    }
    catch(error) {
        next(error);
    }
};

module.exports = router;

