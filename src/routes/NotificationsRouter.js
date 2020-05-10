const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const NotificationModel = require('../models/notification');

router.post('/notifications/', createNotification);
router.get('/notifications/id/:id', getNotificationById);
router.get('/notifications', getAllNotifications);
router.get('/notifications/recent/', getRecentNotifications);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createNotification(request, response, next) {
    let data = request.body;
    data.date = moment();
    try {
        const notification = new NotificationModel(data);
        notification.save(async (err, dbRes) => {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new NotificationModel(dbRes));
        });
    } catch (e) {
        next(e);
    }
}

async function getNotificationById(request, response, next) {
    try {
        let notification = await NotificationModel.findById(request.params.id).exec();
        response.statusCode = statusOK;
        response.send(notification);
    } catch (error) {
        next(error);
    }
}

async function getAllNotifications(request, response, next) {
    try {
        let notifications = await NotificationModel.find().exec();
        response.statusCode = statusOK;
        response.send(notifications);
    } catch (e) {
        next(e);
    }
}

async function getRecentNotifications(request, response, next) {
    let weekAgoDate = moment().startOf('day').subtract(1,'week');
    try {
        let notifications = await NotificationModel.find({date: {
                $gte: weekAgoDate,
            }}).exec();
        notifications.sort((a,b) => {
            return b.date - a.date
        });
        response.statusCode = statusOK;
        response.send(notifications);
    } catch (e) {
        next(e);
    }
}

module.exports = router;
