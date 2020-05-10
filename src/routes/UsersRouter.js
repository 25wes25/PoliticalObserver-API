const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { demographicsList } = require('../../constants');

const UserModel = require('../models/user');
const DemographicModel = require('../models/demographic');
const SettingsModel = require('../models/settings');

router.post('/users', createUser);
router.put('/users/:id', modifyUser);
router.get('/users', getAllUsers);
router.get('/users/id/:id', getUserById);
router.get('/users/email/:email', getUserByEmail);
router.get('/users/:userId/data/insights', getUserInsights);
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
            const demographicResult = new DemographicModel(dbRes);
            data.demographicId = demographicResult.id;
            const settings = new SettingsModel(data);
            await settings.save(async (err, dbRes) => {
                if (err) return console.error(err);
                const settingsResult = new SettingsModel(dbRes);
                data.settingsId = settingsResult.id;
                const user = new UserModel(data);
                await user.save(function (err, dbRes) {
                    if (err) console.error(err);
                    response.statusCode = statusOK;
                    response.send(new UserModel(dbRes));
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
        UserModel.findOneAndUpdate({_id: request.params.id}, data, {new: true}, function (err, dbRes) {
            if (err) return console.error(err);
            response.statusCode = statusOK;
            response.send(new UserModel(dbRes));
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
            response.send(new UserModel(user[0]));
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
                response.send(new UserModel(dbRes));
            } catch (error) {
                response.status(statusError).send(error.message);
            }
        });
    } catch (e) {
        next(e);
    }
}

async function getUserInsights(request, response, next) {
    try {
        let userResult = await UserModel.find({_id: request.params.userId}).exec();
        let user = {};
        if (userResult.length >= 1) {
            user = userResult[0];
        } else {
            response.statusCode = statusError;
            next("No user found for get user insights");
        }
        let userDemographicResult = await DemographicModel.find({_id: user.demographicId}).exec();
        let userDemographic = {};
        if (userDemographicResult.length >= 1) {
            userDemographic = userDemographicResult[0];
        } else {
            response.statusCode = statusError;
            next("No Demographic found for get user insights");
        }
        let demographics = await DemographicModel.find().exec();
        let results = [];
        demographicsList.forEach(demographicObj => {
            let demographicResults = [];
            demographicObj.data.forEach(x => {
                demographicResults.push({x: x, y: 0});
            });
            demographicResults.forEach(result => {
                result.y = demographics.reduce(function (n, demographic) {
                    if (demographicObj.key === 'age' || demographicObj.key === 'income') {
                        if (demographic[demographicObj.key] >= result.x.min && demographic[demographicObj.key] <= result.x.max) {
                            return n + 1;
                        } else {
                            return n + 0;
                        }
                    } else {
                        if (demographic[demographicObj.key] === result.x) {
                            return n + (demographic[demographicObj.key] === result.x);
                        } else {
                            return n + 0;
                        }
                    }
                }, 0);
            });
            let amount = 0;
            let total = 0;
            let index = 0;
            let count = 0;
            demographicResults.forEach(result => {
                if (demographicObj.key === 'age' || demographicObj.key === 'income') {
                    if (userDemographic[demographicObj.key] >= result.x.min && userDemographic[demographicObj.key] <= result.x.max) {
                        amount = result.y;
                        index = count;
                    }
                } else {
                    if (userDemographic[demographicObj.key] === result.x) {
                        amount = result.y;
                        index = count;
                    }
                }
                total += result.y;
                count++;
            });
            let percentage = Math.floor((amount / total) * 100);
            if (demographicObj.key === 'age') {
                demographicResults = demographicResults.map(result => {
                    return {x: result.x.min.toString() + ' - ' + result.x.max.toString(), y: result.y};
                });
            } else if (demographicObj.key === 'income') {
                demographicResults = demographicResults.map(result => {
                    return {x: '$' + result.x.min.toString() + ' - $' + result.x.max.toString(), y: result.y};
                });
            }
            results.push({type: demographicObj.type, percentage: percentage, index: index, data: demographicResults});
        });

        response.statusCode = statusOK;
        response.send(results);
    } catch (e) {
        next(e);
    }
}

module.exports = router;

