
module.exports = function(config, abilities) { 


  function return_post_if_new(post) {
    return new Promise(function(resolve, reject) {
        if(Object.keys(post).length == 0) { resolve({}); } //if post is empty, return empty
        abilities.database.db.igposts.find({ id: post.id }).then(function(docs) {
          if(docs.length == 0) {
            //abilities.database.db.igposts.insert(post)
              //.then(function(err) {
                //console.log(err);
              //});
            resolve(post); 
          } else { 
            resolve({});
          }
        }, function(reason) { reject(reason) });
    });
  }


  function save_post_to_db(post) {
    return new Promise(function(resolve, reject) {
        if(Object.keys(post).length == 0) { resolve({}); } //if post is empty, return empty
        abilities.database.db.igposts.insert(post)
          .then(function(res) {
            resolve(res);
          }, function(reason) { reject(reason) });
    });
  }


  function return_post_if_nearby(post) {
    return new Promise(function(resolve, reject) {
      if(Object.keys(post).length == 0) { resolve({}); } //if post is empty, return empty

 //     console.log(post.location);

      //console.log(nyclat, nyclon, post.location.lat, post.location.lng);
//      console.log(abilities.phonetracker.calcDistMi(nyclat, nyclon, post.location.lat, post.location.lng));

      if(abilities.phonetracker.calcDistMi(config.phonetracker.lat, config.phonetracker.lng, post.location.lat, post.location.lng) < config.phonetracker.milesRadius) {
        resolve(post);
      } else {
        resolve({});
      }
    });
  }


  function filter_posts(posts, func) {
    return new Promise(function(resolve, reject) {
      Promise.all(posts.map(func))
        .then(function(result) {
          var filtered_posts = result.filter(fp => Object.keys(fp).length != 0)
          resolve(filtered_posts);
        });
    });
  }



  var hashtags = ["abolishice", "resistice"]

  abilities.instagram.get_geoposts_by_hashtag("abolishice")

    .then(posts => filter_posts(posts, return_post_if_nearby))

    .then(posts => filter_posts(posts, return_post_if_new))
  
    .then(posts => posts.map(function(post) {

      console.log("========THIS POST IS NEW AND NEARBY");
      console.log(post);
      save_post_to_db(post);

      var midist = abilities.phonetracker.calcDistMi(config.phonetracker.lat, config.phonetracker.lng, post.location.lat, post.location.lng);

      var message = "NEW NEARBY POST " + midist + " mi away: " + post.url;
      abilities.slack.send_message(message, function(error, res, body) {
        console.log(error, body, res.statusCode);
      });


    }));
  //abilities.instagram.get_geoposts_by_hashtag(hashtags, function(posts) {
    //console.log(posts);
  //});
  //abilities.slack.send_message("test", function(error, res, body) {
    //console.log(error, body, res.statusCode);
  //});

}

