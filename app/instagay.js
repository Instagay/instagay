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

  var hashtag = "timessquare";

  logslack("--- Connecting to Slack and Database worked.")
  logslack(`Now running Instapuppet scraper with #${hashtag}. This might take up to 5 minutes.`);

  try { 
    var posts = await Instapuppet.get_posts_with_locations_by_hashtag(hashtag)
  } catch(err) {
    logslack("<!channel> *Something went wrong!* "  + err.stack);
  }

  logslack("--- Scraper finished! Now checking posts against current location.")

  console.log(posts);

  for (let post of posts) {


    var dist = Helpers.calcDistMi(phone_location.lat, phone_location.lon, post.lat, post.lon)
    if(dist <= config.phonetracker.milesRadius) {

      // post is nearby ..
      log(`${post.sc}... ${dist} mi away. Oh!! We have a post nearby within ${config.phonetracker.milesRadius} miles. Is it new?...`);
      if(await database.have_we_already_found_this_valid_post_before(post) == true) {

        // IT'S A NEW POST
        logslack(`   --- YES!! We have found a new post ${dist} mi away! By @${post.username} at ${post.url}!! <!channel>`);
//        await database.mark_post_as_found(post);
      } else {

        // It's an old post.
        log(`   --- Ah, we've seen this before.`);
      }
    } else {
      // post is not nearby.
      log(`${post.sc}... ${dist} mi away. Too far.`);
    }
  }


  database.close();

})();
