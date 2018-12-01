# Collect tweets

# Usage

- First fetch as many tweets as you like with (if you want to stop earlier then you must put a ] to the end of atsipras_raw.json): `../node_modules/scrape-twitter/bin/scrape-twitter.js timeline tsipras_eu > atsipras_raw.json`
- Then run `node format-tweets.js` to write one text file with one tweet per line
