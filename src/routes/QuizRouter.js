const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const QuizModel = require('../models/Quiz');

router.post('/quiz', createQuiz);
router.get('/quiz/userid/:userid', getQuizScoreByUserId);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createQuiz(request, response, next) {
    let data = request.body;
    try {
        const quiz = new QuizModel(data);
        let socialArray = quiz.socialAnswers;
        let econArray = quiz.econAnswers;
        let socialScore = 0;
        let econScore = 0;
        let totalSocial = 0;
        let totalEcon = 0;
        for (let i = 0; i < socialArray.length; i++){
            totalSocial = totalSocial + socialArray[i];
        }
        for (let i = 0; i < socialArray.length; i++){
            totalEcon = totalEcon + econArray[i];
        }
        socialScore = totalSocial/socialArray.length;
        quiz.socialScore = socialScore;
        econScore = totalEcon/econArray.length;
        quiz.econScore = econScore;
        quiz.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new QuizModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getQuizScoreByUserId(request, response, next) {
    try {
        let quiz = await QuizModel.find({userID: request.params.userid}).exec();
        if (quiz.length >= 1) {
            response.statusCode = statusOK;
            response.send(quiz[0]);
        } else {
            response.statusCode = statusError;
            next("No score found for get quiz score by userID");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

