/*
Now, we need to create a RESTful API for ticketmaster events. 
We’re going to expose our events at an endpoint like 
/api/events.
*/

var express = require('express');
var router = express.Router();

var db = require('monk')('localhost:27017/duet');

var ticketmaster = require('../../lib/ticketmaster');

router.get('/', function(req, res) {
    var onComplete = function(err, events) {
        if (err) {
            throw err;
        }

        res.json(events);
    };

    // This is a search with specific event IDs
    if (req.query && req.query.eventIds) {
        ticketmaster.getEventsByIds(req.query.eventIds, onComplete);
    } 

    // This is an events search
    else {
        ticketmaster.getEvents(onComplete);
    }
});



router.get('/:id', function(req, res) {
    ticketmaster.getEventsByIds([req.params.id], function(err, events) {
        if (err) {
            throw err;
        }

        if (!events || !events.length || !events[0]) {
            throw new Error('Unexpected result');
        }

        res.json(events[0]);
    });
});

module.exports = router;