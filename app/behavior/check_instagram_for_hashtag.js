
module.exports = function(config, abilities) { 

  function return_post_if_new_and_insert_in_db(post) {
    return new Promise(function(resolve, reject) {
        abilities.nedb.db.igposts.find({ id: post.id }).then(function(docs) {
          if(docs.length == 0) {
            abilities.nedb.db.igposts.insert(post)
              .then(function(err) {
                console.log(err);
              });
            resolve(post); 
          } else { 
            resolve({});
          }
        }, function(reason) { reject(reason) });
    });
  }



  function filter_for_new_posts(posts) {
    return new Promise(function(resolve, reject) {

      Promise.all(posts.map(return_post_if_new_and_insert_in_db))
        .then(function(filtered_posts) {
          console.log(filtered_posts);
        });

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

