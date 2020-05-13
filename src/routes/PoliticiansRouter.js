const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PoliticianModel = require('../models/politician');

router.post('/politicians', createPolitician);
router.put('/politicians/:id', modifyPolitician);
router.get('/politicians', getAllPoliticians);
router.get('/politicians/id/:id', getPoliticianById);
router.get('/politicians/search/:search', getPoliticiansBySearch);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createPolitician(request, response, next) {
    let data = request.body;
    try {
        const politician = new PoliticianModel(data);
        politician.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new PoliticianModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function modifyPolitician(request, response, next) {
    let data = request.body;
    try {
        PoliticianModel.findOneAndUpdate({_id: request.params.id}, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new PoliticianModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getAllPoliticians(request, response, next) {
    try {
        let politician = await PoliticianModel.find().exec();
        response.statusCode = statusOK;
        response.send(politician);
    } catch (e) {
        next(e);
    }
}

async function getPoliticianById(request, response, next) {
    try {
        let politician = await PoliticianModel.find({_id: request.params.id}).exec();
        if (politician.length >= 1) {
            response.statusCode = statusOK;
            response.send(politician[0]);
        } else {
            response.statusCode = statusError;
            next("No politician found for get politician by id");
        }
    } catch (e) {
        next(e);
    }
}

async function getPoliticiansBySearch(request, response, next) {
    try {
        let politicians = await PoliticianModel.find({name: {$regex: request.params.search, $options: "i"}}).exec();
        response.statusCode = statusOK;
        response.send(politicians);
    } catch (e) {
        next(e);
    }
}

module.exports = router;
