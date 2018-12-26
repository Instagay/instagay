var _ = require("lodash");

module.exports = function(config, abilities) { 

  function is_post_nearby (post) {
      if(Object.keys(post).length == 0) { return false } //if post is empty, return empty

      let dfp = abilities.phonetracker.getDistanceFromPhone(post.location.lat, post.location.lng)
      if(dfp < config.phonetracker.milesRadius) {
        return true;
      } else {
        return false;
      }
  }

  function if_post_not_in_db(post, truecb, falsecb) {
			if(Object.keys(post).length == 0) { return; } //if post is empty, return empty

			abilities.database.db.igposts.find({ id: post.id }, function(err, docs) {
				if(docs.length == 0) {
					// post not in db!
					truecb(post);
				} else { 
					falsecb(post);
				}
			})
  }


  function save_post_to_db(post, cb) {
			if(Object.keys(post).length == 0) { resolve({}); } //if post is empty, return empty
			abilities.database.db.igposts.insert(post, function(err, newDoc) {
				cb(newDoc);
			});
  }

	function send_success_message(post) {
		console.log("WE FOUND ONE");
    let dfp = abilities.phonetracker.getDistanceFromPhone(post.location.lat, post.location.lng)
		let message = `NEW NEARBY POST ${dfp} mi away: ${post.url}`
		abilities.slack.send_message(message, function(error, res, body) {
	//		console.log(error, body, res.statusCode);
		});
	}




  function scrapeTagAndProcess(hashtag) {

    abilities.instagram.deepScrapeOnlyTagsWithLocations(hashtag, function(post) {

      if(is_post_nearby(post)) {
        // well, the post is nearby.. and..

        if_post_not_in_db(post, function(newpost) {
          // WE FOUND ONE !!!

          let simplepost = abilities.instagram._post_to_simplepost(newpost);

          save_post_to_db(simplepost, function(newdoc) {
            console.log(">> POST: nearby     , FOUND A NEW ONE ");
            send_success_message(simplepost);
          });

        }, function(newpost) {
          // ehh, it already existed
          console.log(">> POST: nearby     , found an old one");
          console.log(Object.keys(newpost))
        });

      } else {
        console.log(">> POST: not nearby , ");
      }

    });
  }



  class HashtagQueue {
    constructor(hashtags) {
      this.hashtags = _.shuffle(hashtags)
      console.log(this.hashtags);
      // the shuffle is done so that, if the program crashes regularly for some reason, all of the hashtags have an even chance at being checked for the first time
      this.hashtagrecords = [] 
      let self = this;
      // sort and give them an order
      for (let h of hashtags) {
        self.hashtagrecords.push({"tag": h })
      }
    }
    get_oldest_hashtag() {
      let self = this;
      // put records in order
      let most_recent_tag = this.hashtagrecords[0];

      // shift it around!
      self.hashtagrecords.push(self.hashtagrecords.shift());

      return most_recent_tag;
    }
  }

  function get_phone_location(cb) {
    abilities.database.db.owntracks.find({}).sort(['tst', 'desc']).limit(1).toArray().then(function(d) {
      cb(d[0]);
    });
  }

  function update_phone_location(cb) {
    get_phone_location(function(d) {
      console.log("updating our phone location to " + d.lat + ", " + d.lon);
      abilities.phonetracker.set_location(d.lat, d.lon);
      if ( typeof cb !== 'undefined' && cb) {
        cb();
      }
    });
  }


  var tags = ["instagay", "gay", "gayboy", "gaypride", "queer", "gayguy", "gayman", "gaylife", "bisexual ", "gaylove", "scruffy", "transgender", "gayrab", "LGBT", "LGBTQ", "LGBTQI", "LGBTQIA", "lesbian", "gay", "bi", "pan", "pansexual", "trans", "transman", "FTM", "bornthisway", "bornperfect", "loveislove", "lovewins", "transwoman", "MTF", "Pride", "PrideMonth", "gayrights", "transrights", "lgbtyouth", "queeryouth", "itgetsbetter", "gaygirl", "tomboy", "genderfluid", "homosexual ", "gayisok", "girlswhokissgirls", "girlswholikegirls ", "samelove", "gaygirls", "dyke", "TransIsBeautiful", "TransIsHandsome", "TransIsWonderful", "ProudTransman", "proudtranswoman"]



  function run_behavior() {

    thisHQ = new HashtagQueue(tags)

    let loop = function() {

      
      oldest_tag = thisHQ.get_oldest_hashtag()

      console.log(`\n####### CHECKING the oldest tag:  ${oldest_tag}`);

      // scrape the oldest tag
      scrapeTagAndProcess(oldest_tag)

      update_phone_location();
    }
     
    loop();
    var interval = setInterval(loop, config.instagram.checking_interval);

  }


  update_phone_location(function() {
    run_behavior();
  });



}

