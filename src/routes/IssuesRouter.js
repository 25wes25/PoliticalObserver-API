const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueModel = require('../models/issue');
const UserIssueModel = require('../models/userissue');
const IssueDataModel = require('../models/issueData');

router.post('/issues/', createIssue);
router.get('/issues', getAllIssues);
router.get('/issues/:issueId/userId/:userId', getIssueById);
router.get('/issues/:userId', getUsersIssues);
router.get('/issues/filter/:userId/:keyword', getIssueByKeyword);
router.get('/issues/search/:search', getIssuesBySearch);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;


// GET (one) issue by issue id
async function getIssueById(request, response, next) {
    try {
        let issue = await IssueModel.findById(request.params.issueId).exec();
        let userIssue = await UserIssueModel.find({userId: String(request.params.userId).toLowerCase(), issueId: String(request.params.issueId).toLowerCase()}).exec();
        let votedInfo = {};
        if (userIssue.length > 0) {
            votedInfo.voted = true;
            votedInfo.vote = userIssue[0].vote;
            let voteYes = 0;
            let voteNo = 0;
            let userIssues = await UserIssueModel.find({issueId: String(request.params.issueId).toLowerCase()}).exec();
            for(let i = 0; i<userIssues.length; i++)
            {
                if(userIssues[i].vote === "yes")
                    voteYes++;
                else
                    voteNo++;
            }
            votedInfo.data = [{x:'no', y:voteNo}, {x:'yes', y:voteYes}];
        } else {
            votedInfo.voted = false;
            votedInfo.vote = false;
            votedInfo.data = [];
        }
        response.statusCode = statusOK;
        response.send({issue, votedInfo});
    } catch (error) {
        next(error);
    }
}

async function getAllIssues(request, response, next) {
    try {
        let issues = await IssueModel.find().exec();
        response.statusCode = statusOK;
        response.send(issues);
    } catch (e) {
        next(e);
    }
}

async function getUsersIssues(request, response, next) {
    try {
        let userIssues = await UserIssueModel.find({userId: String(request.params.userId).toLowerCase()}).exec();
        let issues = [];
        for(let i = 0; i < userIssues.length; i++)
        {
            issues.push(await IssueModel.findById(userIssues[i].issueId).exec());
        }
        response.statusCode = statusOK;
        response.send(issues);
    } catch (error) {
        next(error);
    }
}

async function getIssueByKeyword(request, response, next) {
    //Get all issues filtered by a keyword (to get all -> keyword=all)
    try {
        let issues = await IssueModel.find().exec();
        let userIssues = await UserIssueModel.find({userId: String(request.params.userId).toLowerCase()}).exec();
        let filteredIssues = [];
        let keyword = String(request.params.keyword).toLowerCase();
        for(let i = 0; i<issues.length; i++)
        {
            let desc = String(issues[i].description).toLowerCase();
            let title = String(issues[i].title).toLowerCase();
            if(desc.includes(keyword) || title.includes(keyword))
            {
                filteredIssues.push(issues[i]);
            }
        }
        for(let i = 0; i<filteredIssues.length; i++)
        {
            for(let j = 0; j<userIssues.length; j++){
                if(filteredIssues[i]._id==userIssues[j].issueId) {
                    filteredIssues.splice(i--, 1);
                    break;
                }
            };
        }
        response.statusCode = statusOK;
        response.send(filteredIssues);
    } catch (error) {
        next(error);
    }
}

async function createIssue(request, response, next) {
    let body = request.body;
    body.date = new Date();
    const issue = new IssueModel(body);
    issue.save(async (err, dbRes) => {
        if (err) return console.error(err);
        response.statusCode = statusOK;
        response.send(new IssueModel(dbRes));
        let data = {
                issueId: new IssueModel(dbRes).id,
                yes: {
                    gender:{Male: 0, Female: 0, Other: 0},
                    party:{Democrat: 0, Republican: 0, Libertarian: 0, Green: 0, Constitution: 0, Unaligned:0},
                    education:{None: 0, Diploma: 0, Associates: 0, Bachelors: 0, Masters: 0, Doctoral:0},
                    ethnicity:{White: 0, AfricanAmerican: 0, Asian: 0, NativeAmerican: 0, Hispanic: 0, Other:0}

                },
                no:{
                    gender:{Male: 0, Female: 0, Other: 0},
                    party:{Democrat: 0, Republican: 0, Libertarian: 0, Green: 0, Constitution: 0, Unaligned:0},
                    education:{None: 0, Diploma: 0, Associates: 0, Bachelors: 0, Masters: 0, Doctoral:0},
                    ethnicity:{White: 0, AfricanAmerican: 0, Asian: 0, NativeAmerican: 0, Hispanic: 0, Other:0}
                }
            }
        let issueData = new IssueDataModel(data);
        await issueData.save(function (err, dbRes) {
            if (err) console.error(err);
        });
    });
}

async function getIssuesBySearch(request, response, next) {
    try {
        let issues = await IssueModel.find({title: {$regex: request.params.search, $options: "i"}}).exec();
        response.statusCode = statusOK;
        response.send(issues);
    } catch (e) {
        next(e);
    }
}

module.exports = router;

