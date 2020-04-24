const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SettingsModel = require('../models/settings');

router.post('/settings', createSettings);
router.put('/settings', modifySettings);
router.get('/settings', getAllSettings);
router.get('/settings/:id', getSettingsById);

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
            response.send(dbRes);
        });
    } catch (e) {
        next(e);
    }
}

async function modifySettings(request, response, next) {
    let data = request.body;
    try {
        let query = {
            _id: mongoose.Types.ObjectId(data.id)
        };
        SettingsModel.findOneAndUpdate(query, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(dbRes);
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
        response.statusCode = statusOK;
        response.send(settings);
    } catch (e) {
        next(e);
    }
}

module.exports = router;
