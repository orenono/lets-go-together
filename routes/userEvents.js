/*
Now, we need to create a RESTful API for our userEvents table. 
Our userEvents table consists of "userId" and "eventId" - it links users to the events they want to go to.
We’re going to expose our events at an endpoint like 
/api/userEvents.
*/

var express = require('express');
var router = express.Router();

var db = require('monk')('localhost:27017/duet');

router.get('/', function(req, res) {
	var collection = db.get('userEvents');
	collection.find(req.query, function(err, userEvents) {
		if(err) throw err;

		res.json(userEvents);
	});
});

router.post('/', function(req, res) {
	var collection = db.get('userEvents');
	collection.insert({
		userId: req.body.userId,
		eventId: req.body.eventId
	}, function(err, userEvent) {
		if(err) throw err;

		res.json(userEvent);
	});
});

router.delete('/:id', function(req, res) {
	var collection = db.get('userEvents');
    collection.remove({ _id: req.params.id }, function(err, userEvents) {
        if (err) throw err;

        res.json(userEvents);
    });
});

module.exports = router;
