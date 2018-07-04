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

  get_geoposts_by_hashtag(hashtag, cb) {

    var posts = [];

    ig.deepScrapeTagPage(hashtag).then(function(result){
      for(let thispost of result.media) {
        if(thispost.location && thispost.location.id) {
          var simplepost = {};
          simplepost.id = thispost.id
          simplepost.display_url = thispost.display_url
          simplepost.location = {};
          simplepost.location.id = thispost.location.id
          simplepost.location.name = thispost.location.name
          simplepost.location.lat = thispost.location.lat
          simplepost.location.lng = thispost.location.lng
          simplepost.shortcode = thispost.shortcode
          simplepost.url = "https://www.instagram.com/p/" + thispost.shortcode;
          simplepost.username = thispost.owner.username
          posts.push(simplepost);
        }
      }
      cb(posts);
    })

  }



}

module.exports = instagram;

