const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const EconQuizModel = require('../models/econQuiz');

router.post('/econQuiz', createEconQuiz);
router.get('/econQuiz/userid/:userid', getEconScoreByUserId);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createEconQuiz(request, response, next) {
    let data = request.body;
    try {
        const econQuiz = new EconQuizModel(data);
        let array = econQuiz.econAnswers;
        let score = 0;
        let total = 0;
        for (let i = 0; i < array.length; i++){
            total = total + array[i];
        }
        score = total/array.length;
        econQuiz.econScore = score;
        econQuiz.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(dbRes);
        });
    } catch (e) {
        next(e);
    }
}

async function getEconScoreByUserId(request, response, next) {
    try {
        let econQuiz = await EconQuizModel.find({userID: request.params.userid}).exec();
        if (econQuiz.length >= 1) {
            response.statusCode = statusOK;
            response.send(econQuiz[0]);
        } else {
            response.statusCode = statusError;
            next("No score found for get econ quiz score by id");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

