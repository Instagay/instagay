# Instagay


### How This Works

- The server runs a MongoDB server.
- The server app runs an HTTP server that receives locations from OwnTracks and logs them. No need for MQTT!
- The server app periodically checks Instagram for new photos with the given hashtags. 
  - It finds photos with geolocations, and retreives the most recent logged location.
  - If a photo is within X miles of the location, then it sends a Slack message!
  - Photos that have already been found are logged in the DB so we don't check their location; this reduces the number of Instagram calls we can have.


### Setup

Client-side: Owntracks on iOS / Android
Server-side: mongodb, and this repo.

#### Repo Installation

- Setup
  - Install dependencies: `npm install -d`
  - Check if it runs: `npm start`

- Run continuously:
  - Install PM2: `npm install pm2 -g`
  - Set PM2 to run on startup: `pm2 startup`, then run the code that results
  - Use PM2 to start app: `pm2 start app/instagay.js`
  - Save what's running on PM2 to run on restart `pm2 save`
