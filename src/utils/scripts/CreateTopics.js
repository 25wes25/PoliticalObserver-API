const mongoose = require('mongoose');
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

const TopicModel = require('../../models/topic');

/*
    title: String,
    category: String,
    subCategory: String,
    description: String,
    body: String,

 */
topicList = [
    {
        title: "Democracy",
        category: "Government",
        subCategory: "Form of Government",
        description: "Democracy is a form of government in which the people exercise the authority of government.",
        body: " Who people are and how authority is shared among them are core issues for democratic theory, development and constitution. Some cornerstones of these issues are freedom of assembly and speech, inclusiveness and equality, membership, consent, voting, right to life and minority rights." +
            " Generally, there are two types of democracy: direct and representative - however, the noun democracy" +
            " has, over time, been modified by more than 3,500 adjectives which suggests that it may have types that can elude and elide this duality. In a direct democracy, the people directly deliberate and decide on legislature. In a representative democracy, the people elect representatives to deliberate and decide on legislature, such as in parliamentary or presidential democracy."+
            " Liquid democracy combines elements of these two basic types. The most common decision making approach of democracies has been the majority rule. Others are supermajority and consensus.",

    },
    {
        title: "Republic",
        category: "Government",
        subCategory: "Form of Government",
        description: "A republic is a form of government in which the country is considered a \"public matter\", not the private concern or property of the rulers.",
        body:" The primary positions of power within a republic are attained, through democracy, oligarchy, autocracy, or a mix thereof, rather than being unalterably occupied." +
              " It has become the opposing form of government to a monarchy and has therefore no monarch as head of state. In the context of American constitutional law, the definition" +
              " of republic refers specifically to a form of government in which elected individuals represent the citizen body and exercise power according to the rule of law under a" +
              " constitution, including separation of powers with an elected head of state, referred to as a constitutional republic or representative democracy.",
},
    {
        title: "Senate",
        category: "Government",
        subCategory: "Congress",
        description: "The United States Senate is the upper chamber of the United States Congress, which, along with the United States House of Representatives—the lower chamber—constitutes the legislature of the United States.",
        body: " The Senate chamber is located in the north wing of the Capitol Building in Washington, D.C."+
              " The composition and powers of the Senate are established by Article One of the United States Constitution." +
              " The Senate is composed of senators, each of whom represents a single state in its entirety. Each state, regardless of its population size, is equally represented by two senators who serve staggered terms of six years."+
              " There being at present 50 states in the Union, there are currently 100 senators. From 1789 to 1913, senators were appointed by legislatures of the states they represented;"+
              " they are now elected by popular vote, following the ratification of the Seventeenth Amendment in 1913.",
    },
    {
        title: "House of Representatives",
        category: "Government",
        subCategory: "Congress",
        description: "The United States House of Representatives is the lower house of the United States Congress, the Senate being the upper house. Together they compose the national legislature of the United States.",
        body: " The composition of the House is established by Article One of the United States Constitution."+
              " The House is composed of representatives who sit in congressional districts that are allocated to each of the 50 states on a basis of population as measured by the U.S. Census, with each district entitled to one representative." +
              " Since its inception in 1789, all representatives have been directly elected. The total number of voting representatives is fixed by law at 435." +
              " In addition, there are currently six non-voting members, bringing the total membership of the US House of Representatives to 441" +
              " or fewer in the case of vacancies. As of the 2010 Census, the largest delegation is that of California, with 53 representatives." +
              " Seven states have only one representative: Alaska, Delaware, Montana, North Dakota, South Dakota, Vermont, and Wyoming.",
    },
    {
        title: "Executive",
        category: "Government",
        subCategory: "Branch",
        description: "The executive is the branch of government exercising authority in and holding responsibility for the governance of a state. The executive executes and enforces law.",
        body: " In political systems based on the principle of separation of powers, authority is distributed among several branches (executive, legislative, judicial)—an attempt to prevent the concentration of power in the hands of a single group of people."+
              " In such a system, the executive does not pass laws (the role of the legislature) or interpret them (the role of the judiciary)." +
              " Instead, the executive enforces the law as written by the legislature and interpreted by the judiciary. The executive can be the source of certain types of law, such as a decree or executive order." +
              " Executive bureaucracies are commonly the source of regulations." +
              " In parliamentary systems, the executive is responsible to the elected legislature, i.e. must maintain the confidence of the legislature (or one part of it, if bicameral).",
    },
    {
        title: "Legislative",
        category: "Government",
        subCategory: "Branch",
        description: "A legislature is a deliberative assembly with the authority to make laws for a political entity such as a country or city.",
        body: "Legislatures form important parts of most governments; in the separation of powers model, they are often contrasted with the executive and judicial branches of government." +
              " Laws enacted by legislatures are usually known as primary legislation. In addition, legislatures may observe and steer governing actions, with authority to amend the budget involved." +
              " The members of a legislature are called legislators. In a democracy, legislators are most commonly popularly elected, although indirect election and appointment by the executive are also used, particularly for bicameral legislatures featuring an upper chamber."+
              " Legislatures are made up of individual members, known as legislators, who vote on proposed laws."+
              " A legislature may debate and vote upon bills as a single unit, or it may be composed of multiple separate assemblies, called by various names including legislative chambers, debate chambers, and houses, which debate and vote separately and have distinct powers." +
              " A legislature which operates as a single unit is unicameral, one divided into two chambers is bicameral, and one divided into three chambers is tricameral.",


    },
    {
        title: "Judicial",
        category: "Government",
        subCategory: "Branch",
        description: "The judiciary (also known as the judicial system, judicature, judicial branch, Judiciative Branch, court or judiciary system) is the system of courts that interprets and applies law in legal cases.",
        body: " The judiciary is the system of courts that interprets and applies the law in the name of the state. " +
              " The judiciary can also be thought of as the mechanism for the resolution of disputes." +
              " Under the doctrine of the separation of powers, the judiciary generally does not make statutory law (which is the responsibility of the legislature) or enforce law (which is the responsibility of the executive), but rather interprets law and applies it to the facts of each case. " +
              " many jurisdictions the judicial branch has the power to change laws through the process of judicial review. " +
              " Courts with judicial review power may annul the laws and rules of the state when it finds them incompatible with a higher norm, such as primary legislation, the provisions of the constitution, treaties or international law. " +
              " Judges constitute a critical force for interpretation and implementation of a constitution, thus in common law countries creating the body of constitutional law. " +
              " The federal judiciary of the United States is one of the three branches of the federal government of the United States organized under the United States Constitution and laws of the federal government."+
              " Article III of the Constitution requires the establishment of a Supreme Court and permits the Congress to create other federal courts, and place limitations on their jurisdiction." +
              " Article III federal judges are appointed by the president with the consent of the Senate to serve until they resign, are impeached and convicted, retire, or die",
    },
    {
        title: "President",
        category: "Government",
        subCategory: "Position",
        description: "The president of the United States is the head of state and head of government of the United States of America.",
        body: " The president directs the executive branch of the federal government and is the commander-in-chief of the United States Armed Forces." +
              " In contemporary times, the president is looked upon as one of the world's most powerful political figures as the leader of the only remaining global superpower." +
              " The role includes responsibility for the world's most expensive military, which has the second largest nuclear arsenal." +
              " The president also leads the nation with the largest economy by nominal GDP. The president possesses significant domestic and international hard and soft power." +
              " Article II of the Constitution establishes the executive branch of the federal government. It vests the executive power of the United States in the president. ",
    },
    {
        title: "Vice President",
        category: "Government",
        subCategory: "Position",
        description: "The vice president of the United States is the second-highest officer in the executive branch of the U.S. federal government, after the president of the United States, and ranks first in the presidential line of succession.",
        body: "The vice president is also an officer in the legislative branch, as president of the Senate." +
              " In this capacity, the vice president is empowered to preside over Senate deliberations, but may not vote except to cast a tie-breaking vote." +
              " The vice president also presides over joint sessions of Congress" +
              " The vice president is indirectly elected together with the president to a four-year term of office by the people of the United States through the Electoral College",

    },
    {
        title: "Senator",
        category: "Government",
        subCategory: "Position",
        description: "The United States Senate is the upper chamber of the United States Congress, which, along with the United States House of Representatives—the lower chamber—constitutes the legislature of the United States.  in order to distinguish who is a member of which house, a member of the Senate is typically referred to as Senator",
        body: " The Senate is composed of senators, each of whom represents a single state in its entirety." +
              " Each state, regardless of its population size, is equally represented by two senators who serve staggered terms of six years." +
              " There being at present 50 states in the Union, there are currently 100 senators. From 1789 to 1913, senators were appointed by legislatures of the states they represented;" +
              " they are now elected by popular vote, following the ratification of the Seventeenth Amendment in 1913.",

    },
    {
        title: "Representative",
        category: "Government",
        subCategory: "Position",
        description: "The United States Senate is the upper chamber of the United States Congress, which, along with the United States House of Representatives—the lower chamber—constitutes the legislature of the United States.  in order to distinguish who is a member of which house, a member of the House is typically referred to as House representatives.",
        body: " Under Article I, Section 2 of the Constitution, seats in the House of Representatives are apportioned among the states by population, as determined by the census conducted every ten years. Each state is entitled to at least one representative, however small its population." +
              " Congress regularly increased the size of the House to account for population growth until it fixed the number of voting House members at 435 in 1911."+
              " In 1959, upon the admission of Alaska and Hawaii, the number was temporarily increased to 437 (seating one representative from each of those states without changing existing apportionment), and returned to 435 four years later, after the reapportionment consequent to the 1960 census." +
              " Article I, Section 2 of the Constitution sets three qualifications for representatives."+
              " Each representative must: (1) be at least twenty-five years old; (2) have been a citizen of the United States for the past seven years; and (3) be (at the time of the election) an inhabitant of the state they represent.",

    },
    {
        title: "Capitalism",
        category: "Economics",
        subCategory: "Economic System",
        description: "Capitalism is an economic system based on the private ownership of the means of production and their operation for profit.",
        body: " Characteristics central to capitalism include private property, capital accumulation, wage labor, voluntary exchange, a price system and competitive markets" +
              " In a capitalist market economy, decision-making and investments are determined by every owner of wealth, property or production ability in financial and capital markets whereas prices and the distribution of goods and services are mainly determined by competition in goods and services markets." +
              " Capitalism in its modern form can be traced to the emergence of agrarian capitalism and mercantilism in the early Renaissance, in city-states like Florence" +
              " Capital has existed incipiently on a small scale for centuries in the form of merchant, renting and lending activities and occasionally as small-scale industry with some wage labour.",

    },
    {
        title: "Socialism",
        category: "Economics",
        subCategory: "Economic System",
        description: "Socialism is a political, social and economic philosophy encompassing a range of economic and social systems characterised by social ownership",
        body: " Social ownership can be public, collective, cooperative or of equity." +
              " Socialist systems are divided into non-market and market forms" +
              " Non-market socialism substitutes factor markets and money for integrated economic planning and engineering or technical criteria based on calculation performed in-kind, thereby producing a different economic mechanism that functions according to different economic laws and dynamics than those of capitalism." +
              " By contrast, market socialism retains the use of monetary prices, factor markets and in some cases the profit motive, with respect to the operation of socially owned enterprises and the allocation of capital goods between them." +
              " Profits generated by these firms would be controlled directly by the workforce of each firm or accrue to society at large in the form of a social dividend.",
    },
    {
        title: "Communism",
        category: "Economics",
        subCategory: "Economic System",
        description: "Communism (from Latin communis, \"common, universal\") is a philosophical, social, political, economic ideology and movement whose ultimate goal is the establishment of a communist society, namely a socioeconomic order structured upon the ideas of common ownership of the means of production and the absence of social classes, money and the state.",
        body: " Communism includes a variety of schools of thought which broadly include Marxism and anarchism (especially anarcho-communism) as well as the political ideologies grouped around both."+
              " All of these share the analysis that the current order of society stems from its economic system and mode of production, capitalism;" +
              " that in this system there are two major social classes; that conflict between these two classes is the root of all problems in society;" +
              " and that this situation will ultimately be resolved through a social revolution. The two classes are the proletariat (the working class)—who must work to survive and who make up the majority within society—and the bourgeoisie (the capitalist class)—a minority who derives profit from employing the working class through private ownership of the means of production." +
              " According to this analysis, revolution would put the working class in power and in turn establish social ownership of the means of production which is the primary element in the transformation of society towards communism.",
    },
    {
        title: "The Constitution",
        category: "Law",
        subCategory: "Supreme Law",
        description: "The Constitution of the United States is the supreme law of the United States of America",
        body: " The Constitution, originally comprising seven articles, delineates the national frame of government." +
              " Its first three articles embody the doctrine of the separation of powers, whereby the federal government is divided into three branches:" +
              " the legislative, consisting of the bicameral Congress (Article One); the executive, consisting of the president (Article Two);"+
              " and the judicial, consisting of the Supreme Court and other federal courts (Article Three)." +
              " Articles Four, Five and Six embody concepts of federalism, describing the rights and responsibilities of state governments, the states in relationship to the federal government, and the shared process of constitutional amendment." +
              " Article Seven establishes the procedure subsequently used by the thirteen States to ratify it. It is regarded as the oldest written and codified national constitution in force.",
    },
    {
        title: "Electoral College",
        category: "Election",
        subCategory: "Position",
        description: "The Electoral College is a body of electors established by the United States Constitution, which forms every four years for the sole purpose of electing the president and vice president of the United States.",
        body: " The Electoral College consists of 538 electors, and an absolute majority of at least 270 electoral votes is required to win the election" +
              " According to Article II, Section 1, Clause 2 of the Constitution, each state legislature determines the manner by which its state's electors are chosen." +
              " Each state's number of electors is equal to the combined total of the state's membership in the Senate and House of Representatives;" +
              " currently there are 100 senators and 435 representatives."+
              " Additionally, the Twenty-third Amendment, ratified in 1961, provides that the District of Columbia (D.C.) is entitled to the number of electors it would have if it were a state, but no more than the least populated state (presently 3)." +
              " U.S. territories are not entitled to any electors as they are not states.",
    },
    {
        title: "Campaign Finances",
        category: "Economics",
        subCategory: "Definitions",
        description: "Campaign finance in the United States is the financing of electoral campaigns at the federal, state, and local levels.",
        body: " At the federal level, campaign finance law is enacted by Congress and enforced by the Federal Election Commission (FEC), an independent federal agency."+
              " Although most campaign spending is privately financed (largely through donors that work in subsidized industries)[1], public financing is available for qualifying candidates for President of the United States during both the primaries and the general election." +
              " Eligibility requirements must be fulfilled to qualify for a government subsidy, and those that do accept government funding are usually subject to spending limits on money.",

    },
    {
        title: "Budget",
        category: "Economics",
        subCategory: "Definitions",
        description: "The United States federal budget comprises the spending and revenues of the U.S. federal government. ",
        body: "The budget is the financial representation of the priorities of the government, reflecting historical debates and competing economic philosophies" +
              " The government primarily spends on healthcare, retirement, and defense programs." +
              " The non-partisan Congressional Budget Office provides extensive analysis of the budget and its economic effects." +
              " It has reported that large budget deficits over the next 30 years are projected to drive federal debt held by the public to unprecedented levels—from 78 percent of gross domestic product (GDP) in 2019 to 144 percent by 2049." ,
    },
    {
        title: "Tax",
        category: "Economics",
        subCategory: "Definitions",
        description: "Taxes are levied on income, payroll, property, sales, capital gains, dividends, imports, estates and gifts, as well as various fees.",
        body: " The United States of America has separate federal, state, and local governments with taxes imposed at each of these levels." +
              "  In 2010, taxes collected by federal, state, and municipal governments amounted to 24.8% of GDP.",

    },
    {
        title: "Sate Government",
        category: "Government",
        subCategory: "Form of Government",
        description: "State governments of the United States are institutional units in the United States exercising some of the functions of government at a level below that of the federal government.",
        body: " Each state's government holds legislative, executive, and judicial authority over[1] a defined geographic territory. " +
              " The United States comprises 50 states: 13 that were already part of the United States at the time the present Constitution took effect in 1789, plus 37 that have been admitted since by Congress as authorized under Article IV, Section 3 of the Constitution",

    },
    {
        title: "Federal Government",
        category: "Government",
        subCategory: "Form of Government",
        description: "The federal government of the United States (U.S. federal government) is the national government of the United States, a federal republic in North America, composed of 50 states, a federal district, five major self-governing territories and several island possessions.",
        body: " The federal government is composed of three distinct branches: legislative, executive and judicial, whose powers are vested by the U.S. Constitution in the Congress, the president and the federal courts, respectively." +
              " The powers and duties of these branches are further defined by acts of Congress, including the creation of executive departments and courts inferior to the Supreme Court." +
              " The United States government is based on the principles of federalism and republicanism, in which power is shared between the federal government and state governments.",
    },
    {
        title: "Law",
        category: "Legislative",
        subCategory: "Definition",
        description: "Law has been variously described as a science and the art of justice.",
        body: " State-enforced laws can be made by a collective legislature or by a single legislator, resulting in statutes, by the executive through decrees and regulations, or established by judges through precedent, normally in common law jurisdictions. " +
              " Private individuals can create legally binding contracts, including arbitration agreements that may elect to accept alternative arbitration to the normal court process. The formation of laws themselves may be influenced by a constitution, written or tacit, and the rights encoded therein. " +
              " The law shapes politics, economics, history and society in various ways and serves as a mediator of relations between people.",
    },
    {
        title: "Bill",
        category: "Legislative",
        subCategory: "Definition",
        description: "A bill is proposed legislation under consideration by a legislature.A bill does not become law until it is passed by the legislature and, in most cases, approved by the executive.",
        body: " Once a bill has been enacted into law, it is called an act of the legislature, or a statute." +
              " Bills are introduced in the legislature and are discussed, debated and voted upon.",
    },
    {
        title: "Referendum",
        category: "Voting",
        subCategory: "Definition",
        description: "A referendum (plural: referendums or less commonly referenda) is a direct and universal vote in which an entire electorate is invited to vote on a particular proposal and can have nationwide or local forms.",
        body: " This may result in the adoption of a new policy or specific law. In some countries, it is synonymous with a plebiscite or a vote on a ballot question." +
              " Some definitions of 'plebiscite' suggest it is a type of vote to change the constitution or government of a country."+
              " The word, 'referendum' is often a catchall, used for both legislative referrals and initiatives." +
              " From a political-philosophical perspective, referendums are an expression of direct democracy, but today, most referendums need to be understood within the context of representative democracy. They tend to be used quite selectively, covering issues such as changes in voting systems, where currently elected officials may not have the legitimacy or inclination to implement such changes.",
    },
    {
        title: "Voting",
        category: "Voting",
        subCategory: "Definition",
        description: "Voting is a method for a group, such as a meeting or an electorate, in order to make a collective decision or express an opinion usually following discussions, debates or election campaigns. Democracies elect holders of high office by voting.",
        body: " Residents of a place represented by an elected official are called \"constituents\", and those constituents who cast a ballot for their chosen candidate are called \"voters\"." +
              " There are different systems for collecting votes."+
              " In smaller organisations, voting can occur in different ways. Formally via ballot to elect others for example within a workplace, to elect members of political associations or to choose roles for others. Informally voting could occur as spoken agreement or as a verbal gesture like a raised hand.",
    },

]

for (let i = 0; i < topicList.length; i++) {
    let topic  = new TopicModel(topicList[i]);
    topic.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}
