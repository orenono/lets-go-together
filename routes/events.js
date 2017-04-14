var express = require('express');
var router = express.Router();

var db = require('monk')('localhost:27017/duet');

router.get('/', function(req, res) {
	var collection = db.get('events');
	collection.find({}, function(err, events) {
		if (err) throw err;
		res.json(events);
	});
});

router.post('/', function(req, res) {
	var collection = db.get('events');
	collection.insert({
		nameOfEvent: req.body.nameOfEvent,
		placeOfEvent: req.body.placeOfEvent
	}, function(err, event) {
		if(err) throw err;

		res.json(event);
	});
});

router.get('/:id', function(req, res) {
    var collection = db.get('events');
    collection.findOne({ _id: req.params.id }, function(err, event){
        if (err) throw err;

      	res.json(event);
    });
});

router.put('/:id', function(req, res){
    var collection = db.get('events');
    collection.update({
        _id: req.params.id
    },
    {
        nameOfEvent: req.body.nameOfEvent,
        placeOfEvent: req.body.placeOfEvent
    }, function(err, event){
        if (err) throw err;

        res.json(event);
    });
});

router.delete('/:id', function(req, res){
    var collection = db.get('events');
    collection.remove({ _id: req.params.id }, function(err, event){
        if (err) throw err;

        res.json(event);
    });
});

module.exports = router;