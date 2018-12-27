# Instagay


### How This Works

- The server runs a MongoDB server.
- ~The server app runs an HTTP server that receives locations from OwnTracks~ Use [this repo](https://github.com/dantaeyoung/Owntracks-to-db) to log phone locations to Mongodb
- The server is a script. Run once, it:
  - It retrieves the most recent logged phone location.
  - It finds the tag that has been searched the longest ago.
  - Using that hashtag, it searches Instagram for new photos with the given hashtags. This is done via Puppeteer.
  - It filters for only the photos with geolocations.
  - If a photo is within X miles of the location, then it sends a Slack message!
  - Photos that have already been looked at are logged in the DB so we don't check their location; this reduces the number of Instagram calls we can do.
  

### Setup

Client-side: Owntracks on iOS / Android

- Setup
  - Set up MongoDB
  - Install dependencies: `npm install -d`
  - Check if it runs: `npm start`

- Run continuously:
  - Install PM2: `npm install pm2 -g`
  - Set PM2 to run on startup: `pm2 startup`, then run the code that results
  - Use PM2 to start: `pm2 start app/run.js --name "instagay"
  - Save what's running on PM2 to run on restart `pm2 save`
