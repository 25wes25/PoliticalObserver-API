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
            website: {uri: "https://www.whitehouse.gov/people/donald-j-trump/"},
            imageUrl: {uri: "https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg"},
            bio: "Donald John Trump (born June 14, 1946) is the 45th and current president of the United States. Before entering politics, he was a businessman and television personality.\n" +
                "Trump was born and raised in Queens, a borough of New York City, and received a bachelor's degree in economics from the Wharton School. He took charge of his family's real-estate business in 1971, renamed it The Trump Organization, and expanded its operations from Queens and Brooklyn into Manhattan. The company built or renovated skyscrapers, hotels, casinos, and golf courses. Trump later started various side ventures, mostly by licensing his name. He produced and hosted The Apprentice, a reality television series, from 2003 to 2015. As of 2020, Forbes estimated his net worth to be $2.1 billion.\n" +
                "Trump entered the 2016 presidential race as a Republican and defeated 16 other candidates in the primaries. His political positions have been described as populist, protectionist, and nationalist. Despite not being favored in most forecasts, he was elected over Democratic nominee Hillary Clinton, although he lost the popular vote. He became the oldest first-term U.S. president, and the first without prior military or government service. His election and policies have sparked numerous protests. Trump has made many false or misleading statements during his campaign and presidency. The statements have been documented by fact-checkers, and the media have widely described the phenomenon as unprecedented in American politics. Many of his comments and actions have been characterized as racially charged or racist.\n" +
                "During his presidency, Trump ordered a travel ban on citizens from several Muslim-majority countries, citing security concerns; after legal challenges, the Supreme Court upheld the policy's third revision. He enacted a tax-cut package for individuals and businesses, rescinding the individual health insurance mandate. He appointed Neil Gorsuch and Brett Kavanaugh to the Supreme Court. In foreign policy, Trump has pursued an America First agenda, withdrawing the U.S. from the Trans-Pacific Partnership trade negotiations, the Paris Agreement on climate change, and the Iran nuclear deal. During increased tensions with Iran, he ordered the killing of Iranian general Qasem Soleimani. He imposed import tariffs triggering a trade war with China, recognized Jerusalem as the capital of Israel, and withdrew U.S. troops from northern Syria to avoid Turkey's offensive on American-allied Kurds.\n" +
                "A special counsel investigation led by Robert Mueller found that Trump and his campaign welcomed and encouraged Russian foreign interference in the 2016 presidential election under the belief that it would be politically advantageous, but did not find sufficient evidence to press charges of criminal conspiracy or coordination with Russia. Mueller also investigated Trump for obstruction of justice, and his report neither indicted nor exonerated Trump on that count. A 2019 House of Representatives impeachment inquiry found that Trump solicited foreign interference in the 2020 U.S. presidential election from Ukraine to help his re-election bid and then obstructed the inquiry itself. The House impeached Trump on December 18, 2019, for abuse of power and obstruction of Congress. The Senate acquitted him of both charges on February 5, 2020.\n",
        },
        {
            position: "48th vice president",
            name: "Michael Richard Pence",
            party: "R",
            state: "Washington, D.C",
            address: "1600 Pennsylvania Avenue NW in Washington, D.C.",
            phone: "202-456-2121",
            website: {uri: "https://www.usa.gov/federal-agencies/white-house"},
            imageUrl: {uri: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Mike_Pence_official_Vice_Presidential_portrait.jpg"},
        },
        {
            position: "44th President",
            name: "Barak Obama",
            party: "D",
            state: "Washington, D.C",
            website: {uri: "https://obamawhitehouse.archives.gov/"},
            imageUrl: {uri: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE4MDAzNDEwNzg5ODI4MTEw/barack-obama-12782369-1-402.jpg"},
        },
        {
            position: "47th vice President",
            name: "Joseph Robinette Biden",
            party: "D",
            state: "Washington, D.C",
            website: {uri: "https://joebiden.com/joes-vision/"},
            imageUrl: {uri:'https://drivoting.org/wp/wp-content/uploads/2019/07/JB-Headshot-962x675.jpg'},
        },
        {
            position: "43rd President",
            name: "George W. Bush",
            party: "R",
            state: "Washington, D.C",
            website: {uri: "https://georgewbush-whitehouse.archives.gov/"},
            imageUrl: {uri: "https://www.biography.com/.image/t_share/MTE4MDAzNDEwNDY4Mzc0MDMw/george-w-bush-9232768-1-402.jpg"},
        },
        {
            position: "46th Vice President",
            name: "Dick Cheney",
            party: "R",
            state: "Washington, D.C",
            website: {uri: "https://www.biography.com/political-figure/dick-cheney"},
            imageUrl: {uri:"https://www.biography.com/.image/t_share/MTE4MDAzNDEwNDgwMDM5NDM4/dick-cheney-wc-9246063-2-402.jpg"},
        },
        {
            position: "42nd President",
            name: "William Jefferson Clinton",
            party: "D",
            state: "Washington, D.C",
            website: {uri: "https://www.whitehouse.gov/about-the-white-house/presidents/william-j-clinton/"},
            imageUrl: {uri: "https://www.biography.com/.image/t_share/MTIwNjA4NjMzNzczOTE3NzA4/bill-clinton-9251236-1-402.jpg"},
        },
        {
            position: "45th vice President",
            name: "Albert Arnold Gore",
            party: "D",
            state: "Washington, D.C",
            website: {uri: "https://www.algore.com/"},
            imageUrl: {uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg/1200px-Al_Gore%2C_Vice_President_of_the_United_States%2C_official_portrait_1994.jpg"},
        },
        {
            position: "Secretary of State",
            name: "Hillary Diane Rodham Clinton",
            party: "D",
            state: "Washington, D.C",
            website: {uri: "https://www.hillaryclinton.com/"},
            imageUrl: {uri: "https://www.biography.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTE4MDAzNDEwMDU4NTc3NDIy/hillary-clinton-9251306-2-402.jpg"},
        },
        {
            position: "Secretary of State",
            name: "Michael Richard Pompeo",
            party: "R",
            state: "Washington, D.C",
            website: {uri: "https://www.whitehouse.gov/people/mike-pompeo/"},
            imageUrl: {uri:"https://upload.wikimedia.org/wikipedia/commons/1/16/Mike_Pompeo_official_photo.jpg"},
        },
        {
            position: "Secretary of State",
            name: "John Forbes Kerry",
            party: "D",
            state: "Washington, D.C",
            website: {uri: "https://2009-2017.state.gov/secretary/index.htm"},
            imageUrl: {uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/John_Kerry_official_Secretary_of_State_portrait.jpg/220px-John_Kerry_official_Secretary_of_State_portrait.jpg"},
        },
    ]

for(let i = 0; i<presidentialPoliticians.length; i+=1)
{
    let politician  = new PoliticianModel(presidentialPoliticians[i]);
    politician.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}
