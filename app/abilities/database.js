var assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

class database {

  constructor(config) {
    this.config = config;
    this.db = {};
  }

  init() {
    var self = this;
    return new Promise(function(resolve, reject) {
      MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);

        console.log("Connected successfully to server");
        var db = client.db('instagay')
        self.db.igposts = db.collection('igposts')
        self.db.owntracks = db.collection('owntracks')
        resolve();
      });
    });

  }

}

module.exports = database ;

