const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DemographicModel = require('../models/demographic');

router.post('/demographics', createDemographic);
router.put('/demographics/:id', modifyDemographic);
router.get('/demographics', getAllDemographics);
router.get('/demographics/id/:id', getDemographicById);
router.get('/demographics/gender', getGenderDemographics);
router.get('/demographics/party', getPartyDemographics);
router.get('/demographics/education', getEducationDemographics);
router.get('/demographics/marital', getMaritalDemographics);
router.get('/demographics/marital/id/:id', getMaritalDemographicsById);
// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

const ethnicityKeys = ['White', 'AfricanAmerican', 'Asian', 'NativeAmerican', 'Hispanic', 'Other'];
const ethnicityValues = ['White', 'African American', 'Asian', 'Native American', 'Hispanic', 'Other'];

async function createDemographic(request, response, next) {
    let data = request.body;
    try {
        const demographic = new DemographicModel(data);
        demographic.save(function (err, dbRes) {
            response.statusCode = statusOK;
            response.send(new DemographicModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function modifyDemographic(request, response, next) {
    let data = request.body;
    try {
        DemographicModel.findOneAndUpdate({_id: request.params.id}, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new DemographicModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getAllDemographics(request, response, next) {
    try {
        let demographics = await DemographicModel.find().exec();
        response.statusCode = statusOK;
        response.send(demographics);
    } catch (e) {
        next(e);
    }
}

async function getDemographicById(request, response, next) {
    try {
        let demographic = await DemographicModel.find({_id: request.params.id}).exec();
        if (demographic.length >= 1) {
            response.statusCode = statusOK;
            response.send(demographic[0]);
        } else {
            response.statusCode = statusError;
            next("No demographic found for get demographic by id");
        }
    } catch (e) {
        next(e);
    }
}

async function getGenderDemographics(request, response, next) {
    try {
        let demographics = await DemographicModel.find().exec();
        let results = [{x: 'Male', y: 0}, {x: 'Female', y: 0}, {x: 'Other', y: 0}];
        results.forEach(result => {
            result.y = demographics.reduce(function (n, demographic) {
                return n + (demographic.gender === result.x);
            }, 0);
        });
        response.statusCode = statusOK;
        response.send(results);
    } catch (e) {
        next(e);
    }
}

async function getPartyDemographics(request, response, next) {
    try {
        let demographics = await DemographicModel.find().exec();
        let results = [{x: 'Democrat', y: 0}, {x: 'Republican', y: 0}, {x: 'Libertarian', y: 0}, {x: 'Green', y: 0}, {x: 'Constitution', y: 0}, {x: 'Unaligned', y: 0}];
        results.forEach(result => {
            result.y = demographics.reduce(function (n, demographic) {
                return n + (demographic.partyAffiliation === result.x);
            }, 0);
        });
        response.statusCode = statusOK;
        response.send(results);
    } catch (e) {
        next(e);
    }
}

async function getEducationDemographics(request, response, next) {
    try {
        let demographics = await DemographicModel.find().exec();
        let results = [{x: 'None', y: 0}, {x: 'Diploma', y: 0}, {x: 'Associates', y: 0}, {x: 'Bachelors', y: 0}, {x: 'Masters', y: 0}, {x: 'Doctoral', y: 0}];
        results.forEach(result => {
            result.y = demographics.reduce(function (n, demographic) {
                return n + (demographic.education === result.x);
            }, 0);
        });
        response.statusCode = statusOK;
        response.send(results);
    } catch (e) {
        next(e);
    }
}

async function getMaritalDemographics(request, response, next) {
    try {
        let demographics = await DemographicModel.find().exec();
        let results = [{x: 'Single', y: 0}, {x: 'Married', y: 0}];
        results.forEach(result => {
            result.y = demographics.reduce(function (n, demographic) {
                return n + (demographic.maritalStatus === result.x);
            }, 0);
        });
        response.statusCode = statusOK;
        response.send(results);
    } catch (e) {
        next(e);
    }
}

// async function getAllDemographicInsights (request, response, next) {
//
// }

async function getMaritalDemographicsById (request, response, next) {
    try {
        let demographics = await DemographicModel.find().exec();
        let results = [{x: 'Single', y: 0}, {x: 'Married', y: 0}];
        let userGroup = 'Single';
        let groupTotal = 0;
        let totalMarital = 0;
        let maritalStat = 0;
        results.forEach(result => {
            result.y = demographics.reduce(function (n, demographic) {
                return n + (demographic.maritalStatus === result.x);
            }, 0);
            totalMarital += result.y;
            if (result.x == userGroup){
                groupTotal = result.y;
            }
        });
        maritalStat = (groupTotal / totalMarital) * 100;
        response.statusCode = statusOK;
        response.send({maritalStat: maritalStat});
    } catch (e) {
        next(e);
    }
}

module.exports = router;
