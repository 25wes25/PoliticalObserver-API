var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const mongoose = require('mongoose');
const url = 'mongodb+srv://Admin:admin@political-observer-cluster-mmirq.mongodb.net/test?retryWrites=true&w=majority';

//connect to MongoDB server
mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected:', url)
});

db.on('error', err => {
    console.error('connection error:', err)
});

//defining data models
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

//compile schema to model with the name fruits (mongoose will make fruit -> fruits (plural))
const UserModel = mongoose.model('user', userSchema);
const DemographicModel = mongoose.model('demographic', demographicSchema);
const PoliticianModel = mongoose.model('politician', politicianSchema);
const SettingsModel = mongoose.model('setting', settingsSchema);

// bodyParser is a type of middleware
// It helps convert JSON strings
// the 'use' method assigns a middleware
app.use(bodyParser.json({ type: 'application/json' }));

//const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// http status codes
const statusOK = 200;
const statusNotFound = 404;

// POST - Create User
app.post('/users/', function(req, res) {
    // get data from request
    var newObject = req.body; // TODO validate data

    // add data to MongoDB database
    const user = new UserModel(newObject);
    user.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes.email + " saved to users collection.");
    });
});

// GET - Get all users
app.get("/users/", async (request, response) => {
    try {
        var user = await UserModel.find().exec();
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

// GET - Get user
app.get("/users/:email", async (request, response) => {
    try {
        var user = await UserModel.find({email: request.params.email}).exec();
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

// POST - Create demographic
app.post('/demographics/', function(req, res) {
    // get data from request
    var newObject = req.body; // TODO validate data

    // add data to MongoDB database
    const demographic = new DemographicModel(newObject);
    demographic.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// GET - Get all demographics
app.get("/demographics/", async (request, response) => {
    try {
        var demographic = await DemographicModel.find().exec();
        response.send(demographic);
    } catch (error) {
        response.status(500).send(error);
    }
});

// GET - Get demographic
app.get("/demographics/:id", async (request, response) => {
    try {
        var demographic = await DemographicModel.find({_id: request.params.id}).exec();
        response.send(demographic);
    } catch (error) {
        response.status(500).send(error);
    }
});

// POST - Create politician
app.post('/politicians/', function(req, res) {
    // get data from request
    var newObject = req.body; // TODO validate data

    // add data to MongoDB database
    const politician = new PoliticianModel(newObject);
    politician.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes.name + " saved to politicians collection.");
    });
});

// GET - Get all politicians
app.get("/politicians/", async (request, response) => {
    try {
        var politician = await PoliticianModel.find().exec();
        response.send(politician);
    } catch (error) {
        response.status(500).send(error);
    }
});

// GET - Get politician
app.get("/politicians/:name", async (request, response) => {
    try {
        var politician = await PoliticianModel.find({name: request.params.name}).exec();
        response.send(politician);
    } catch (error) {
        response.status(500).send(error);
    }
});

// POST - Create settings for user
app.post('/settings/', function(req, res) {
    // get data from request
    var newObject = req.body; // TODO validate data

    // add data to MongoDB database
    const setting = new SettingsModel(newObject);
    setting.save(function (err, dbRes) {
        if (err) return console.error(err);
        res.statusCode = statusOK;
        res.send(dbRes);
    });
});

// GET - Get user settings
app.get("/settings/:id", async (request, response) => {
    try {
        var setting = await SettingsModel.find({_id: request.params.id}).exec();
        response.send(setting);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.listen(port, function () {
    console.log(`Listening at ${port}/...`);
});
