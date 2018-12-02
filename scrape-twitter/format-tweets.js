// One tweet per line
const fs = require('fs');
const json = require('./atsipras_raw.json');

console.log(`Total Tweets: ${json.length}`);
fs.writeFileSync('atsipras.txt', json.map(j => j.text.replace(/(\r\n\t|\n|\r\t)/gm, ' ')).join('\n'));
