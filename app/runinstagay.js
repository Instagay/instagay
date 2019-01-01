const config = require('./config/config');
const Slack = require('./Slack');
const Helpers = require('./Helpers');
const Database = require('./Database');
const Instapuppet = require('./Instapuppet');
var _ = require('lodash');
var ps = require('ps-node');

var slack;

var log = (msg) => {
  console.log(msg);
}

var logslack = (msg) => {
  log(msg);
  slack.send_message(msg.toString());
}

var logdevslack = (msg) => {
  log(msg);
  slack.send_dev_message(msg.toString());
}


var run_for_one_hashtag =  async () => {

  log("================ ");
  var abilities = {};

  log("+++ adding Slack");
  slack = new Slack(config);

  log("=== INSTAGAY is starting...");

  log("+++ adding Database");
  var database = new Database(config);

  await database.init(); 
  var phone_location = await database.get_phone_location();

  log(`--- Current location of phone is: ${phone_location.lat}, ${phone_location.lon} as of ${phone_location.tst} (timestamp)`);

  var hashtag = "timessquare";

  log(`--- Finding oldest tag.....`)
  var hashtag = await database.find_oldest_tag();

  log("--- Connecting to Slack and Database worked.")
  log(`Now running Instapuppet scraper with #${hashtag}. This might take up to 5 minutes.`);

  try { 
    var posts = await Instapuppet.get_posts_with_locations_by_hashtag(hashtag)
  } catch(err) {
    logdevslack("*Something went wrong!* "  + err.stack);
    return;
  }

	if(posts.length == 0) {
		logdevslack(` We couldn't get the Most recent posts from #${hashtag} for some reason. This might be because of Instagram's policy to temporary disable showing them: https://help.instagram.com/861508690592298 `); 
	}


  console.log(posts);
  console.log("==============");
  console.log("==============");

  log("--- Scraper finished! Now checking posts against current location.")


  var posts_too_far = []; 

  var found_valid_post = false;


  for (let post of posts) {

    var dist = Helpers.calcDistMi(phone_location.lat, phone_location.lon, post.lat, post.lon)
    if(dist <= config.phonetracker.milesRadius) {

      // post is nearby ..
      log(`${post.sc}... ${dist} mi away. Is it new?...`);
      if(await database.have_we_already_found_this_valid_post_before(post) == false) {

        // only notify current location of phone if true
        if(found_valid_post == false) {
          logslack(`--- Current location of phone is: ${phone_location.lat}, ${phone_location.lon} as of ${phone_location.tst} (timestamp).`);
          log(`To see location: https://www.google.com/maps/place/${phone_location.lat},${phone_location.lon}`);
          found_valid_post = true;
        }

        // IT'S A NEW POST
        logslack(`   === *New post ${dist} mi away* by *@${post.username}* with *#${post.hashtag}*!
*Link*: <${post.url}> *Location*: ${post.locationname}, or <https://www.google.com/maps/place/${post.lat},${post.lon}|${post.lat}, ${post.lon}>`);
        await database.mark_post_as_found(post);
        log("   --- Just marked it as new so we won't see it again.");
      } else {

        // It's an old post.
        log(`   --- Ah, we've seen this before.`);
      }
    } else {
      // post is not nearby.
      log(`${post.sc}... ${dist} mi away. Too far.`);
      
      post.dist = dist;
      posts_too_far.push(post);

    }
  }

  var too_far_messages =  _.chain(posts_too_far)
    .sortBy("dist")
    .filter((p) => { return p.dist < config.phonetracker.milesRadius * 3; })
    .take(3)
    .map((p) => {  return `${p.url} (${p.dist} mi away)`;  })
    .join(", ")
    .value();

  console.log(too_far_messages);

  log(`--- Done. Marking tag #${hashtag} as searched! `);
  await database.mark_tag_as_searched(hashtag);
 
  log(`== INSTAGAY just finished looking for #${hashtag} `);


  database.close();

}












are_we_the_only_process_running = () => {
  return new Promise(resolve => {

    // A simple pid lookup
    ps.lookup({
      command: 'node',
      arguments: 'runinstagay.js',
    }, function(err, resultList ) {
      if (err) {
        throw new Error( err );
      }

      if(resultList.length <= 1) {
        resolve(true);
      } else {
        resolve(false);
      }

    });

  });
}



(async () => {
  try { 
    if(await are_we_the_only_process_running() == true) {
      run_for_one_hashtag();
    } else {
      console.log("Another instance is still running! Try again later.");
    }
  } catch(err) {
    logdevslack(err);
  }
})();


