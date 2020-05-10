const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const NotificationModel = require('../models/notification');

//router.get('/notification/:id', getNotificationById);
router.post('/notification/', createNotification);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;


async function createNotification(request, response, next) {
    let body = request.body;
    body.date = new Date();
    const notification = new NotificationModel(body);
    notification.save(async (err, dbRes) => {
        if (err) return console.error(err);
        response.statusCode = statusOK;
        response.send(new NotificationModel(dbRes));
    });

}

module.exports = router;