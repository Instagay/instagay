
const Datastore = require('nedb-promises')

class nedb {

  constructor(config) {
    this.config = config;
    this.db = {};
    this.db.igposts = Datastore.create(config.nedb.igposts.path)
    this.db.igposts.ensureIndex({ fieldName: 'id', unique: true  })
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

