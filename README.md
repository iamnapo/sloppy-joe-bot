# sloppy-joe-bot

A slackbot that uses IBM's Natural Language Understanding API, and Markov
Chains, to find / generate Alexis Tsipras' rhetoric. 

## Setup

1. Put your slackbot token in a file called 'token' in the root directory
2. Set up Google Cloud Platform properly
3. Run: ``npm install``
4. Run: ``node index.js``

## Environment Variables

- **SLACK_BOT_TOKEN**: The token of the slack bot 
- **WATSON_API_KEY**: The api key for the IBM's natural language understanding module