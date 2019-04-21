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
    var phonetracker_radius = await Helpers.get_radius_from_spreadsheet();
    console.log(phonetracker_radius);
    var locationhashtags = await Helpers.get_location_tags_from_spreadsheet();
    console.log(locationhashtags);

  log("================ ");
  var abilities = {};

  log("+++ adding Slack");
  slack = new Slack(config);

  log("=== INSTAGAY is starting...");

  log(`--- Finding all tags..and getting a random one...`)
  var allhashtags = await Helpers.get_primary_tags_from_spreadsheet();
  var hashtag = _.sample(allhashtags);
  console.log("hashtag : " + hashtag)


  log("--- Connecting to Slack and Database worked.")
  log(`Now running Instapuppet scraper with #${hashtag}. This might take up to 5 minutes.`);

  var posts = await Instapuppet.get_posts_with_locations_by_hashtag(hashtag)

	if(posts.length == 0) {
		logdevslack(` We couldn't get the Most recent posts from #${hashtag} for some reason. This might be because of Instagram's policy to temporary disable showing them: https://help.instagram.com/861508690592298 `); 
	}


  console.log(posts);
  console.log("==============");
  console.log("==============");

  log("--- Scraper finished! Now checking posts against current location.")


  var posts_too_far = []; 

  var found_valid_post = false;

  try {
    var phonetracker_radius = await Helpers.get_radius_from_spreadsheet();
  } catch(err) {
    logdevslack(err);
  }

  log(`--- Our radius for checking is ${phonetracker_radius}`);

  var locationhashtags = await Helpers.get_location_tags_from_spreadsheet();

  for (let post of posts) {
    console.log(post);
      var does_match_locationtag = post.hashtags.some((tag) => { return locationhashtags.includes(tag); })
      console.log("does match locationtag??? : " + does_match_locationtag);

      posts_too_far.push(post);

  }

  log(`--- Done. Marking tag #${hashtag} as searched! `);
 
  log(`== INSTAGAY just finished looking for #${hashtag} `);



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


/*
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
*/

run_for_one_hashtag();

