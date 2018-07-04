
var Datastore = require('nedb')

module.exports = function(config) {

  db = {};
  db.igposts = new Datastore({ filename: config.nedb.igposts.path, autoload: true });

  return db;

}

