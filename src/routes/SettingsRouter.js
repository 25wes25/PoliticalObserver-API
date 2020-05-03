const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SettingsModel = require('../models/settings');

router.post('/settings', createSettings);
router.put('/settings/:id', modifySettings);
router.get('/settings', getAllSettings);
router.get('/settings/id/:id', getSettingsById);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createSettings(request, response, next) {
    let data = request.body;
    try {
        const settings = new SettingsModel(data);
        settings.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new SettingsModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function modifySettings(request, response, next) {
    try {
        SettingsModel.findOneAndUpdate({_id: request.params.id}, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new SettingsModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getAllSettings(request, response, next) {
    try {
        let settings = await SettingsModel.find().exec();
        response.statusCode = statusOK;
        response.send(settings);
    } catch (e) {
        next(e);
    }
}

async function getSettingsById(request, response, next) {
    try {
        let settings = await SettingsModel.find({_id: request.params.id}).exec();
        if (settings.length >= 1) {
            response.statusCode = statusOK;
            response.send(settings[0]);
        } else {
            response.statusCode = statusError;
            next("No settings found for get settings by id");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;
