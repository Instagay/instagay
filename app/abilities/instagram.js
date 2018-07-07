var request = require("request");
var ig = require('instagram-tagscrape');


class instagram {


  constructor(config) {
    this.config = config;
    this.apiurl = "";
  }


  _post_to_simplepost(post) {
      var simplepost = {};
      simplepost.id = post.id
      simplepost.display_url = post.display_url
      simplepost.location = {};
      simplepost.location.id = post.location.id
      simplepost.location.name = post.location.name
      simplepost.location.lat = post.location.lat
      simplepost.location.lng = post.location.lng
      simplepost.shortcode = post.shortcode
      simplepost.url = "https://www.instagram.com/p/" + post.shortcode;
      simplepost.username = post.owner.username
      return simplepost;
   }



  get_geoposts_by_hashtag(hashtag) {
    var self = this;

    return new Promise( function(resolve, reject) {

      var posts = [];

      ig.deepScrapeTagPage(hashtag).then(function(result){
        for(let thispost of result.media) {
          if(thispost.location && thispost.location.id) {
            posts.push(self._post_to_simplepost(thispost));
          }
        }
        resolve(posts);
      }, function(reason) {
        reject(reason)
      });

    });

  }



  scrapeTagPage(hashtag, cb) {
    var postURL = `https://www.instagram.com/explore/tags/${hashtag}/?__a=1`
    request(postURL, function(err, response, body) {
      var data = JSON.parse(body);
      var posts = data.graphql.hashtag.edge_hashtag_to_media.edges.map(e => e.node)
			posts.forEach(cb)
    });
  }


  scrapePostPage(shortcode, cb) {
    var postURL = `https://www.instagram.com/p/${shortcode}/?__a=1`
    request(postURL, function(err, response, body) {
      var data = JSON.parse(body);
      var postinfo = data.graphql.shortcode_media;
			cb(postinfo)
    });
  }

  scrapeLocationPage(locationid, cb) {
    var postURL = `https://www.instagram.com/explore/locations/${locationid}/?__a=1`
    request(postURL, function(err, response, body) {
      var data = JSON.parse(body);
			if("status" in data && data.status === 'fail') {
				console.log(data.message);
				return;
			} else {
				var locationinfo = data.graphql.location;
				cb(locationinfo)
			}
		});
  }

	deepScrapeOnlyTagsWithLocations(hashtag, cb) {

		var self = this;	 	

		self.scrapeTagPage(hashtag, function(post) {
			self.scrapePostPage(post.shortcode, function(postdetail) {
				if("location" in postdetail && postdetail.location !== null) {
					self.scrapeLocationPage(postdetail.location.id, function(locationinfo) {
						var fullpost = Object.assign(post, postdetail);
						fullpost.location = locationinfo;
						cb(fullpost);
					});
				}
			});
		});

	}

	scrapePostAndLocations(shortcode, cb) {

		var self = this;	 	

    self.scrapePostPage(post.shortcode, function(postdetail) {
      if("location" in postdetail && postdetail.location !== null) {
        self.scrapeLocationPage(postdetail.location.id, function(locationinfo) {
          var fullpost = Object.assign(post, postdetail);
          fullpost.location = locationinfo;
          cb(fullpost);
        });
      }
    });

	}


}


module.exports = instagram;

