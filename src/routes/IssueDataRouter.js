const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueDataModel = require('../models/issueData');

router.get('/issuedata/issueid/:issueid', getIssueDataByIssueId);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function getIssueDataByIssueId(request, response, next) {
    try {
        let issueDataRes = await IssueDataModel.find({issueId: String(request.params.issueid).toLowerCase()}).exec();
        console.log(issueDataRes);
        let issueDataGraphFormat = {}
        if(issueDataRes.length>0) {
            let issueData = issueDataRes[0];

            let genderYes = issueData.yes.gender;
            let genderNo = issueData.no.gender;
            issueDataGraphFormat = {
                gender:[{x:'Male', y: genderNo.Male}, {x:'Female', y: genderNo.Female}, {x:'Other', y: genderNo.Other},
                    {x:'Male', y: genderYes.Male}, {x:'Female', y: genderYes.Female}, {x:'Other', y: genderYes.Other}]
            }
        }
        response.statusCode = statusOK;
        response.send(issueDataGraphFormat);
    } catch (error) {
        next(error);
    }
}

module.exports = router;