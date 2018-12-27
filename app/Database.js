var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
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
      self.db.tagsearchlog = _db.collection('tagsearchlog')
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
    var data = await this.db.igposts.find({ sc: post.sc }).toArray();
    if(data.length == 0) {
      return false;
    } else {
      return true;
    }
  }
 


  async mark_post_as_found(post) {
			if(Object.keys(post).length == 0) { return "Post is empty" }
			await this.db.igposts.insertOne(post);
      return "Success";
  }


  async mark_tag_as_searched(hashtag) {
    var tst = Math.round(new Date() / 1000)
    var record = { "tag": hashtag, "tst": tst };
		await this.db.tagsearchlog.insertOne(record);
    return "Success";
  }


  async find_oldest_tag() {
    var self = this;

    var tags_and_dates = [];
    
    for (let tag of self.config.tags) {
      var lastsearch = await self.db.tagsearchlog
        .find({ "tag": tag})
        .sort(['tst', 'desc']).limit(1).toArray();
      if(lastsearch.length == 0) {
        tags_and_dates.push({ "tag": tag, "tst": -1 });
      } else {
        tags_and_dates.push({ "tag": tag, "tst": lastsearch[0].tst });
      }
    };

    tags_and_dates = _.chain(tags_and_dates)
      .shuffle()
      .sortBy("tst")
      .value();

    console.log(tags_and_dates);
    console.log(`#${tags_and_dates[0]['tag']} was last searched on ${tags_and_dates[0]['tst']}`);

    return tags_and_dates[0]['tag'];
  }


}

module.exports = Database;


