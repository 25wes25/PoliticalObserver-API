const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const IssueDataModel = require('../models/issueData');

router.get('/issuedata/gender/issueid/:issueid', getIssueDataGenderByIssueId);
router.get('/issuedata/party/issueid/:issueid', getIssueDataPartyByIssueId);
router.get('/issuedata/education/issueid/:issueid', getIssueDataEducationByIssueId);
router.get('/issuedata/ethnicity/issueid/:issueid', getIssueDataEthnicityByIssueId);

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

async function getIssueDataGenderByIssueId(request, response, next) {
    try {
        let issueDataRes = await IssueDataModel.find({issueId: String(request.params.issueid).toLowerCase()}).exec();
        let issueDataGraphFormat = {};
        if(issueDataRes.length>0) {
            let issueData = issueDataRes[0];
            let genderConcat = [];
            for(let i = 0; i<genderKeys.length; i++)
                genderConcat.push({x:genderValues[i], y: issueData.no.gender[genderKeys[i]]});
            for(let i = 0; i<genderKeys.length; i++)
                genderConcat.push({x:genderValues[i], y: issueData.yes.gender[genderKeys[i]]});
            issueDataGraphFormat = {gender:genderConcat};
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
        let issueDataGraphFormat = {};
        if(issueDataRes.length>0) {
            let issueData = issueDataRes[0];
            let partyConcat = [];
            for(let i = 0; i<partyKeys.length; i++)
                partyConcat.push({x:partyValues[i], y: issueData.no.party[partyKeys[i]]});
            for(let i = 0; i<partyKeys.length; i++)
                partyConcat.push({x:educationValues[i], y: issueData.yes.party[partyKeys[i]]});
            issueDataGraphFormat = {party:partyConcat};
        }
        response.statusCode = statusOK;
        response.send(issueDataGraphFormat);
    } catch (error) {
        next(error);
    }
}

async function getIssueDataEducationByIssueId(request, response, next) {
    try {
        let issueDataRes = await IssueDataModel.find({issueId: String(request.params.issueid).toLowerCase()}).exec();
        console.log(issueDataRes);
        let issueDataGraphFormat = {};
        if(issueDataRes.length>0) {
            let issueData = issueDataRes[0];
            let educationConcat = [];
            for(let i = 0; i<educationKeys.length; i++)
                educationConcat.push({x:educationValues[i], y: issueData.no.education[educationKeys[i]]});
            for(let i = 0; i<educationKeys.length; i++)
                educationConcat.push({x:educationValues[i], y: issueData.yes.education[educationKeys[i]]});
            issueDataGraphFormat = {education:educationConcat};
        }
        response.statusCode = statusOK;
        response.send(issueDataGraphFormat);
    } catch (error) {
        next(error);
    }
}

async function getIssueDataEthnicityByIssueId(request, response, next) {
    try {
        let issueDataRes = await IssueDataModel.find({issueId: String(request.params.issueid).toLowerCase()}).exec();
        console.log(issueDataRes);
        let issueDataGraphFormat = {};
        if(issueDataRes.length>0) {
            let issueData = issueDataRes[0];
            let ethnicityConcat = [];
            for(let i = 0; i<ethnicityKeys.length; i++)
                ethnicityConcat.push({x:ethnicityValues[i], y: issueData.no.ethnicity[ethnicityKeys[i]]});
            for(let i = 0; i<ethnicityKeys.length; i++)
                ethnicityConcat.push({x:ethnicityValues[i], y: issueData.yes.ethnicity[ethnicityKeys[i]]});
            issueDataGraphFormat = {ethnicity:ethnicityConcat};
        }
        response.statusCode = statusOK;
        response.send(issueDataGraphFormat);
    } catch (error) {
        next(error);
    }
}

module.exports = router;