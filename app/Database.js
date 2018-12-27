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

  async have_we_already_found_this_valid_post_before(post) {
    if(Object.keys(post).length == 0) { return false; } //if post is empty, return empty
    var data = await this.db.igposts.find({ id: post.sc })
    if(data.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  
  async mark_post_as_found(post) {
			if(Object.keys(post).length == 0) { return "Post is empty" }
      var entry = {...post, ...{ id: post.sc } } //use shortcode as id 
			await this.db.igposts.insert(entry);
      return "Success";
  }


}

module.exports = Database;


