require('dotenv').config()
const fs = require('fs');
const path = require('path');
const Bot = require('slackbots');
const express = require('express');
const Markov = require('markov-strings').default;

const util = require('./util');
const quotes = require('./quotes');

// So that heroku does not stop
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hello Tsipras!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

console.log('Generating Markov Chain');
const tsiprasText = fs.readFileSync(path.join(__dirname, 'scrape-twitter', 'atsipras.txt'), 'utf8').split('\n');
const markov = new Markov(tsiprasText, { stateSize: 2 });
markov.buildCorpus();

function nextSentence() {
	const options = {
		maxTries: 20,
		filter: result => result.string.split(' ').length >= 5 && result.string.endsWith('.')
	};
	return markov.generate(options);
}

const dict = {
	lname: 'tsiprasbot',
	name: 'tsiprasbot',
	botMessage: 'bot_message'
};

const settings = {
	token: process.env.SLACK_BOT_TOKEN,
	name: dict.name
};

const bot = new Bot(settings);

bot.getUserId(dict.lname).then(data => {
	console.log('Got user id:', data);
	dict.userId = data;
}, err => {
	throw new Error('Couldn\'t retrieve user id :(', err);
});

function closestQuote(quote) {
	return util.entities(quote).then(entities => {
		const sortedEnts = util.sortedEntities(entities);
		if (sortedEnts.length === 0) {
			return null;
		}
		const rel = quotes.reduce((acc, quo) => {
			const ents1 = quo.entities;
			let match = 0;
			sortedEnts.forEach(e1 => {
				ents1.forEach(e2 => {
					match += (e1.text.toLowerCase() === e2.text.toLowerCase()) * e1.relevance;
				});
			});
			match /= ents1.length;
			return match >= acc[0] ? [match, quo] : acc;
		}, [0, null]);
		console.log('Relevance:', rel[0]);
		if (rel[0] >= 0.3) {
			return rel[1];
		}

	})
}

bot.on('message', data => {
	if (data.type !== 'message' || data.user === undefined || data.text === null || data.user === dict.userId) {
		return;
	}

	let quote;
	closestQuote(data.text).then((q) => {
		quote = q ? q.quote : nextSentence().string;
		console.log('Replying to user:', data.user, 'with quote:', quote);
		bot.postMessage(data.channel, quote, { as_user: true, icon_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Alexis_Tsipras_2013.jpg' });
	});

});
