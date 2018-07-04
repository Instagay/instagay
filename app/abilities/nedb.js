
var Datastore = require('nedb')

class nedb {

  constructor(config) {
    this.config = config;
    this.db = {};
    this.db.igposts = new Datastore({ filename: config.nedb.igposts.path, autoload: true });
    this.db.igposts.ensureIndex({ fieldName: 'id', unique: true  }, function (err) {
      if(err) { console.log(err); }
    });
  }

  findAsync(dbname, query) {
    var self = this;
    return new Promise( function(resolve, reject) {
      self.db['dbname'].find(query, function(err, docs) {
        if(err) { reject(err); }
        else { resolve(docs); }
      })
    });
  }

}

module.exports = nedb;

