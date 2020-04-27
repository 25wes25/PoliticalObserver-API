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

//user-voted-issue schema -> usee-issue
const userIssueSchema = new Schema({
  issueId: String,
  username: String,
  vote: String,
  date: String
});

//compile schema to model with the name '[name]' (mongoose will make [name] -> [names] (plural): 'user' -> 'users' in DB)
const UserModel = mongoose.model('user', userSchema);
const DemographicModel = mongoose.model('demographic', demographicSchema);
const PoliticianModel = mongoose.model('politician', politicianSchema);
const SettingsModel = mongoose.model('setting', settingsSchema);
const IssueModel = mongoose.model('issue', issueSchema);
const UserIssueModel = mongoose.model('user-issue', userIssueSchema);

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

//Get all issues filtered by a keyword (to get all -> keyword=all)
app.get('/issues/filter/:keyword', async(req, res) => {
	try {
        var issues = await IssueModel.find().exec();
		var filteredIssues = [];
		var keyword = String(req.params.keyword).toLowerCase();
		
		if(keyword == 'all') {
		    res.statusCode = statusOK;
            res.send(issues);
		}
		else {
			for(var i = 0; i<issues.length; i++)
			{
				var desc = String(issues[i].description).toLowerCase();
				var title = String(issues[i].title).toLowerCase();
				if(desc.includes(keyword) || title.includes(keyword))
				{
					filteredIssues.push(issues[i]);
				}
			}
			res.statusCode = statusOK;
			res.send(filteredIssues);
		}
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

//************************ USER-VOTED_ISSUES **********************************

//get all issue that a user have voted on
//username is user email
app.get("/userissues/username/:email", async (request, response) => {
    try {
        var userIssues = await UserIssueModel.find({username: String(request.params.email).toLowerCase()}).exec();
		var votedIssuesAndStats = [];
		for(var i = 0; i<userIssues.length; i++)
			{
				var issueId = String(userIssues[i].issueId);
				var stats = await getStatsForOneIssue(issueId);
				issueAndStats = {
					issueId: userIssues[i].issueId,
                    username: userIssues[i].username,
                    vote: userIssues[i].vote,
                    date: userIssues[i].date,
					yes : stats.yes,
			        no : stats.no,
			        total : stats.total
				}
				//console.log(issueAndStats);
				votedIssuesAndStats.push(issueAndStats);
			}
		response.statusCode = statusOK;
        response.send(votedIssuesAndStats);
    } catch (error) {
        response.status(500).send(error);
		console.log(error);
    }
});

//Helper function to Get stats for one issue
async function getStatsForOneIssue(id) {
    try {
		var stats = {};
        var userIssues = await UserIssueModel.find({issueId: id}).exec();
		//going over each vote on the issue, to collect meaningfull data
		var voteYes = 0;
		var voteNo = 0;
		//console.log(userIssues);
		for(var i = 0; i<userIssues.length; i++)
		{
			//console.log("inside loop", userIssues[i].vote );
            if(userIssues[i].vote == "yes")
			    voteYes++;
			else
				voteNo++;
		}	
		var stats = 
		{
			yes : String(voteYes),
			no : String(voteNo),
			total : String(voteYes+voteNo)
		}
		return stats;
    } catch (error) {
        response.status(500).send(error);
		console.log(error);
		return stats;
    }
};

// Handle POST request
/*
{
  "issueId": "5e78569646dbe4612048fb4b",
  "username": "myEmail@gmail.com",
  "vote": "yes",
  "date": "3-9-2020"
}
*/
app.post('/userissues/', async(req, res) => {
	// get data from request
	var newObject = req.body; // TODO validate data
	console.log(req.body.username);
	//check if issue exists
	try{
	    var userIssueFounded = await UserIssueModel.find({issueId: req.body.issueId, username: String(req.body.username).toLowerCase()}).exec();
		console.log(userIssueFounded);
		if(userIssueFounded.length == 0)
		{
			// add data to MongoDB database
			const userIssue = new UserIssueModel(newObject);
			userIssue.save(function (err, p) {
			if (err) return console.error(err);
			  console.log("user vote on issue is saved to user-issues collection.");
		    });
		
			// send created item back with id included
			res.statusCode = statusOK;
			res.send(`0`);//new vote added
		}
		else {
			console.log("user has already voted on this issue");
			res.statusCode = statusOK;
			res.send(`1`); //no vote added because already exists
		}
	}
	catch(err) {
		res.status(500).send(error);
		console.log(error);
	}
});

app.listen(port, hostname, function () {
    console.log(`Listening at http://${hostname}:${port}/...`);
});
