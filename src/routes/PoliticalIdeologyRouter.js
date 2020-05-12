const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PoliticalIdeologyModel = require('../models/politicalIdeology');

router.post('/ideology', createPoliticalIdeology);
router.get('/ideology/ideology/:ideology', getPoliticalIdeologyByName);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createPoliticalIdeology(request, response, next) {
    let data = request.body;
    try {
        const politicalIdeology = new PoliticalIdeologyModel(data);
        politicalIdeology.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new PoliticalIdeologyModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getPoliticalIdeologyByName(request, response, next) {
    try {
        let politicalIdeology = await PoliticalIdeologyModel.find({ideology: request.params.ideology}).exec();
        if (politicalIdeology.length >= 1) {
            response.statusCode = statusOK;
            response.send(politicalIdeology[0]);
        } else {
            response.statusCode = statusError;
            next("No politicalIdeology found for get politicalIdeology by name");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

