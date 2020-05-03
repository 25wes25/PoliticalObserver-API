const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueModel = require('../models/issue');
const UserIssueModel = require('../models/userissue');

router.get('/userissues/userid/:userid', getUserIssueByUserId);
router.post('/userissues/', createUserIssue);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

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
            userIssue.save(function (error, dbRes) {
                if (error) return console.error(error);
                response.statusCode = statusOK;
                response.send(new UserIssueModel(dbRes));
            });
        }
        else
            response.send(null);
    }
    catch(error) {
        next(error);
    }
};

module.exports = router;

