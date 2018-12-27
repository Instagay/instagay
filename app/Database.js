var assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

class Database {

    constructor(config) {
        this.config = config;
        this.db = {};
        this.client = null;
    }

    async init() {
        var self = this;

        self.client = new MongoClient(url, { useNewUrlParser: true });

        try {
            await MongoClient.connect()
            console.log("Connected successfully to server");
            var _db = self.client.db('instagay')
            self.db.igposts = _db.collection('igposts')
            self.db.owntracks = _db.collection('owntracks')
        } catch(err) {
            console.log(err.stack);
        }

    }

}

module.exports = Database;

