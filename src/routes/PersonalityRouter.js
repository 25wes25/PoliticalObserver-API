const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PersonalityModel = require('../models/personality');

router.post('/personality', createPersonality);
router.put('/personality/:id', modifyPersonality);
router.get('/personality/personalityType/:personalityType', getPersonalityByName);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createPersonality(request, response, next) {
    let data = request.body;
    try {
        const personality = new PersonalityModel(data);
        personality.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new PersonalityModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function modifyPersonality(request, response, next) {
    let data = request.body;
    try {
        PersonalityModel.findOneAndUpdate({_id: request.params.id}, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new PersonalityModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getPersonalityByName(request, response, next) {
    try {
        let personality = await PersonalityModel.find({personalityType: request.params.personalityType}).exec();
        if (personality.length >= 1) {
            response.statusCode = statusOK;
            response.send(personality[0]);
        } else {
            response.statusCode = statusError;
            next("No personality found for get personality by id");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

