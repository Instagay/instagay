
module.exports = function(config, abilities) { 


  function filter_for_new_posts(posts) {
    return new Promise(function(resolve, reject) {

      for (let p of posts) {
        abilities.nedb.db.igposts.find({ id: p.id })
          .then( function (docs) {
            console.log(docs);
          });
      }

      resolve("yay");
    });
  }




  var hashtags = ["abolishice", "resistice"]
  abilities.instagram.get_geoposts_by_hashtag("abolishice")
    .then(filter_for_new_posts)
    .then(function(posts) {
      console.log(posts);
    });
  //abilities.instagram.get_geoposts_by_hashtag(hashtags, function(posts) {
    //console.log(posts);
  //});
  //abilities.slack.send_message("test", function(error, res, body) {
    //console.log(error, body, res.statusCode);
  //});

}

