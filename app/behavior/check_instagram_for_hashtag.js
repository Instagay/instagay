
module.exports = function(config, abilities) { 


  function if_post_not_in_db(post, cb) {
			if(Object.keys(post).length == 0) { return; } //if post is empty, return empty

			abilities.database.db.igposts.find({ id: post.id }, function(err, docs) {
				if(docs.length == 0) {
					// post not in db!
					cb(post);
				} else { 
					return;
				}
			})
  }


  function save_post_to_db(post, cb) {
			if(Object.keys(post).length == 0) { resolve({}); } //if post is empty, return empty
			abilities.database.db.igposts.insert(post, function(err, newDoc) {
				cb(newDoc);
			});
  }

	function _getDistanceMi(post) {
     return abilities.phonetracker.calcDistMi(config.phonetracker.location.lat, config.phonetracker.location.lng, post.location.lat, post.location.lng).toPrecision(2);
	}


  function is_post_nearby (post) {
      if(Object.keys(post).length == 0) { return false } //if post is empty, return empty

      if(_getDistanceMi(post) < config.phonetracker.milesRadius) {
        return true;
      } else {
        return false;
      }
  }


	function send_success_message(post) {
		console.log("WE FOUND ONE");
		var message = `NEW NEARBY POST ${_getDistanceMi(post)} mi away: ${post.url}`
		abilities.slack.send_message(message, function(error, res, body) {
	//		console.log(error, body, res.statusCode);
		});
	}

  var hashtags = ["abolishice", "resistice"]

//  abilities.instagram.scrapeTagPage("abolishice")

  abilities.instagram.get_geoposts_by_hashtag("abolishice")
    .then(posts => {
      var nearby_posts = posts.filter(is_post_nearby)
      nearby_posts.forEach(function(np) {
  			if_post_not_in_db(np, function(post) {
					// WE FOUND ONE
					save_post_to_db(post, function(newdoc) {

						send_success_message(post);

					});
				});
			});
    })


  //abilities.instagram.get_geoposts_by_hashtag("abolishice")

    //.then(posts => filter_posts(posts, return_post_if_nearby))

    //.then(posts => filter_posts(posts, return_post_if_new))

    //.then(function(posts) {
      //console.log(posts);
    //});
  
    ////.then(posts => posts.map(function(post) {

      //console.log("========THIS POST IS NEW AND NEARBY");
      //console.log(post);
      //save_post_to_db(post);

      //var midist = abilities.phonetracker.calcDistMi(config.phonetracker.lat, config.phonetracker.lng, post.location.lat, post.location.lng);

      //var message = "NEW NEARBY POST " + midist + " mi away: " + post.url;
      //abilities.slack.send_message(message, function(error, res, body) {
        //console.log(error, body, res.statusCode);
      //});


    //}));
  //abilities.instagram.get_geoposts_by_hashtag(hashtags, function(posts) {
    //console.log(posts);
  //});
  //abilities.slack.send_message("test", function(error, res, body) {
    //console.log(error, body, res.statusCode);
  //});

}

