
const Datastore = require('nedb')

class database {

  constructor(config) {
    this.config = config;
    this.db = {};
    this.db.igposts = new Datastore(config.database.igposts.path)
		this.db.igposts.loadDatabase();

    this.db.igposts.ensureIndex({ fieldName: 'id', unique: true  })
  }

}

module.exports = database ;

