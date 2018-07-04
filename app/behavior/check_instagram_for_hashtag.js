
module.exports = function(config, abilities) { 

  abilities.instagram.get_geoposts_by_hashtag("abolishice", function(posts) {
    console.log(posts);
  });
  //abilities.slack.send_message("test", function(error, res, body) {
    //console.log(error, body, res.statusCode);
  //});

}

