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
const states = ["AK","AL","AR","AS","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
const SenateURL = "https://www.senate.gov/general/contact_information/senators_cfm.cfm?State=";
const HouseURL = "https://ziplook.house.gov/htbin/findrep_house?ZIP=";
//Some state have more than one Zip range for one state, so state are added to json object rather than using states list above.
//if zipcodes are used as string, make sure to convert them to number in loop.
const zipRanges = [
    {state: 'AK', start: 99501, end: 99950},
    {state: 'AL', start: 35004, end: 36925},
    {state: 'AR', start: 71601, end: 72959},
    {state: 'AR', start: 75502, end: 75502},
    {state: 'AR', start: 85001, end: 86556},
    {state: 'CA', start: 90001, end: 96162},
    {state: 'CO', start: 80001, end: 81658},
    //{state: 'CT', start: 6001, end: 6389},
    //{state: 'CT', start: 6401, end: 6928},
    {state: 'DC', start: 20001, end: 20039},
    {state: 'DC', start: 20042, end: 20599},
    {state: 'DC', start: 20799, end: 20799},
    {state: 'DE', start: 32004, end: 34997},
    {state: 'FL', start: 19701, end: 19980},
    {state: 'GA', start: 30001, end: 31999},
    {state: 'DE', start: 39901, end: 39901},
]; //list continues : http://www.structnet.com/instructions/zip_min_max_by_state.html -> adding a script to read this

//Getting the members of the Senate
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
                    senator.position = 'Senator';
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

//Getting the members of the House of Representatives
for(let i = 0; i<zipRanges.length; i+=1)
{
    let namePrev = '';
    for(let zip = zipRanges[i].start; zip<zipRanges[i].end; zip+=200)
    {
        console.log(zip);
        const urlSenate = "https://ziplook.house.gov/htbin/findrep_house?ZIP="+zip;
        fetch(urlSenate)
            .then(res => res.text())
            .then(async html => {
                try{
                    const dataHtml = HTMLparser.parse(html);
                    let representativeData1 = dataHtml
                        .querySelector('.repdistrict')
                        .querySelector('#RepInfo')
                        .text
                        .trim()
                        .split('\n');
                    let name = representativeData1[0].trim();
                    let party = representativeData1[1].trim();
                    //console.log(name, ", ", party)
                    let representativeData2 = dataHtml
                        .querySelector('.repdistrict')
                        .querySelector('a').getAttribute('href');
                    let website = representativeData2;
                    //console.log(website);
                    let representativeData3 = dataHtml
                        .querySelector('.repdistrict')
                        .querySelector('img').getAttribute('src');
                    let image = 'https://ziplook.house.gov' + representativeData3;
                    //console.log(image);
                    if(namePrev!==name)
                    {
                        let representativeData = {
                            name: name,
                            position: 'House Representative',
                            party: party,
                            state: zipRanges[i].state,
                            website: {url: website},
                            imageUrl: {url:image},
                        }
                        let representative = new PoliticianModel(representativeData);
                        await representative.save(function (err, dbRes) {
                            if (err) console.error(err);
                        });
                        console.log(zip, ", ", zipRanges[i].end, ", ", zip<zipRanges[i].end);
                    }
                    namePrev = name;
                }
                catch(error)
                {
                    console.log(error);
                    zip+=100;
                }
            }).catch(function(error) {
                //console.log(error);
                zip+=100;
            });
    }
}





