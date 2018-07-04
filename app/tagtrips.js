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


console.log("+++++++++++ BEHAVIORS");

console.log("+adding+ webroutes");
new (require('./behavior/webroutes'))(config, abilities);

console.log("+adding+ check_instagram_for_hashtag");
new (require('./behavior/check_instagram_for_hashtag'))(config, abilities);

console.log("= RUNNING!");


