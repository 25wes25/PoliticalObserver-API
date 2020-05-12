const demographics = ['Age','Gender','Marital Status','State','Ethnicity','Education','Income','Personality Type','Party Affiliation'];
const age = [{min: 18,max: 24},{min: 25,max: 29},{min: 30,max: 39},{min: 40,max: 49},{min: 50,max: 59},{min: 60,max: 120}];
const gender = ['Male','Female','Other'];
const state = ['AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY'];
const maritalStatus = ['Married','Single'];
const ethnicity = ['White','African American','Asian','Native American','Hispanic','Other'];
const education = ['None','Diploma','Associate\'s','Bachelor\'s','Master\'s','Doctoral'];
const income = [{min: 0,max: 9875},{min: 9876,max: 40125},{min: 40126,max: 85525},{min: 85526,max: 163300},{min: 163301,max: 207350},{min: 207351,max: 518400},{min: 518401,max: 1000000000}];
const personalityType = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const partyAffiliation = ['Democrat','Republican','Libertarian','Green','Constitution','Unaligned'];

const comparisonDemographics = {
    age: age,
    gender: gender,
    state: state,
    maritalStatus: maritalStatus,
    ethnicity: ethnicity,
    education: education,
    income: income,
    personalityType: personalityType,
    partyAffiliation: partyAffiliation,
};

const demographicsList = [
    {type: 'Age', key: 'age', data: age},
    {type: 'Gender', key: 'gender', data: gender},
    {type: 'Marital Status', key: 'maritalStatus', data: maritalStatus},
    {type: 'State', key: 'state', data: state},
    {type: 'Ethnicity', key: 'ethnicity', data: ethnicity},
    {type: 'Education', key: 'education', data: education},
    {type: 'Income', key: 'income', data: income},
    {type: 'Personality Type', key: 'personalityType', data: personalityType},
    {type: 'Party Affiliation', key: 'partyAffiliation', data: partyAffiliation}
];

module.exports = {
    demographics,
    age,
    gender,
    state,
    maritalStatus,
    ethnicity,
    education,
    income,
    personalityType,
    partyAffiliation,
    comparisonDemographics,
    demographicsList
};
