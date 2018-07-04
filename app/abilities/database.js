
const Datastore = require('nedb-promises')

class database {

  constructor(config) {
    this.config = config;
    this.db = {};
    this.db.igposts = Datastore.create(config.database.igposts.path)
    this.db.igposts.ensureIndex({ fieldName: 'id', unique: true  })
  }

}

moduke.exports = database ;

