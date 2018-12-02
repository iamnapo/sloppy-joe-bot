const fs = require('fs');
const path = require('path');

const util = require('./util');

const tweets = fs.readFileSync(path.join(__dirname, 'scrape-twitter', 'atsipras.txt'), 'utf8').split('\n');

const res = [];
let count = 0;

tweets.forEach((tweet) => {
  util.entities(tweet).then((entities) => {
    res.push({ quote: tweet, entities: util.sortedEntities(entities) });
    count += 1;
    if (count === tweets.length) {
      console.log('module.exports = ', JSON.stringify(res), ';');
    }
  });
});
