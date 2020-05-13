const mongoose = require('mongoose');
const fetch = require('node-fetch');
const HTMLparser = require('node-html-parser');
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
            website: {url: "https://www.whitehouse.gov/people/donald-j-trump/"},
            imageUrl: {url: "https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg"},
        },
        {
            position: "48th vice president",
            name: "Michael Richard Pence",
            party: "R",
            state: "Washington, D.C",
            address: "1600 Pennsylvania Avenue NW in Washington, D.C.",
            phone: "202-456-2121",
            website: {url: "https://www.usa.gov/federal-agencies/white-house"},
            imageUrl: {url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Mike_Pence_official_Vice_Presidential_portrait.jpg"},
        },
        {
            position: "44th President",
            name: "Barak Obama",
            party: "D",
            state: "Washington, D.C",
            website: {url: "https://obamawhitehouse.archives.gov/"},
            imageUrl: {url: "hhttps://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg"},
        },
        {
            position: "47th vice President",
            name: "Joseph Robinette Biden",
            party: "D",
            state: "Washington, D.C",
            website: {url: "https://joebiden.com/joes-vision/"},
            imageUrl: {url:'https://drivoting.org/wp/wp-content/uploads/2019/07/JB-Headshot-962x675.jpg'},
        },
        {
            position: "43rd President",
            name: "George W. Bush",
            party: "R",
            state: "Washington, D.C",
            website: {url: "https://georgewbush-whitehouse.archives.gov/"},
            imageUrl: {url: "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNDY4Mzc0MDMw/george-w-bush-9232768-1-402.jpg"},
        },
        {
            position: "46th Vice President",
            name: "Dick Cheney",
            party: "R",
            state: "Washington, D.C",
            website: {url: "https://www.biography.com/political-figure/dick-cheney"},
            imageUrl: {url:"https://www.biography.com/.image/t_share/MTE4MDAzNDEwNDgwMDM5NDM4/dick-cheney-wc-9246063-2-402.jpg"},
        },
        {
            position: "42nd President",
            name: "William Jefferson Clinton",
            party: "D",
            state: "Washington, D.C",
            website: {url: "https://www.whitehouse.gov/about-the-white-house/presidents/william-j-clinton/"},
            imageUrl: {url: "https://www.biography.com/.image/t_share/MTIwNjA4NjMzNzczOTE3NzA4/bill-clinton-9251236-1-402.jpg"},
        },
        {
            position: "45th vice President",
            name: "Albert Arnold Gore",
            party: "D",
            state: "Washington, D.C",
            website: {url: "https://www.algore.com/"},
            imageUrl: {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg/1200px-Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg"},
        },
        {
            position: "Secretary of State",
            name: "Hillary Diane Rodham Clinton",
            party: "D",
            state: "Washington, D.C",
            website: {url: "https://www.hillaryclinton.com/"},
            imageUrl: {url: "https://www.biography.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTE4MDAzNDEwMDU4NTc3NDIy/hillary-clinton-9251306-2-402.jpg"},
        },
        {
            position: "Secretary of State",
            name: "Michael Richard Pompeo",
            party: "R",
            state: "Washington, D.C",
            website: {url: "https://www.whitehouse.gov/people/mike-pompeo/"},
            imageUrl: {url:"https://upload.wikimedia.org/wikipedia/commons/1/16/Mike_Pompeo_official_photo.jpg"},
        },
        {
            position: "Secretary of State",
            name: "John Forbes Kerry",
            party: "D",
            state: "Washington, D.C",
            website: {url: "https://2009-2017.state.gov/secretary/index.htm"},
            imageUrl: {url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/John_Kerry_official_Secretary_of_State_portrait.jpg/220px-John_Kerry_official_Secretary_of_State_portrait.jpg"},
        },
    ]

for(let i = 0; i<presidentialPoliticians.length; i+=1)
{
    let politician  = new PoliticianModel(presidentialPoliticians[i]);
    politician.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}