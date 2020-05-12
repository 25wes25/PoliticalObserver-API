const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const personalityQuizModel = require('../models/personalityQuiz');
const politicalQuizModel = require('../models/politicalQuiz');

router.post('/quiz/political', createPoliticalQuiz);
router.post('/quiz/personality', createPersonalityQuiz);
router.get('/quiz/political/userid/:userid', getPoliticalQuizScoreByUserId);
router.get('/quiz/personality/userid/:userid', getPersonalityQuizScoreByUserId);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;


async function createPoliticalQuiz(request, response, next) {
    let data = request.body;
    try {
        const quiz = new politicalQuizModel(data);
        let socialArray = quiz.socialAnswers;
        let econArray = quiz.econAnswers;
        let totalSocial = 0;
        let totalEcon = 0;

        for (let i = 0; i < socialArray.length; i++){
            if(i < 3){
                if (socialArray[i] == 1){
                    totalSocial = totalSocial + 1;
                }
                else if (socialArray[i] == 2){
                    totalSocial = totalSocial + 0.5;
                }
                else if (socialArray[i] == 3){
                    totalSocial = totalSocial - 0.5;
                }
                else {
                    totalSocial = totalSocial - 1;
                }
            }
            else {
                if (socialArray[i] == 1){
                    totalSocial = totalSocial - 1;
                }
                else if (socialArray[i] == 2){
                    totalSocial = totalSocial - 0.5;
                }
                else if (socialArray[i] == 3){
                    totalSocial = totalSocial + 0.5;
                }
                else {
                    totalSocial = totalSocial + 1;
                }
            }
        }

        for (let i = 0; i < econArray.length; i++){
            if(i < 3){
                if (econArray[i] == 1){
                    totalEcon = totalEcon + 1;
                }
                else if (econArray[i] == 2){
                    totalEcon = totalEcon + 0.5;
                }
                else if (econArray[i] == 3){
                    totalEcon = totalEcon - 0.5;
                }
                else {
                    totalEcon = totalEcon - 1;
                }
            }
            else {
                if (econArray[i] == 1){
                    totalEcon = totalEcon - 1;
                }
                else if (econArray[i] == 2){
                    totalEcon = totalEcon - 0.5;
                }
                else if (econArray[i] == 3){
                    totalEcon = totalEcon + 0.5;
                }
                else {
                    totalEcon = totalEcon + 1;
                }
            }
        }

        quiz.socialScore = totalSocial;
        quiz.econScore = totalEcon;

        if (quiz.econScore < -2){
            if (quiz.socialScore > 2){
                quiz.politicalScore = 'National Socialist'
            }
            else if (quiz.socialScore >= -2 && quiz.socialScore <= 2){
                quiz.politicalScore = 'Liberal'
            }
            else {
                quiz.politicalScore = 'Anarcho-Socialist'
            }
        }
        else if (quiz.econScore >= -2 && quiz.econScore <= 2){
            if (quiz.socialScore > 2){
                quiz.politicalScore = 'Authoritarian'
            }
            else if (quiz.socialScore >= -2 && quiz.socialScore <= 2){
                quiz.politicalScore = 'Moderate'
            }
            else {
                quiz.politicalScore = 'Libertarian'
            }
        }
        else {
            if (quiz.socialScore > 2){
                quiz.politicalScore = 'Traditionalist'
            }
            else if (quiz.socialScore >= -2 && quiz.socialScore <= 2){
                quiz.politicalScore = 'Conservative'
            }
            else {
                quiz.politicalScore = 'Anarcho-Capitalist'
            }
        }

        quiz.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new politicalQuizModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function createPersonalityQuiz(request, response, next) {
    let data = request.body;
    try {
        const quiz = new personalityQuizModel(data);
        let mindArray = quiz.mindAnswers;
        let energyArray = quiz.energyAnswers;
        let natureArray = quiz.natureAnswers;
        let tacticArray = quiz.tacticAnswers;
        let mindScore = 0;
        let energyScore = 0;
        let natureScore = 0;
        let tacticScore = 0;
        let finalMind = '';
        let finalEnergy = '';
        let finalNature = '';
        let finalTactic = '';
        let personalityScore = '';
        for (let i = 0; i < mindArray.length; i++){
            mindScore = mindScore + mindArray[i];
            energyScore = energyScore + energyArray[i];
            natureScore = natureScore + natureArray[i];
            tacticScore = tacticScore + tacticArray[i];
        }

        if (mindScore <= 0) {
            finalMind = 'I';
        } else {
            finalMind = 'E';
        }

        if (energyScore <= 0) {
            finalEnergy = 'S';
        } else {
            finalEnergy = 'N';
        }

        if (natureScore <= 0) {
            finalNature = 'T';
        } else {
            finalNature = 'F';
        }

        if (tacticScore <= 0) {
            finalTactic = 'J';
        } else {
            finalTactic = 'P';
        }

        personalityScore = finalMind + finalEnergy + finalNature + finalTactic;
        quiz.personalityScore = personalityScore;
        quiz.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new personalityQuizModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getPoliticalQuizScoreByUserId(request, response, next) {
    try {
        let quiz = await politicalQuizModel.find({userId: request.params.userId}).exec();
        if (quiz.length >= 1) {
            response.statusCode = statusOK;
            response.send(quiz[0]);
        } else {
            response.statusCode = statusError;
            next("No score found for get political quiz score by userId");
        }
    } catch (e) {
        next(e);
    }
}

async function getPersonalityQuizScoreByUserId(request, response, next) {
    try {
        let quiz = await personalityQuizModel.find({userId: request.params.userid}).exec();
        if (quiz.length >= 1) {
            response.statusCode = statusOK;
            response.send(quiz[0]);
        } else {
            response.statusCode = statusError;
            next("No score found for get personality quiz score by userId");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;

