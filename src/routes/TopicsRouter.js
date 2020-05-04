const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const TopicModel = require('../models/topic');

router.post('/topics', createTopic);
router.put('/topics/:id', modifyTopic);
router.get('/topics', getAllTopics);
router.get('/topics/id/:id', getTopicById);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createTopic(request, response, next) {
    let data = request.body;
    try {
        const topic = new TopicModel(data);
        topic.save(function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new TopicModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function modifyTopic(request, response, next) {
    try {
        TopicModel.findOneAndUpdate({_id: request.params.id}, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new TopicModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getAllTopics(request, response, next) {
    try {
        let topic = await TopicModel.find().exec();
        response.statusCode = statusOK;
        response.send(topic);
    } catch (e) {
        next(e);
    }
}

async function getTopicById(request, response, next) {
    try {
        let topic = await TopicModel.find({_id: request.params.id}).exec();
        if (topic.length >= 1) {
            response.statusCode = statusOK;
            response.send(topic[0]);
        } else {
            response.statusCode = statusError;
            next("No topic found for get topic by id");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = router;
