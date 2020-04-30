const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SocialQuizModel = require('../models/socialQuiz');

router.post('/socialQuiz', createSocialQuiz);
router.get('/socialQuiz/id/:id', getSocialScoreById);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createSocialQuiz(request, response, next) {
    let data = request.body;
    try {
        const socialQuiz = new SocialQuizModel(data);
        let array = socialQuiz.socialAnswers;
        let score = 0;
        let total = 0;
        for (let i = 0; i < array.length; i++){
            total = total + array[i];
        }
        score = total/array.length;
        socialQuiz.socialScore = score;
        socialQuiz.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(dbRes);
        });
    } catch (e) {
        next(e);
    }
}

async function getSocialScoreById(request, response, next) {
    try {
        let socialQuiz = await SocialQuizModel.find({_id: request.params.id}).exec();
        if (socialQuiz.length >= 1) {
            response.statusCode = statusOK;
            response.send(socialQuiz[0]);
        } else {
            response.statusCode = statusError;
            next("No score found for get social quiz score by id");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

