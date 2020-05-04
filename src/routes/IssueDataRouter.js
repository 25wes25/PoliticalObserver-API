const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueDataModel = require('../models/issueData');

router.get('/issuedata/gender/issueid/:issueid', getIssueDataGenderByIssueId);
router.get('/issuedata/party/issueid/:issueid', getIssueDataPartyByIssueId);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function getIssueDataGenderByIssueId(request, response, next) {
    try {
        let issueDataRes = await IssueDataModel.find({issueId: String(request.params.issueid).toLowerCase()}).exec();
        let issueDataGraphFormat = {};
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

async function getIssueDataPartyByIssueId(request, response, next) {
    try {
        let issueDataRes = await IssueDataModel.find({issueId: String(request.params.issueid).toLowerCase()}).exec();
        //console.log(issueDataRes);
        let issueDataGraphFormat = {}
        if(issueDataRes.length>0) {
            let issueData = issueDataRes[0];
            let partyYes = issueData.yes.party;
            let partyNo = issueData.no.party;
            issueDataGraphFormat = {
                party:[{x:'Democrat', y: partyNo.Democrat}, {x:'Republican', y: partyNo.Republican}, {x:'Libertarian', y: partyNo.Libertarian},
                    {x:'Green', y: partyNo.Green}, {x:'Constitution', y: partyNo.Constitution}, {x:'Unaligned', y: partyNo.Unaligned},
                    {x:'Democrat', y: partyYes.Democrat}, {x:'Republican', y: partyYes.Republican}, {x:'Libertarian', y: partyYes.Libertarian},
                    {x:'Green', y: partyYes.Green}, {x:'Constitution', y: partyYes.Constitution}, {x:'Unaligned', y: partyYes.Unaligned}]
            }
        }
        response.statusCode = statusOK;
        response.send(issueDataGraphFormat);
    } catch (error) {
        next(error);
    }
}

module.exports = router;