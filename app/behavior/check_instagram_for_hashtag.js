
module.exports = function(config, abilities) { 

  var hashtags = ["abolishice", "resistice"]
  abilities.instagram.get_geoposts_by_hashtag("abolishice", function(posts) {
    console.log(posts);
  });
  //abilities.instagram.get_geoposts_by_hashtag(hashtags, function(posts) {
    //console.log(posts);
  //});
  //abilities.slack.send_message("test", function(error, res, body) {
    //console.log(error, body, res.statusCode);
  //});

}

