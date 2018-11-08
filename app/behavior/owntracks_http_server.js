module.exports = function(config, abilities) { 

  var webserver = abilities.webserver;

  /* this is actually unnecessary
  webserver.get('/owntracks/last', function (req, res) {
    abilities.database.db.owntracks.find({}).sort(['tst', 'desc']).limit(1).toArray().then(function(d) {
      res.send(d);
    });
  })
  */

  webserver.post('/owntracks/publish', function (req, res) {
    if("_type" in req.body && req.body._type == "location") {
      var location = {}
      location.acc = req.body.acc;
      location.alt = req.body.alt;
      location.lat = req.body.lat;
      location.lon = req.body.lon;
      location.tid = req.body.tid;
      location.tst = req.body.tst;

      abilities.database.db.owntracks.insertOne(location)

      res.sendStatus(200)
    }
  })

}
