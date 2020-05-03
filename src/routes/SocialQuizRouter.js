const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SocialQuizModel = require('../models/socialQuiz');

router.post('/socialQuiz', createSocialQuiz);
router.get('/socialQuiz/userid/:userid', getSocialScoreByUserId);

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
            response.send(new SocialQuizModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getSocialScoreByUserId(request, response, next) {
    try {
        let socialQuiz = await SocialQuizModel.find({userID: request.params.userid}).exec();
        if (socialQuiz.length >= 1) {
            response.statusCode = statusOK;
            response.send(socialQuiz[0]);
        } else {
            response.statusCode = statusError;
            next("No score found for get social quiz score by userID");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

