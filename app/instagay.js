const config = require('./config/config');
const log = require('./Helpers').log;
const Slack = require('./Slack');
const Database = require('./Database');
const Instapuppet = require('./Instapuppet');


(async () => {

    console.log("+++++++++++ ABILITIES");
    var abilities = {};

    console.log("+adding+ Slack");
    var slack = new Slack(config);

    /*
    console.log("+adding+ Database");
    var database = new Database(config);

    await database.init(); */

    console.log("= RUNNING!");

    //slack.send_message("INSTAGAY is up and running");

	var posts = await Instapuppet.get_posts_with_locations_by_hashtag("sunnyxmas")

	console.log(posts);

})();
