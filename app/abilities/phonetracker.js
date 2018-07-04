var request = require("request");

class phonetracker {


  constructor(config) {
    this.config = config;
    this.apiurl = "";
  }

  get_weather_slow(cb) {
    request(this.apiurl, (err, resp, body) => {
      cb(JSON.parse(body)[0]);
    });
  }


}

module.exports = phonetracker;

