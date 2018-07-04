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
  
  calcDistMi(lat1, lon1, lat2, lon2)  {
    var self = this;
    return self.calcDist(lat1, lon1, lat2, lon2) * 0.621371;
  }

  calcDist(lat1, lon1, lat2, lon2)  {
    // Converts numeric degrees to radians
    function toRad(Value) {
        return Value * Math.PI / 180;
    }
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }




}

module.exports = phonetracker;

