const mongoose = require('mongoose');
const moment = require('moment');
const url = 'mongodb://127.0.0.1:27017/PoliticalObserverNew';

// Connect to MongoDB server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected: ', url)
});

db.on('error', err => {
    console.error('Connection error: ', err)
});

const NotificationsModel = require('../../models/notification');

notificationsList = [
    {
        title: "Cast your choice for who you think did well during the last debate.",
        date: moment(),
        body:[{
            sectionTitle: "Vote in the current live poll!",
            sectionBody: "67% of users have participated in the latest poll."
        }]
    },
    {
        title: "Election Starter Pack",
        date: moment(),
        body:[{
            sectionTitle: "1.) Check Your Voter Registration Status.",
            sectionLink: "https://voterstatus.sos.ca.gov/",
            sectionLinkText: "Check Registration"
        },{
            sectionTitle: "2.) Register to vote.",
            sectionBody: "Online must be done by October 15, 2020. Mail-in must be postmarked by October 19, 2020",
            sectionLink: "https://covr.sos.ca.gov/",
            sectionLinkText: "Register to Vote"
        },{
            sectionTitle: "3.) View your voter information guide.",
            sectionLink: 'https://voterguide.sos.ca.gov/',
            sectionBody: "The Official Voter Information Guide for the November 3, 2020, General Election will be available in September 2020.",
            sectionLinkText: "View Voter Guide",
        }]
    },
    {
        title: "Election's Coming Up!",
        date: moment(),
        body:[{
            sectionTitle: "Start researching your favorite candidates!",
            sectionBody: "Check out past actions your favorite politicians have engaged in.",
            sectionLink: "https://voterstatus.sos.ca.gov/",
            sectionLinkText: "View Voter Status",
        }]
    },
]


for (let i = 0; i < notificationsList.length; i++) {
    let notifications  = new NotificationsModel(notificationsList[i]);
    notifications.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}

