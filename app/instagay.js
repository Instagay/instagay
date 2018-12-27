const config = require('./config/config');
const Slack = require('./Slack');
const Helpers = require('./Helpers');
const Database = require('./Database');
const Instapuppet = require('./Instapuppet');

var slack;

var log = (msg) => {
  console.log(msg);
}

var logslack = (msg) => {
  log(msg);
//  slack.send_message(msg.toString());
}


(async () => {

  log("================ ");
  var abilities = {};

  log("+++ adding Slack");
  slack = new Slack(config);

  logslack("=== INSTAGAY is starting...");

  log("+++ adding Database");
  var database = new Database(config);

  await database.init(); 
  var phone_location = await database.get_phone_location();

  logslack(`--- Current location of phone is: ${phone_location.lat}, ${phone_location.lon} as of ${phone_location.tst} (timestamp)`);

  var hashtag = "sunnyxmas";

  logslack("--- Connecting to Slack and Database worked.")
  logslack(`Now running Instapuppet scraper with #${hashtag}. This might take up to 5 minutes.`);

  try { 
    var posts = await Instapuppet.get_posts_with_locations_by_hashtag(hashtag)
  } catch(err) {
    logslack("<!channel> *Something went wrong!* "  + err.stack);
  }

  logslack("--- Scraper finished! Now checking posts against current location.")

  for (let post of posts) {
    var dist = Helpers.calcDistMi(phone_location.lat, phone_location.lon, post.lat, post.lon)
    log(`Distance from post = ${dist} miles`);
  }


  database.close();

})();
