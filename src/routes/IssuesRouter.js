const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueModel = require('../models/issue');

router.get('/issues/id/:id', getIssueById);
router.get('/issues/filter/:keyword', getIssueByKeyword);
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

async function getIssueByKeyword(request, response, next) {
    //Get all issues filtered by a keyword (to get all -> keyword=all)
    try {
        let issues = await IssueModel.find().exec();
        let filteredIssues = [];
        let keyword = String(request.params.keyword).toLowerCase();

        if(keyword == 'all') {
            response.statusCode = statusOK;
            response.send(issues);
        }
        else {
            for(let i = 0; i<issues.length; i++)
            {
                let desc = String(issues[i].description).toLowerCase();
                let title = String(issues[i].title).toLowerCase();
                if(desc.includes(keyword) || title.includes(keyword))
                {
                    filteredIssues.push(issues[i]);
                }
            }
            response.statusCode = statusOK;
            response.send(filteredIssues);
        }
    } catch (error) {
        next(error);
    }
}

async function createIssue(request, response, next) {
    let body = request.body;
    const issue = new IssueModel(body);
    issue.save(function (err, dbRes) {
        if (err) return console.error(err);
        response.statusCode = statusOK;
        response.send(dbRes);
    });

}

module.exports = router;

