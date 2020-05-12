const mongoose = require('mongoose');

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

const PoliticalIdeologyModel = require('../../models/politicalIdeology');

let conservative = {
    ideology: 'Conservative',
    description: 'Conservatives tend to believe that government should be small, operating mainly at the state or ' +
        'local level. They favor minimal government interference in the economy and prefer private sector-based ' +
        'solutions to problems. “Social conservatives” believe that government should uphold traditional morality, and ' +
        'therefore should impose restrictions on contraception, abortion, and same-sex marriage. Conservatives are said ' +
        'to fall on the “right wing” of the axis of political beliefs, a convention that dates from the place where ' +
        'conservatives sat in assembly during the French Revolution.'
};

let liberal = {
    ideology: 'Liberal',
    description: 'The definition of liberalism has changed over time, but modern-day liberals tend to believe that ' +
        'government should intervene in the economy and provide a broad range of social services to ensure well-being ' +
        'and equality across society. Liberals usually believe that the government should not regulate private sexual ' +
        'or social behaviors. They are said to fall on the “left wing” of the axis of political beliefs, a convention ' +
        'that dates from the place where supporters of the revolution sat in assembly during the French Revolution.'
};

let moderate = {
    ideology: 'Moderate',
    description: 'Moderate is an ideological category which designates a rejection of radical or extreme views, ' +
        'especially in regard to politics and religion. A moderate is considered someone occupying any mainstream ' +
        'position avoiding extreme views and major social change. In United States politics, a moderate is considered ' +
        'someone occupying a centre position on the left–right political spectrum.'
};

let national_socialist = {
    ideology: 'National Socialist',
    description: "Nazism is a form of fascism, and showed that ideology's disdain for liberal democracy and the " +
        "parliamentary system, but also incorporated fervent antisemitism, anti-communism, scientific racism, and " +
        "eugenics into its creed. Its extreme nationalism came from Pan-Germanism and the ethno-nationalist völkisch " +
        "movement prominent in the German nationalism of the time, and it was strongly influenced by the Freikorps " +
        "paramilitary groups that emerged after Germany's defeat in World War I, from which came the party's " +
        "underlying 'cult of violence'."
};

let authoritarian = {
    ideology: 'Authoritarian',
    description: "Authoritarianism is a form of government characterized by strong central power and limited political " +
        "freedoms. Minimally defined, an authoritarian government lacks free and competitive direct elections to " +
        "legislatures, free and competitive direct or indirect elections for executives, or both. Broadly defined, " +
        "authoritarian states include countries that lack civil liberties such as freedom of religion, or countries " +
        "in which the government and the opposition do not alternate in power at least once following free elections. " +
        "Authoritarian states might contain nominally democratic institutions, such as political parties, legislatures " +
        "and elections, which are managed to entrench authoritarian rule."
};

let traditionalist = {
    ideology: 'Traditionalist',
    description: "Traditional conservatives emphasize the bonds of social order over hyper-individualism and the " +
        "defense of ancestral institutions.Traditionalist conservatives believe in a transcendent moral order, " +
        "manifested through certain natural laws to which they believe society ought to conform in a prudent manner." +
        "Traditionalist conservatives also emphasize the rule of law in securing individual liberty."
};

let anarcho_socialist = {
    ideology: 'Anarcho-Socialist',
    description: "Libertarian socialism, also referred to as anarcho-socialism, anarchist socialism, free socialism, " +
        "stateless socialism, socialist anarchism and socialist libertarianism, is a set of anti-authoritarian, anti-statist " +
        "and libertarian political philosophies within the socialist movement which rejects the conception of socialism as a " +
        "form where the state retains centralized control of the economy. Overlapping with anarchism and libertarianism, it " +
        "criticizes wage labour relationships within the workplace, emphasizing workers' self-management of the workplace and " +
        "decentralized structures of political organization."
};

let anarcho_capitalist = {
    ideology: 'Anarcho-Capitalist',
    description: "Anarcho-capitalism is a political philosophy and economic theory that advocates the elimination of " +
        "centralized states in favor of self-ownership, private property and free markets. Anarcho-capitalists hold " +
        "that in the absence of statute (which they describe as law by arbitrary autocratic decrees, or bureaucratic " +
        "legislation swayed by transitory political special interest groups), society tends to contractually self-regulate" +
        " and civilize through the spontaneous and organic discipline of the free market which they describe as a voluntary" +
        " society. Anarcho-capitalists support wage labour as a 'voluntary trade' and believe that neither protection of" +
        " person and property nor victim compensation requires a state."
};

let libertarian = {
    ideology: 'Libertarian',
    description: "Libertarianism is a political philosophy and movement that upholds liberty as a core principle. " +
        "Libertarians seek to maximize political freedom and autonomy, emphasizing freedom of choice, voluntary " +
        "association and individual judgment. Libertarians share a skepticism of authority and state power, but they " +
        "diverge on the scope of their opposition to existing economic and political systems. Various schools of libertarian" +
        " thought offer a range of views regarding the legitimate functions of state and private power, often calling " +
        "for the restriction or dissolution of coercive social institutions. Different categorizations have been used" +
        " to distinguish various forms of libertarianism. This is done to distinguish libertarian views on the nature " +
        "of property and capital, usually along left–right or socialist–capitalist lines."
};

const politicalIdeologies = [national_socialist, authoritarian, traditionalist, liberal, moderate, conservative, anarcho_socialist, libertarian, anarcho_capitalist];

for (let i = 0; i < politicalIdeologies.length; i++) {
    let ideologies = politicalIdeologies[i];

    const politicalIdeology = new PoliticalIdeologyModel(ideologies);
    politicalIdeology.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}