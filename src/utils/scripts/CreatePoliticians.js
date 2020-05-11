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
const states = ["AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
const SenateURL = "https://www.senate.gov/general/contact_information/senators_cfm.cfm?State=";

for(let i = 0; i<states.length; i+=1)
{
    let state = states[i];
    let senateStateUrl = SenateURL + state;
    fetch(senateStateUrl)
        .then(res => res.text())
        .then(html => {
            const data = HTMLparser.parse(html);
            let dataList = data.querySelectorAll('div.contenttext');
            let senator;

            //first and last 'div.conenttext' data in each query result is irrelevant
            //j = 1 to length -1 to ignore the first and last item.
            //dataList has information of two senators for each state
            for(let j = 1; j<dataList.length-1; j += 1)
            {
                //each query has four data section under div.contenttext
                let dataItem = dataList[j].text.trim();
                if(j%4 == 1) //first: has name, party, state - first data section for a senator
                {
                    //beginning of information for the next senator
                    senator = new PoliticianModel();
                    senator.name = dataItem.substr(0, dataItem.indexOf("\n"));
                    senator.party = dataItem.substr(dataItem.indexOf("(")+1,1);
                    senator.state = dataItem.substr(dataItem.indexOf("(")+5, 2);
                    //console.log("name: ", name,", party: ", party, ", state:", state);
                }
                if(j%4 == 2)//second: has address
                {
                    senator.address = dataItem;
                }
                if(j%4 == 3)//third: has phone
                {
                    senator.phone = dataItem;
                }
                if(j%4 == 0)//fourth: has website - last data section for a senator
                {
                    let length = dataItem.indexOf(".gov")+ 4 -dataItem.indexOf("www.");
                    senator.website = dataItem.substr(dataItem.indexOf("www."), length);

                    //end of records for the senator - save record
                    const politician = new PoliticianModel(senator);
                    politician.save(function (err, p) {
                        if (err) return console.error(err);
                    });
                }
            }
        });
}


