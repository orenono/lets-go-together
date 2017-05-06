/*
Now, we need to create a RESTful API for ticketmaster events. 
We’re going to expose our events at an endpoint like 
/api/events.
*/

var express = require('express');
var router = express.Router();

var db = require('monk')('localhost:27017/duet');

var ticketmaster = require('../lib/ticketmaster');

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

/*
First, note the use of router.post method. In the last section, 
we used router.get method for handling an HTTP GET request. 
Here, we use HTTP POST, which is the REST convention for creating 
new objects.
In the route handler, first we get a reference to the events 
collection and then use the insert method to add a new document to Mongo.
The first argument to this method is a JSON object with two properties: 
title and description. We read the values for these properties using 
req.body. This object represents the data that will be posted in the 
body of the request.
Finally, in the callback method for inserting a document, if we don’t get 
any errors, we use the json method of the response (res) to return a JSON 
representation of the new video document.
*/


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


// THIS CODE NEEDS TO BE REMOVED!! ONLY KEEP IT HERE FOR FUTURE REFERENCE!!
router.delete('/:id', function(req, res){
    var collection = db.get('events');
    collection.remove({ _id: req.params.id }, function(err, event){
        if (err) throw err;

        res.json(event);
    });
});

module.exports = router;