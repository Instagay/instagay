var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

class Database {

  constructor(config) {
    this.config = config;
    this.db = {};
    this.client = null;
  }

  async init() {
    var self = this;


    try {
      self.client = await MongoClient.connect(url, { useNewUrlParser: true });
      console.log("Connected successfully to server");
      var _db = self.client.db('instagay')
      self.db.igposts = _db.collection('igposts')
      self.db.owntracks = _db.collection('owntracks')
    } catch(err) {
      console.log(err.stack);
    }

  }


  async get_phone_location() {
    var data = await this.db.owntracks.find({}).sort(['tst', 'desc']).limit(1).toArray();
    return data[0];
  }

  close() {
    this.client.close();
  }


}

module.exports = Database;

