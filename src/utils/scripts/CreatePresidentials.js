const mongoose = require('mongoose');
const fetch = require('node-fetch');
const HTMLparser = require('node-html-parser');
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

const PoliticianModel = require('../../models/politician');
//const {states} = require('../../../constants');

let presidentialPoliticians =
[
    {
        position: "President",
        name: "45th Donald John Trump",
        party: "R",
        state: "Washington, D.C",
        address: "1600 Pennsylvania Avenue NW in Washington, D.C.",
        phone: "202-456-2121",
        website: "https://www.whitehouse.gov/people/donald-j-trump/",
    },
    {
        position: "48th vice president",
        name: "Mike Pence",
        party: "R",
        state: "Washington, D.C",
        address: "1600 Pennsylvania Avenue NW in Washington, D.C.",
        phone: "202-456-2121",
        website: "https://www.whitehouse.gov/people/mike-pence/",
    },
    {
        position: "44th President",
        name: "Barak Obama",
        party: "D",
        state: "Washington, D.C",
        website: "https://obamawhitehouse.archives.gov/",
    },
    {
        position: "47th vice President",
        name: "Joseph Robinette Biden",
        party: "D",
        state: "Washington, D.C",
        website: "https://joebiden.com/joes-vision/",
    },
    {
        position: "43rd President",
        name: "George W. Bush",
        party: "R",
        state: "Washington, D.C",
        website: "https://georgewbush-whitehouse.archives.gov/",
    },
    {
        position: "46th Vice President",
        name: "Dick Cheney",
        party: "R",
        state: "Washington, D.C",
        website: "https://www.biography.com/political-figure/dick-cheney",
    },
    {
        position: "42nd President",
        name: "William Jefferson Clinton",
        party: "D",
        state: "Washington, D.C",
        website: "https://www.whitehouse.gov/about-the-white-house/presidents/william-j-clinton/",
    },
    {
        position: "45th vice President",
        name: "Albert Arnold Gore",
        party: "D",
        state: "Washington, D.C",
        website: "https://www.algore.com/",
    },
    {
        position: "Secretary of State",
        name: "Hillary Diane Rodham Clinton",
        party: "D",
        state: "Washington, D.C",
        website: "https://www.hillaryclinton.com/",
    },
    {
        position: "Secretary of State",
        name: "Michael Richard Pompeo",
        party: "R",
        state: "Washington, D.C",
        website: "https://www.whitehouse.gov/people/mike-pompeo/",
    },
    {
        position: "Secretary of State",
        name: "John Forbes Kerry",
        party: "D",
        state: "Washington, D.C",
        website: "https://2009-2017.state.gov/secretary/index.htm",
    },
]

for(let i = 0; i<presidentialPoliticians.length; i+=1)
{
    let politician  = new PoliticianModel(presidentialPoliticians[i]);
    politician.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}
