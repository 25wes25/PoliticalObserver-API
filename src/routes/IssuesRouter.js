const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueModel = require('../models/issue');
const UserIssueModel = require('../models/userissue');
const IssueDataModel = require('../models/issueData');

router.get('/issues/id/:id', getIssueById);
router.get('/issues/:userid', getIssues);
router.get('/issues/filter/:userid/:keyword', getIssueByKeyword);
router.post('/issues/', createIssue);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;


// GET (one) issue by issue id
async function getIssueById(request, response, next) {
    try {
        let issue = await IssueModel.findById(request.params.id).exec();
        response.statusCode = statusOK;
        response.send(issue);
    } catch (error) {
        next(error);
    }
}

async function getIssues(request, response, next) {
    try {
        let issues = await IssueModel.find().exec();
        let userIssues = await UserIssueModel.find({userId: String(request.params.userid).toLowerCase()}).exec();
        for(let i = 0; i<issues.length; i++)
        {
            for(let j = 0; j<userIssues.length; j++){
                if(issues[i]._id==userIssues[j].issueId) {
                    issues.splice(i--, 1);
                    break;
                }
            };
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
        let userIssues = await UserIssueModel.find({userId: String(request.params.userid).toLowerCase()}).exec();
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
    const issue = new IssueModel(body);
    issue.save(async (err, dbRes) => {
        if (err) return console.error(err);
        response.statusCode = statusOK;
        response.send(new IssueModel(dbRes));
        let data = {
                issueId: new IssueModel(dbRes).id,
                yes: {
                    gender:{Male: 0, Female: 0, Other: 0},
                    party:{Democrat: 0, Republican: 0, Libertarian: 0, Green: 0, Constitution: 0, Unaligned:0}
                },
                no:{
                    gender:{Male: 0, Female: 0, Other: 0},
                    party:{Democrat: 0, Republican: 0, Libertarian: 0, Green: 0, Constitution: 0, Unaligned:0}
                }
            }
        let issueData = new IssueDataModel(data);
        await issueData.save(function (err, dbRes) {
            if (err) console.error(err);
        });
    });

}

module.exports = router;

