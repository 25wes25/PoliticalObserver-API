let express = require('express');
let router = express.Router({ strict: true });
let bodyParser = require('body-parser');
let app = express();

const mongoose = require('mongoose');

let usersRouter = require('./src/routes/UsersRouter');
let demographicsRouter = require('./src/routes/DemographicsRouter');
let settingsRouter = require('./src/routes/SettingsRouter');
let politiciansRouter = require('./src/routes/PoliticiansRouter');
let issuesRouter = require('./src/routes/IssuesRouter');
let topicsRouter = require('./src/routes/TopicsRouter');
let userissuesRouter = require('./src/routes/UserIssuesRouter');
let issueDataRouter = require('./src/routes/IssueDataRouter');
let QuizRouter = require('./src/routes/QuizRouter');

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

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// http status codes
const statusOK = 200;
const statusNotFound = 404;
const statusError = 500;

app.use(bodyParser.json({ type: 'application/json' }));
app.enable('strict routing');
app.set('strict routing', true);
app.use(router);
app.use(usersRouter);
app.use(demographicsRouter);
app.use(settingsRouter);
app.use(politiciansRouter);
app.use(issuesRouter);
app.use(topicsRouter);
app.use(userissuesRouter);
app.use(issueDataRouter);
app.use(QuizRouter);

app.get('/', function (req, res) {
    res.send("PoliticalObserver-API")
});

app.use(function(err, req, res) {
    console.log(err);
});


app.listen(port, hostname, function () {
    console.log(`Listening at http://${hostname}:${port}/...`);
});

