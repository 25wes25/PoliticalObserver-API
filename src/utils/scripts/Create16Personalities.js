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

// Replace with 17 personalities info
const PersonalityModel = require('../../models/personality');

// const {gender, state, maritalStatus, ethnicity, education, personalityType, partyAffiliation} = require('../../../constants');
// const personalityType = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

let istjData = {
    personalityType: 'ISTJ',
    name: 'Logistician',
    description: 'A Logistician (ISTJ) is someone with the Introverted, Observant, Thinking, and Judging personality' +
        ' traits. These people tend to be reserved yet willful, with a rational outlook on life. They compose' +
        ' their actions carefully and carry them out with methodical purpose.',
    strengths: 'Integrity is the heart of the Logistician personality type. Emotional manipulation, mind games and' +
        ' reassuring lies all run counter to Logisticians’ preference for managing the reality of the situations' +
        ' they encounter with plain and simple honesty.',
    weaknesses: 'The facts are the facts, and Logisticians tend to resist any new idea that isn’t supported by them. ' +
        'This factual decision-making process also makes it difficult for people with the Logistician personality type' +
        ' to accept that they were wrong about something – but anyone can miss a detail, even them.',
    stats: 'The Logistician personality type is thought to be the most abundant, making up around 13% of the population.' +
        ' Their defining characteristics of integrity, practical logic and tireless dedication to duty make Logisticians' +
        ' a vital core to many families, as well as organizations that uphold traditions, rules and standards, such as' +
        ' law offices, regulatory bodies and military. People with the Logistician personality type enjoy taking' +
        ' responsibility for their actions, and take pride in the work they do – when working towards a goal,' +
        ' Logisticians hold back none of their time and energy completing each relevant task with accuracy and patience.'
};

let entjData = {
    personalityType: 'ENTJ',
    name: 'Commander',
    description: 'A Commander (ENTJ) is someone with the Extraverted, Intuitive, Thinking, and Judging personality traits.' +
        ' They are decisive people who love momentum and accomplishment. They gather information to construct their' +
        ' creative visions but rarely hesitate for long before acting on them.',
    strengths: 'Commanders see inefficiency not just as a problem in its own right, but as something that pulls time' +
        ' and energy away from all their future goals, an elaborate sabotage consisting of irrationality and laziness.' +
        ' People with the Commander personality type will root out such behavior wherever they go.',
    weaknesses: 'Sometimes all this confidence and willpower can go too far, and Commanders are all too capable' +
        ' of digging in their heels, trying to win every single debate and pushing their vision, and theirs alone.',
    stats: 'Commanders are natural-born leaders. People with this personality type embody the gifts of charisma and ' +
        'confidence, and project authority in a way that draws crowds together behind a common goal. However, ' +
        'Commanders are also characterized by an often ruthless level of rationality, using their drive, determination' +
        ' and sharp minds to achieve whatever end they’ve set for themselves. Perhaps it is best that they make up only' +
        ' three percent of the population, lest they overwhelm the more timid and sensitive personality types that make' +
        ' up much of the rest of the world – but we have Commanders to thank for many of the businesses and institutions' +
        ' we take for granted every day.'
};

let intjData = {
    personalityType: 'INTJ',
    name: 'Architect',
    description: 'An Architect (INTJ) is a person with the Introverted, Intuitive, Thinking, and Judging personality traits. ' +
        'These thoughtful tacticians love perfecting the details of life, applying creativity and rationality to everything ' +
        'they do. Their inner world is often a private, complex one.',
    strengths: 'Architects pride themselves on their minds, and they take every chance they can to improve their knowledge. ' +
        'This shows in the strength and flexibility of their strategic thinking. Highly curious and always up for an ' +
        'intellectual challenge, Architects see things from many different angles. Architect personalities use their ' +
        'creativity to plan for unforeseen possibilities.',
    weaknesses: 'Architect personalities can carry their confidence too far. They may falsely believe that they’ve fixed ' +
        'all the issues of a matter, then call it a day, rejecting the opposing opinions of those they believe to be ' +
        'intellectually inferior. With their disrespect for social standards, Architects can be insensitive when ' +
        'offering their opinions if they aren’t mindful of their attitude and less-developed social skills.',
    stats: 'It can be lonely at the top. Being one of the rarest personality types and being among the most capable ' +
        'people, Architects know this all too well. They make up just two percent of the population, and women with' +
        ' this personality type are especially rare, forming only 0.8%. It can be difficult for Architects to find' +
        ' people who can keep up with their non-stop analysis of things. People with this personality type are' +
        ' imaginative yet decisive... ambitious yet like their privacy... curious about everything but remain focused.'
};

let entpData = {
    personalityType: 'ENTP',
    name: 'Debater',
    description: 'A Debater (ENTP) is a person with the Extraverted, Intuitive, Thinking, ' +
        'and Prospecting personality traits. They tend to be bold and creative, deconstructing and' +
        ' rebuilding ideas with great mental agility. They pursue their goals vigorously despite any ' +
        'resistance they might encounter.',
    strengths: ' Debaters rarely pass up a good opportunity to learn something new, especially abstract concepts. ' +
        'This information isn’t usually absorbed for any planned purpose as with dedicated studying, people with the ' +
        'Debater personality type just find it fascinating.',
    weaknesses: ' If there’s anything Debaters enjoy, it’s the mental exercise of debating an idea, and nothing is' +
        ' sacred. More consensus-oriented personality types rarely appreciate the vigor with which Debater' +
        ' personalities tear down their beliefs and methods, leading to a great deal of tension.',
    stats: 'Taking a certain pleasure in being the underdog, Debaters enjoy the mental exercise found in ' +
        'questioning the prevailing mode of thought, making them irreplaceable in reworking existing systems or ' +
        'shaking things up and pushing them in clever new directions. However, they’ll be miserable managing the ' +
        'day-to-day mechanics of actually implementing their suggestions. Debater personalities love to brainstorm ' +
        'and think big, but they will avoid getting caught doing the “grunt work” at all costs. Debaters only make up ' +
        'about three percent of the population, which is just right, as it lets them create original ideas, then step ' +
        'back to let more numerous and fastidious personalities handle the logistics of implementation and maintenance.'
};

let infjData = {
    personalityType: 'INFJ',
    name: 'Advocate',
    description: 'An Advocate (INFJ) is someone with the Introverted, Intuitive, Feeling, and Judging personality traits. They tend to approach life with deep thoughtfulness and imagination. Their inner vision, personal values, and a quiet, principled version of humanism guide them in all things.',
    strengths: 'Combining a vivid imagination with a strong sense of compassion, Advocates use their creativity to resolve not technical challenges, but human ones. People with the Advocate personality type enjoy finding the perfect solution for someone they care about. This strength makes them excellent counselors and advisors.',
    weaknesses: ' When someone challenges or criticizes Advocates’ principles or values, they are likely to receive an alarmingly strong response. People with the Advocate personality type are highly vulnerable to criticism and conflict. Questioning their motives is the quickest way to their bad side.',
    stats: 'The Advocate personality type is very rare, making up less than one percent of the population, but they nonetheless leave their mark on the world. Advocates have an inborn sense of idealism and morality, but what sets them apart is that they are not idle dreamers. These individuals are capable of taking concrete steps to realize their goals and make a lasting positive impact.'
};

let intpData = {
    personalityType: 'INTP',
    name: 'Logician',
    description: 'A Logician (INTP) is someone with the Introverted, Intuitive, Thinking, and Prospecting personality ' +
        'traits. These flexible thinkers enjoy taking an unconventional approach to many aspects of life. They often ' +
        'seek out unlikely paths, mixing willingness to experiment with personal creativity.',
    strengths: 'People with the Logician personality type view the world as a big, complex machine, and recognize that' +
        ' as with any machine, all parts are interrelated. Logicians excel in analyzing these connections, seeing how ' +
        'seemingly unrelated factors tie in with each other in ways that bewilder most other personality types.',
    weaknesses: 'While Logicians’ intellectualism yields many insights into their surroundings, their ' +
        'surroundings are ironically considered an intrusion on their thoughts. This is especially true with people – ' +
        'Logicians are quite shy in social settings. More complicated situations such as parties exacerbate this, ' +
        'but even close friends struggle to get into Logicians’ hearts and minds.',
    stats: 'The Logician personality type is fairly rare, making up only three percent of the population, which is' +
        ' definitely a good thing for them, as there’s nothing they’d be more unhappy about than being “common”.' +
        ' Logicians pride themselves on their inventiveness and creativity, their unique perspective and vigorous ' +
        'intellect. Usually known as the philosopher, the architect, or the dreamy professor, Logicians have been' +
        ' responsible for many scientific discoveries throughout history.'
};

let infpData = {
    personalityType: 'INFP',
    name: 'Mediator',
    description: 'A Mediator (INFP) is someone who possesses the Introverted, Intuitive, Feeling, and Prospecting personality traits. Making up only 4% of the population, these rare personality types tend to be quiet, open-minded, imaginative, and apply a caring and creative approach to everything they do.',
    strengths: 'Mediators’ friends and loved ones will come to admire and depend on them for their optimism. Their unshaken belief that all people are inherently good, perhaps simply misunderstood, lends itself to an incredibly resilient attitude in the face of hardship.',
    weaknesses: 'Mediators often take their idealism too far, setting themselves up for disappointment as, again and again, evil things happen in the world. This is true on a personal level too, as Mediators may not just idealize their partners, but idolize them, forgetting that no one is perfect.',
    stats: 'Mediator personalities are true idealists, always looking for the hint of good in even the worst of people and events, searching for ways to make things better. While they may be perceived as calm, reserved, or even shy, Mediators have an inner flame and passion that can truly shine. Comprising just 4% of the population, the risk of feeling misunderstood is unfortunately high for the Mediator personality type – but when they find like-minded people to spend their time with, the harmony they feel will be a fountain of joy and inspiration.'
};

let enfjData = {
    personalityType: 'ENFJ',
    name: 'Protagonist',
    description: 'A Protagonist (ENFJ) is a person with the Extraverted, Intuitive, Feeling, and Judging personality traits. These warm, forthright types love helping others, and they tend to have strong ideas and values. They back their perspective with the creative energy to achieve their goals.',
    strengths: 'Protagonists are true team players, and they recognize that that means listening to other peoples’ opinions, even when they contradict their own. They admit they don’t have all the answers, and are often receptive to dissent, so long as it remains constructive.',
    weaknesses: 'People with the Protagonist personality type can be caught off guard as they find that, through circumstance or nature, or simple misunderstanding, people fight against them and defy the principles they’ve adopted, however well-intentioned they may be. They are more likely to feel pity for this opposition than anger, and can earn a reputation of naïveté.',
    stats: 'Protagonists are natural-born leaders, full of passion and charisma. Forming around two percent of the population, they are oftentimes our politicians, our coaches and our teachers, reaching out and inspiring others to achieve and to do good in the world. With a natural confidence that begets influence, Protagonists take a great deal of pride and joy in guiding others to work together to improve themselves and their community.'
};

let enfpData = {
    personalityType: 'ENFP',
    name: 'Campaigner',
    description: 'A Campaigner (ENFP) is someone with the Extraverted, Intuitive, Feeling, and Prospecting personality traits. These people tend to embrace big ideas and actions that reflect their sense of hope and goodwill toward others. Their vibrant energy can flow in many directions.',
    strengths: 'When it comes to new ideas, Campaigners aren’t interested in brooding – they want to go out and experience things, and don’t hesitate to step out of their comfort zones to do so. Campaigners are imaginative and open-minded, seeing all things as part of a big, mysterious puzzle called life.',
    weaknesses: 'When it comes to conceiving ideas and starting projects, especially involving other people, Campaigners have exceptional talent. Unfortunately their skill with upkeep, administration, and follow-through on those projects struggles. Without more hands-on people to help push day-to-day things along, Campaigners’ ideas are likely to remain just that – ideas.',
    stats: 'The Campaigner personality is a true free spirit. They are often the life of the party, but unlike types in the Explorer Role group, Campaigners are less interested in the sheer excitement and pleasure of the moment than they are in enjoying the social and emotional connections they make with others. Charming, independent, energetic and compassionate, the 7% of the population that they comprise can certainly be felt in any crowd.'
};

let isfjData = {
    personalityType: 'ISFJ',
    name: 'Defender',
    description: 'A Defender (ISFJ) is someone with the Introverted, Observant, Feeling, and Judging personality traits. These people tend to be warm and unassuming in their own steady way. They’re efficient and responsible, giving careful attention to practical details in their daily lives.',
    strengths: 'Defenders are the universal helpers, sharing their knowledge, experience, time and energy with anyone who needs it, and all the more so with friends and family. People with this personality type strive for win-win situations, choosing empathy over judgment whenever possible.',
    weaknesses: 'The meek shall inherit the earth, but it’s a long road if they receive no recognition at all. This is possibly Defenders’ biggest challenge, as they are so concerned with others’ feelings that they refuse to make their thoughts known, or to take any duly earned credit for their contributions. Defenders’ standards for themselves are also so high that, knowing they could have done some minor aspect of a task better, they often downplay their successes entirely.',
    stats: 'There’s hardly a better type to make up such a large proportion of the population, nearly 13%. Combining the best of tradition and the desire to do good, Defenders are found in lines of work with a sense of history behind them, such as medicine, academics and charitable social work.'
};

let estjData = {
    personalityType: 'ESTJ',
    name: 'Executive',
    description: 'An Executive (ESTJ) is someone with the Extraverted, Observant, Thinking, and Judging personality traits. They possess great fortitude, emphatically following their own sensible judgment. They often serve as a stabilizing force among others, able to offer solid direction amid adversity.',
    strengths: 'Seeing things to completion borders on an ethical obligation for Executives. Tasks aren’t simply abandoned because they’ve become difficult or boring – people with the Executive personality type take them up when they are the right thing to do, and they will be finished so long as they remain the right thing to do.',
    weaknesses: 'The problem with being so fixated on what works is that Executives too often dismiss what might work better. Everything is opinion until proven, and Executive personalities are reluctant to trust an opinion long enough for it to have that chance.',
    stats: 'Demand for such leadership is high in democratic societies, and forming no less than 11% of the population, it’s no wonder that many of America’s presidents have been Executives. Strong believers in the rule of law and authority that must be earned, Executive personalities lead by example, demonstrating dedication and purposeful honesty, and an utter rejection of laziness and cheating, especially in work. If anyone declares hard, manual work to be an excellent way to build character, it is Executives.'
};

let esfjData = {
    personalityType: 'ESFJ',
    name: 'Consul',
    description: 'A Consul (ESFJ) is a person with the Extraverted, Observant, Feeling, and Judging personality traits. They are attentive and people-focused, and they enjoy taking part in their social community. Their achievements are guided by decisive values, and they willingly offer guidance to others.',
    strengths: 'Consuls are excellent managers of day-to-day tasks and routine maintenance, enjoying making sure that those who are close to them are well cared for.',
    weaknesses: 'These Strengths are related to a chief Weakness: Consuls’ preoccupation with social status and influence, which affects many decisions they make, potentially limiting their creativity and open-mindedness.',
    stats: 'People who share the Consul personality type are, for lack of a better word, popular – which makes sense, given that it is also a very common personality type, making up twelve percent of the population. In high school, Consuls are the cheerleaders and the quarterbacks, setting the tone, taking the spotlight and leading their teams forward to victory and fame. Later in life, Consuls continue to enjoy supporting their friends and loved ones, organizing social gatherings and doing their best to make sure everyone is happy.'
};

let istpData = {
    personalityType: 'ISTP',
    name: 'Virtuoso',
    description: 'A Virtuoso (ISTP) is someone with the Introverted, Observant, Thinking, and Prospecting personality traits. They tend to have an individualistic mindset, pursuing goals without needing much external connection. They engage in life with inquisitiveness and personal skill, varying their approach as needed.',
    strengths: 'Virtuosos are usually up to their elbows in some project or other. Cheerful and good-natured, people with the Virtuoso personality type (especially Assertive ones) rarely get stressed out, preferring to go with the flow.',
    weaknesses: 'As easily as Virtuosos go with the flow, they can also ignore it entirely, and usually move in another direction with little apology or sensitivity. If someone tries to change Virtuosos’ habits, lifestyle or ideas through criticism, they can become quite blunt in their irritation.',
    stats: 'Virtuosos enjoy lending a hand and sharing their experience, especially with the people they care about, and it’s a shame they’re so uncommon, making up only about five percent of the population. Virtuoso women are especially rare, and the typical gender roles that society tends to expect can be a poor fit – they’ll often be seen as tomboys from a young age.'
};

let isfpData = {
    personalityType: 'ISFP',
    name: 'Adventurer',
    description: 'An Adventurer (ISFP) is a person with the Introverted, Observant, Feeling, and Prospecting personality traits. They tend to have open minds, approaching life, new experiences, and people with grounded warmth. Their ability to stay in the moment helps them uncover exciting potentials.',
    strengths: 'People with the Adventurer personality type are relaxed and warm, and their “live and let live” attitude naturally makes them likable and popular.',
    weaknesses: ' Freedom of expression is often Adventurers’ top priority. Anything that interferes with that, like traditions and hard rules, creates a sense of oppression for Adventurer personalities. This can make more rigidly structured academics and work a challenge.',
    stats: 'Adventurers live in a colorful, sensual world, inspired by connections with people and ideas. These personalities take joy in reinterpreting these connections, reinventing and experimenting with both themselves and new perspectives. No other type explores and experiments in this way more. This creates a sense of spontaneity, making Adventurers seem unpredictable, even to their close friends and loved ones.'
};

let estpData = {
    personalityType: 'ESTP',
    name: 'Entrepreneur',
    description: 'An Entrepreneur (ESTP) is someone with the Extraverted, Observant, Thinking, and Prospecting personality traits. They tend to be energetic and action-oriented, deftly navigating whatever is in front of them. They love uncovering life’s opportunities, whether socializing with others or in more personal pursuits.',
    strengths: 'People with the Entrepreneur personality type are full of life and energy. There is no greater joy for Entrepreneurs than pushing boundaries and discovering and using new things and ideas.',
    weaknesses: 'Feelings and emotions come second to facts and “reality” for Entrepreneurs. Emotionally charged situations are awkward, uncomfortable affairs, and Entrepreneurs’ blunt honesty doesn’t help here. These personalities often have a lot of trouble acknowledging and expressing their own feelings as well.',
    stats: 'If Entrepreneurs aren’t careful though, they may get too caught in the moment, take things too far, and run roughshod over more sensitive people, or forget to take care of their own health and safety. Making up only four percent of the population, there are just enough Entrepreneurs out there to keep things spicy and competitive, and not so many as to cause a systemic risk.'
};

let esfpData = {
    personalityType: 'ESFP',
    name: 'Entertainer',
    description: 'An Entertainer (ESFP) is a person with the Extraverted, Observant, Feeling, and Prospecting personality traits. These people love vibrant experiences, engaging in life eagerly and taking pleasure in discovering the unknown. They can be very social, often encouraging others into shared activities.',
    strengths: 'Entertainers aren’t known for holding back. Wanting to experience everything there is to experience, people with the Entertainer personality type don’t mind stepping out of their comfort zones when no one else is willing.',
    weaknesses: 'Entertainers (especially Turbulent ones) are strongly emotional, and very vulnerable to criticism – they can feel like they’ve been backed into a corner, sometimes reacting badly. This is probably Entertainers’ greatest weakness, because it makes it so hard to address any other weaknesses brought to light.',
    stats: 'If anyone is to be found spontaneously breaking into song and dance, it is the Entertainer personality type. Entertainers get caught up in the excitement of the moment, and want everyone else to feel that way, too. No other personality type is as generous with their time and energy as Entertainers when it comes to encouraging others, and no other personality type does it with such irresistible style.'
};

const personalityType = [intjData,intpData, entjData, istjData, entpData, infjData, infpData, enfjData, enfpData,
    isfjData, estjData, esfjData, istpData, isfpData, estpData, esfpData];

for (let i = 0; i < personalityType.length; i++) {
    let userData = personalityType[i];

    const personality = new PersonalityModel(userData);
    personality.save(async (err, dbRes) => {
        if (err) return console.error(err);
    });
}