var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/myNewDB';

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

//issue schema
const issueSchema = new Schema({
  title: String,
  description: String,
  pros: String,
  cons: String, 
  notes: String,
  date: String
});

//compile schema to model with the name '[name]' (mongoose will make a name -> names (plural): 'user' -> 'users' in DB)
const UserModel = mongoose.model('user', userSchema);
const DemographicModel = mongoose.model('demographic', demographicSchema);
const PoliticianModel = mongoose.model('politician', politicianSchema);
const SettingsModel = mongoose.model('setting', settingsSchema);
const IssueModel = mongoose.model('issue', issueSchema);

// bodyParser is a type of middleware
// It helps convert JSON strings
// the 'use' method assigns a middleware
app.use(bodyParser.json({ type: 'application/json' }));

//const hostname = '127.0.0.1';
const hostname = '127.0.0.1';
const port = 3000;

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
//************************ ISSUES **********************************
// GET all issues
app.get('/issues/all/', async(req, res) => {
	try {
        var issues = await IssueModel.find().exec();
		res.statusCode = statusOK;
        res.send(issues);
    } catch (error) {
        response.status(500).send(error);
    }
});

// GET (one) issue by issue id
//5e78569646dbe4612048fb4b
app.get('/issues/id/:id', async(req, res) => {
	try {
		var issue = await IssueModel.findById(req.params.id).exec();
		res.statusCode = statusOK;
		res.send(issue);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Handle POST request
/*
{
  "title": "Tax Issue One",
  "description": "Do you agree with tax reduction?",
  "pros": "short term benefit for people",
  "cons": "unpredictable long term influence", 
  "notes": "read more",
  "date": "3-9-2020"
}
*/
app.post('/issues/', function(req, res) {
	// get data from request
	var newObject = req.body; // TODO validate data
	
	// add data to MongoDB database
	const issue = new IssueModel(newObject);
	issue.save(function (err, p) {
	  if (err) return console.error(err);
	  console.log(p.title + " saved to issues collection.");
	});
	
	// send created item back with id included
	res.statusCode = statusOK;
	res.send(`Issue added`);
});

app.listen(port, hostname, function () {
    console.log(`Listening at http://${hostname}:${port}/...`);
});
