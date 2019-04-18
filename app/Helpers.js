const config = require('./config/config');
var request=require('request');

var Helpers = {};

Helpers.log  = (indentlevel, msg) => {
	process.stdout.write("    ".repeat(indentlevel) + msg);
}

Helpers.SigFig = function(x, n) {
	return Math.round(x * 10 ** n) / 10 ** n;
}


Helpers.calcDistMi = (lat1, lon1, lat2, lon2) => {
	return Helpers.SigFig(Helpers.calcDist(lat1, lon1, lat2, lon2) * 0.621371, 2);
}

Helpers.calcDist = (lat1, lon1, lat2, lon2) => {
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


Helpers.get_primary_tags_from_spreadsheet = () => {
  return new Promise((resolve, reject) => {
    request
     .get((config.primary_tags_spreadsheet_url), function (error, response, body) {
          if(response.statusCode == 200) {
            var res = body.split(/\r?\n/);
            resolve(res.slice(1)); // ignore header
          } else {
            reject();
          }
    });
  });
}

Helpers.get_location_tags_from_spreadsheet = () => {
  return new Promise((resolve, reject) => {
    request
     .get((config.location_tags_spreadsheet_url), function (error, response, body) {
          if(response.statusCode == 200) {
            var res = body.split(/\r?\n/);
            resolve(res.slice(1)); // ignore header
          } else {
            reject();
          }
    });
  });
}


Helpers.get_radius_from_spreadsheet = () => {
  return new Promise((resolve, reject) => {
    request
     .get((config.radius_spreadsheet_url), function (error, response, body) {
          if(response.statusCode == 200) {
            var res = body.split(/\r?\n/);
            resolve(parseFloat(res[1])); 
          } else {
            reject();
          }
    });
  });
}

module.exports = Helpers;

