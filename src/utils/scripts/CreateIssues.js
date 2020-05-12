const mongoose = require('mongoose');
const moment = require('moment');
const url = 'mongodb://127.0.0.1:27017/PoliticalObserver';

// Connect to MongoDB server
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.once('open', _ => {
    console.log('Database connected: ', url)
});

db.on('error', err => {
    console.error('Connection error: ', err)
});

const IssueModel = require('../../models/issue');
const IssueDataModel = require('../../models/issueData');

issuesList = [
    {
        title: "Public Health COVID-19",
        description: "Do you agree with schools opening in fall 2020?",
        pros: "chilredn will go back to school",
        cons: "increased risk of infection",
        notes: "read more",
    },
    {
        title: "Federal Health Insurance",
        description: "Do you agree with federal health insurance for all Americans?",
        pros: "All americans would be insured",
        cons: "The money could not be spent on other problems of the country.",
        notes: "read more",
    },
    {
        title: "Federal Tax Reduction",
        description: "Do you agree with federal tax reduction?",
        pros: "Less tax money to pay for individuals",
        cons: "Unclear long term consequences",
        notes: "read more",
    },
    {
        title: "Sate Tax Reduction",
        description: "Do you agree with state tax reduction?",
        pros: "Less tax money to pay for individuals",
        cons: "Unclear long term consequences",
        notes: "read more",
    },
    {
        title: "Federal Government Handling of COVID-19",
        description: "All people should have the right to own all types of guns?",
        pros: "It may help people protect themselves.",
        cons: "It may decrease safety of the society",
        notes: "read more",
    },
    {
        title: "The death penalty",
        description: "Do you agree with abolition of death penalty?",
        pros: "It can save life of innocent people who have been wrongfully convicted.",
        cons: "The murderer may have a chance to attempt murder again.",
        notes: "read more",
    },
    {
        title: "Abortion should be banned",
        description: "Do you agree with a ban on abortion?",
        pros: "It can save lives",
        cons: "It can destroy lives",
        notes: "read more",
    },
    {
        title: "Plastic bags should be banned",
        description: "Do you agree with a ban on production and usage of plastic bags?",
        pros: "It can save the planet",
        cons: "It can be less convenient for users and more costly for producers ",
        notes: "read more",
    },
    {
        title: "Climate Change",
        description: "Do you agree that government should make regulations about climate change?",
        pros: "It can save the planet for future generations.",
        cons: "It can be damage the economy.",
        notes: "read more",
    },
    {
        title: "Immigration Ban",
        description: "Do you agree with immigration bans in form of presidential executive order?",
        pros: "It can stop illegal immigration to the country.",
        cons: "It can be faulty and unfair because the law is made by one person, not the congress.",
        notes: "read more",
    },

]

for (let i = 0; i < issuesList.length; i++) {
    let issue  = new IssueModel(issuesList[i]);
    issue.date = moment().subtract(Math.random()*10, 'days');
    issue.save(async (err, dbRes) => {
        if (err) return console.error(err);
        let data = {
            issueId: new IssueModel(dbRes).id,
            yes: {
                gender:{Male: 0, Female: 0, Other: 0},
                party:{Democrat: 0, Republican: 0, Libertarian: 0, Green: 0, Constitution: 0, Unaligned:0},
                education:{None: 0, Diploma: 0, Associates: 0, Bachelors: 0, Masters: 0, Doctoral:0},
                ethnicity:{White: 0, AfricanAmerican: 0, Asian: 0, NativeAmerican: 0, Hispanic: 0, Other:0}

            },
            no:{
                gender:{Male: 0, Female: 0, Other: 0},
                party:{Democrat: 0, Republican: 0, Libertarian: 0, Green: 0, Constitution: 0, Unaligned:0},
                education:{None: 0, Diploma: 0, Associates: 0, Bachelors: 0, Masters: 0, Doctoral:0},
                ethnicity:{White: 0, AfricanAmerican: 0, Asian: 0, NativeAmerican: 0, Hispanic: 0, Other:0}
            }
        }
        let issueData = new IssueDataModel(data);
        await issueData.save(function (err, dbRes) {
            if (err) console.error(err);
        });
    });
}
