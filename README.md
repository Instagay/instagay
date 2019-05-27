# Instagay


### How This Works

- [owntracks-to-db](https://github.com/dantaeyoung/Owntracks-to-db) is used to log phone locations and store in a MongoDB database

- When run, `runinstagay.js` does:
  - It retrieves the most recent logged phone location (from the MongoDB database).
  - It randomly retrieves a hashtag from the Google Spreadsheet. (e.g. "#lgbt")
  - Using that hashtag, it searches Instagram for new photos with the given hashtags. This is done via [Puppeteer](https://github.com/GoogleChrome/puppeteer).
  - A) If a photo has a geolocation tag:.
    - It checks: is a photo is within X miles of the location AND hasn't been found before?
        - Then it sends a message to the Slack.
        - Photos that have already been looked at are logged in the DB so they're never double-reported.
  - B) If a photo doesn't have a geolocation tag,
    - The script finds the other hashtags it might have and checks against the Google sheets containing location tags (e.g. "#nola")
    - It checks: does a photo has both a location tag and the hashtag (e.g. is tagged "#lgbt #nola")?
        - Then it sends a message to the Slack.
        - Photos that have already been looked at are logged in the DB so they're never double-reported.





app/config/config.js.example


### Setup


- Dependencies
  - Set up [owntracks-to-db](https://github.com/dantaeyoung/Owntracks-to-db).
    - In the process, you should set up MongoDB. Use the same database as `owntracks-to-db`.
  - Install dependencies: `npm install -d`
  
- Config
  - Copy `app/config/config.js.example` to `app/config/config.js`, and fill in the missing API keys, etc.
  
  
- Run once
  - Check if it runs: `npm start`



### Deployment

`PM2` handles the restarting & rerunning of this script.

  - Install PM2: `npm install pm2 -g`
  - Set PM2 to run on startup: `pm2 startup`, then run the code that results
  - Use PM2 to start: `pm2 start runinstagay.js --name "instagay" --restart-delay=500 --cron "0 * * * *"`
    - (The cron command just manually restarts runinstagay every hour)
    - You can have multiple clients running simultaneously by changing the name of the `--name`: e.g. having `instagay1`, `instagay2`, etc.
  - Save what's running on PM2 to run on restart `pm2 save`
  
