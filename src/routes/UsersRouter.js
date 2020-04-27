const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserModel = require('../models/user');
const DemographicModel = require('../models/demographic');
const SettingsModel = require('../models/settings');

router.post('/users', createUser);
router.put('/users', modifyUser);
router.get('/users', getAllUsers);
router.get('/users/id/:id', getUserById);
router.get('/users/email/:email', getUserByEmail);
router.delete('/users/:id', deleteUser);

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

async function createUser(request, response, next) {
    let data = request.body;
    try {
        const demographic = new DemographicModel(data);
        await demographic.save(async (err, dbRes) => {
            if (err) return console.error(err);
            data.demographicId = dbRes._id.toString();
            const settings = new SettingsModel(data);
            await settings.save(async (err, dbRes) => {
                if (err) return console.error(err);
                data.settingsId = dbRes._id.toString();
                const user = new UserModel(data);
                await user.save(function (err, dbRes) {
                    if (err) console.error(err);
                    response.statusCode = statusOK;
                    response.send(dbRes);
                });
            });
        });
    } catch (e) {
        next(e);
    }
}

async function modifyUser(request, response, next) {
    let data = request.body;
    try {
        let query = {
            _id: mongoose.Types.ObjectId(data.id)
        };
        UserModel.findOneAndUpdate(query, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(dbRes);
        });
    } catch (e) {
        next(e);
    }
}

async function getAllUsers(request, response, next) {
    try {
        let user = await UserModel.find().exec();
        response.statusCode = statusOK;
        response.send(user);
    } catch (e) {
        next(e);
    }
}

async function getUserById(request, response, next) {
    try {
        let user = await UserModel.find({_id: request.params.id}).exec();
        if (user.length >= 1) {
            response.statusCode = statusOK;
            response.send(user[0]);
        } else {
            response.statusCode = statusError;
            next("No user found for get user by id");
        }
    } catch (e) {
        next(e);
    }
}

async function getUserByEmail(request, response, next) {
    try {
        let user = await UserModel.find({email: request.params.email}).exec();
        if (user.length >= 1) {
            response.statusCode = statusOK;
            response.send(user[0]);
        } else {
            response.statusCode = statusError;
            next("No user found for get user by email");
        }
    } catch (e) {
        next(e);
    }
}

async function deleteUser(request, response, next) {
    try {
        let query = {
            _id: mongoose.Types.ObjectId(request.params.id)
        };
        UserModel.findOneAndDelete(query, async (err, dbRes) => {
            if (err) return console.error(err);
            try {
                query = {
                    _id: dbRes.demographicId
                };
                await DemographicModel.findOneAndDelete(query, function (err, dbRes) {
                    if (err) return console.error(err);
                    response.statusCode = statusOK;
                });
                query = {
                    _id: dbRes.settingsId
                };
                await SettingsModel.findOneAndDelete(query, function (err, dbRes) {
                    if (err) return console.error(err);
                    response.statusCode = statusOK;
                });
                response.statusCode = statusOK;
                response.send(dbRes);
            } catch (error) {
                response.status(statusError).send(error.message);
            }
        });
    } catch (e) {
        next(e);
    }
}

module.exports = router;

