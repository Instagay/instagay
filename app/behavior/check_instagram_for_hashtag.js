var _ = require("lodash");

module.exports = function(config, abilities) { 

  function is_post_nearby (post) {
      if(Object.keys(post).length == 0) { return false } //if post is empty, return empty

      var dfp = abilities.phonetracker.getDistanceFromPhone(post.location.lat, post.location.lng)
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
    var dfp = abilities.phonetracker.getDistanceFromPhone(post.location.lat, post.location.lng)
		var message = `NEW NEARBY POST ${dfp} mi away: ${post.url}`
		abilities.slack.send_message(message, function(error, res, body) {
	//		console.log(error, body, res.statusCode);
		});
	}




  function scrapeTagAndProcess(hashtag) {

    abilities.instagram.deepScrapeOnlyTagsWithLocations(hashtag, function(post) {

      if(is_post_nearby(post)) {


        if_post_not_in_db(post, function(newpost) {

          var simplepost = abilities.instagram._post_to_simplepost(newpost);

          // WE FOUND ONE !!!
          save_post_to_db(simplepost, function(newdoc) {
            console.log(">> POST: nearby     , FOUND A NEW ONE ");
            send_success_message(simplepost);
          });

        }, function(newpost) {
        console.log(">> POST: nearby     , found an old one");
        });

      } else {
        console.log(">> POST: not nearby , ");
      }

    });
  }



  class hashtagqueue {
    constructor(hashtags) {
      this.hashtags = _.shuffle(hashtags)
      // the shuffle is done so that, if the program crashes regularly for some reason, all of the hashtags have an even chance at being checked for the first time
      this.hashtagrecords = [] 
      var self = this;
      for (let h of hashtags) {
        self.hashtagrecords.push({"tag": h, "lastupdated": new Date().getTime() })
      }
    }
    get_oldest_hashtag() {
      // put records in order
      this.hashtagrecords = _.sortBy(this.hashtagrecords, 'lastupdated')
      this.hashtagrecords[0]['lastupdated'] = new Date().getTime()
      return this.hashtagrecords[0]['tag']
    }
  }


  thishashtagqueue = new hashtagqueue(["abolishice", "resistice"])


  var interval = setInterval(function() {

    oldest_tag = thishashtagqueue.get_oldest_hashtag()

    console.log("####### CHECKING #" + oldest_tag);

    // scrape the oldest tag
    scrapeTagAndProcess(oldest_tag)

  }, config.instagram.checking_interval);




}

