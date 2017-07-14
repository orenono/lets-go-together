var express = require('express');
var router = express.Router();

var db = require('monk')('localhost:27017/duet');

var ticketmaster = require('../../lib/ticketmaster');

router.get('/', function(req, res) {
    var onComplete = function(err, eventSearchResults) {
        if (err) {
            throw err;
        }

        res.json(eventSearchResults);
    };

    // This is a search with specific event IDs
    if (req.query && req.query.eventIds) {
        ticketmaster.getEventsByIds(req.query.eventIds, onComplete);
    } 

    // This is an events search
    else {
        ticketmaster.getSearchEventResults(onComplete);
    }
});



router.get('/:id', function(req, res) {
    ticketmaster.getEventsByIds([req.params.id], function(err, eventSearchResults) {
        if (err) {
            throw err;
        }

        if (!eventSearchResults || !eventSearchResults.length || !eventSearchResults[0]) {
            throw new Error('Unexpected result');
        }

        res.json(eventSearchResults[0]);
    });
});

module.exports = router;