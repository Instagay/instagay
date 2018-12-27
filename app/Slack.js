const request = require('request');

class Slack {

  constructor(config) {
    this.config = config;
   // CONNECT SLACK
/*    var Botkit = require('botkit');

    this.controller = Botkit.slackbot();
    this.bot = this.controller.spawn({
        token: config.slack.api_token
    });

		var self = this;
		this.controller.on('rtm_close', function(bot, err) {
			if (err) {
					console.log('Failed to start RTM')
					return setTimeout(self.start_rtm, 60000);
			}
      self.start_rtm();
		});

    this.start_rtm();*/
  }

	start_rtm() {
		var self = this;
    this.bot.startRTM(function(err,bot,payload) {
			if (err) {
					console.log('Failed to start RTM')
					return setTimeout(self.start_rtm, 60000);
			}
			console.log("RTM started!");
		});
	}

  _sendmsg(url, text, cb) {
		var self = this;
    var payload = {
          "text": text,
          "username": self.config.slack.username,
          "icon_emoji": self.config.slack.icon_emoji
    };
    request.post({
        headers : { 'Content-type' : 'application/json' },
        url: url,
        form : {
          payload: JSON.stringify(payload)
        }
      }, cb);
  }

  send_dev_message(text, cb) {
    this._sendmsg(this.config.slack.dev_webhook_url, text, cb);
  }

  send_message(text, cb) {
    this._sendmsg(this.config.slack.webhook_url, text, cb);
  }


  closeRTM() {
    this.bot.closeRTM();
  }


}

module.exports = Slack;

