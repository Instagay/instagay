
const Datastore = require('nedb-promises')

class nedb {

  constructor(config) {
    this.config = config;
    this.db = {};
    this.db.igposts = Datastore.create(config.nedb.igposts.path)
    this.db.igposts.ensureIndex({ fieldName: 'id', unique: true  })
  }



module.exports = nedb;

