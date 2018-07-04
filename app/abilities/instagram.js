var request = require("request");
var ig = require('instagram-tagscrape');


class instagram {


  constructor(config) {
    this.config = config;
    this.apiurl = "";
  }

  get_posts_by_weather_slow(cb) {
    request(this.apiurl, (err, resp, body) => {
      cb(JSON.parse(body)[0]);
    });
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

  get_geoposts_by_hashtag(hashtag, cb) {
    var self = this;

    var posts = [];

    ig.deepScrapeTagPage(hashtag).then(function(result){
      for(let thispost of result.media) {
        if(thispost.location && thispost.location.id) {
          posts.push(self._post_to_simplepost(thispost));
        }
      }
      cb(posts);
    })

  }


  get_geoposts_by_hashtags (hashtags, cb) {
    var self = this;

    Promise.all(hashtags.map(ig.deepScrapeTagPage)).then(function(results) {
      var posts = [];
      for(let result of results) {
        for(let thispost of result.media) {
          if(thispost.location && thispost.location.id) {
            posts.push(self._post_to_simplepost(thispost));
          }
        }
      }
      cb(posts);
    })

  }



}

module.exports = instagram;

