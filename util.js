/* eslint-disable camelcase */

const NLU = require('watson-developer-cloud/natural-language-understanding/v1.js');

const natural_language_understanding = new NLU({
	version: '2018-09-21',
	iam_apikey: process.env.WATSON_API_KEY,
	url: 'https://gateway-syd.watsonplatform.net/natural-language-understanding/api'
});

function entities(text) {
	const parameters = {
		text,
		features: {
			entities: {
				limit: 50
			},
		},
		language: "en"
	};
	return new Promise((resolve, reject) => {
		natural_language_understanding.analyze(parameters, (err, response) => {
			if (err) {
				reject(new Error(err));
			} else {
				resolve(response.entities);
			}
		});
	});
}

function relevanceCmp(e1, e2) {
	return e1.relevance > e2.relevance;
}

function sortedEntities(s) {
	return s.sort(relevanceCmp);
}

module.exports = { sortedEntities, entities };
