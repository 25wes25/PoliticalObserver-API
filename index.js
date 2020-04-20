let express = require('express');
let bodyParser = require('body-parser');
let app = express();

const mongoose = require('mongoose');
// Local URL
const url = 'mongodb://127.0.0.1:27017/PoliticalObserver';
// Development URL
// const url = 'mongodb+srv://Admin:admin@political-observer-cluster-mmirq.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected: ', url)
});

db.on('error', err => {
    console.error('Connection error: ', err)
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    demographicId: String,
    settingsId: String,
});

const politicianSchema = new Schema({
    name: String,
    bio: String,
});

const demographicSchema = new Schema({
    ageRange: String,
    gender: String,
    ethnicity: String,
    maritalStatus: String,
    education: String,
    occupation: String,
    incomeLevel: String,
    state: String,
    personalityType: String,
    partyAffiliation: String,
    politicalAffiliation: String,
});

const settingsSchema = new Schema({
    dataSharing: Boolean,
    pushNotifications: Boolean,
    personalized: Boolean,
});

// Compile schema to model with the name fruits (mongoose will make fruit -> fruits (plural))
const UserModel = mongoose.model('user', userSchema);
const DemographicModel = mongoose.model('demographic', demographicSchema);
const PoliticianModel = mongoose.model('politician', politicianSchema);
const SettingsModel = mongoose.model('setting', settingsSchema);

// bodyParser is a type of middleware
// It helps convert JSON strings
// the 'use' method assigns a middleware
app.use(bodyParser.json({ type: 'application/json' }));

const hostname = '127.0.0.1';
const port = 3000;

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

// POST - Create User
app.post('/users/', async (request, response) => {
    try {
        let newObject = request.body;

        const demographic = new DemographicModel(newObject);
        await demographic.save(async (err, dbRes) => {
            if (err) return console.error(err);
            newObject.demographicId = dbRes._id.toString();
            const settings = new SettingsModel(newObject);
            await settings.save(async (err, dbRes) => {
                if (err) return console.error(err);
                newObject.settingsId = dbRes._id.toString();
                const user = new UserModel(newObject);
                await user.save(function (err, dbRes) {
                    if (err) console.error(err);
                    response.statusCode = statusOK;
                    response.send(dbRes);
                });
            });
        });
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// PUT - Modify User
app.put('/users/', function(req, res) {
    let newObject = req.body;

    let query = {
        _id: mongoose.Types.ObjectId(newObject.id)
    };
    UserModel.findOneAndUpdate(query, newObject, {new: true}, function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// GET - Get all users
app.get('/users/', async (request, response) => {
    try {
        let user = await UserModel.find().exec();
        response.send(user);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// GET - Get user
app.get('/users/:id', async (request, response) => {
    try {
        let user = await UserModel.find({_id: request.params.id}).exec();
        response.send(user);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// GET - Get user
app.get('/users/:email', async (request, response) => {
    try {
        let user = await UserModel.find({email: request.params.email}).exec();
        response.send(user);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// DELETE - Delete User
app.delete('/users/:id', async (request, response) => {
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
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// POST - Create demographic
app.post('/demographics/', function(req, res) {
    let newObject = req.body;

    const demographic = new DemographicModel(newObject);
    demographic.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// PUT - Modify Demographic
app.put('/demographics/', function(req, res) {
    let newObject = req.body;

    let query = {
        _id: mongoose.Types.ObjectId(newObject.id)
    };
    DemographicModel.findOneAndUpdate(query, newObject, {new: true}, function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// GET - Get all demographics
app.get('/demographics/', async (request, response) => {
    try {
        let demographic = await DemographicModel.find().exec();
        response.send(demographic);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// GET - Get demographic
app.get('/demographics/:id', async (request, response) => {
    try {
        let demographic = await DemographicModel.find({_id: request.params.id}).exec();
        response.send(demographic);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// POST - Create politician
app.post('/politicians/', function(req, res) {
    // get data from request
    let newObject = req.body;

    // add data to MongoDB database
    const politician = new PoliticianModel(newObject);
    politician.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// PUT - Modify Politician
app.put('/politicians/', function(req, res) {
    let newObject = req.body;

    let query = {
        _id: mongoose.Types.ObjectId(newObject.id)
    };
    PoliticianModel.findOneAndUpdate(query, newObject, {new: true}, function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// GET - Get all politicians
app.get('/politicians/', async (request, response) => {
    try {
        let politician = await PoliticianModel.find().exec();
        response.send(politician);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// GET - Get politician
app.get('/politicians/:id', async (request, response) => {
    try {
        let politician = await PoliticianModel.find({_id: request.params.id}).exec();
        response.send(politician);
    } catch (error) {
        response.status(statusError).send(error);
    }
});

// POST - Create settings for user
app.post('/settings/', function(req, res) {
    let newObject = req.body;

    const settings = new SettingsModel(newObject);
    settings.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// PUT - Modify Settings
app.put('/settings/', function(req, res) {
    let newObject = req.body;

    let query = {
        _id: mongoose.Types.ObjectId(newObject.id)
    };
    SettingsModel.findOneAndUpdate(query, newObject, {new: true}, function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// GET - Get user settings
app.get('/settings/:id', async (request, response) => {
    try {
        let settings = await SettingsModel.find({_id: request.params.id}).exec();
        response.send(settings);
    } catch (error) {
        response.status(statusError).send(error.message);
    }
});

app.listen(port, hostname, function () {
    console.log(`Listening at http://${hostname}:${port}/...`);
});
