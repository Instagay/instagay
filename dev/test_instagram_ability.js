var config = require('./config/config');

console.log("+++++++++++ ABILITIES");
var abilities = {};

console.log("+adding+ slack");
abilities.slack = new (require('./abilities/slack'))(config);

console.log("+adding+ webserver");
abilities.webserver = new (require('./abilities/webserver'))(config);

console.log("+adding+ phonetracker");
abilities.phonetracker = new (require('./abilities/phonetracker'))(config);

console.log("+adding+ instagram");
abilities.instagram = new (require('./abilities/instagram'))(config);

console.log("+adding+ database");
abilities.database = new (require('./abilities/database'))(config);



function add_behaviors() {

  console.log("+++++++++++ BEHAVIORS");

  console.log("+adding+ check_instagram_for_hashtag");
  new (require('./behavior/check_instagram_for_hashtag'))(config, abilities);

}

// this is messy.. TODO wrap all inits into single function
abilities.database.init().then(() => {
  add_behaviors()
})

console.log("= RUNNING!");

var ig = require('instagram-tagscrape');


ig.scrapeTagPage('bernie').then(function(result){
      console.dir(result);
})
