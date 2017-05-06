'use strict';

var superagent = require('superagent');

function buildEventIdsRequestUrl(options) {
	options = options || {};

	var retVal = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=GHf5BYKmFsLDLdjwqjA4mOi4A36jWGwu';

	if (options.eventIds && Array.isArray(options.eventIds)) {
		retVal += '&id=' + options.eventIds.join(',');
	}

	return retVal;
}

function buildSearchRequestUrl(options) {
	options = options || {};

	var retVal = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=GHf5BYKmFsLDLdjwqjA4mOi4A36jWGwu';

	retVal += '&size=' + (options.size || 20);
	retVal += '&latlong=' + (options.latlong || '40.6751542,-73.97601019999999');
	retVal += '&radius=' + (options.radius || '20');
	retVal += '&unit=' + (options.unit || 'miles');

	return retVal;
}

function transformTicketmasterResponseToEventsArray(response) {
	var retVal;

	retVal = JSON.parse(response.text)._embedded.events;

	// retVal is now an array of objects!
	// Let's use the Array.protoype.map() function to transform all the event objects
	// Into smaller objects with only the fields we want: _id, nameOfEvent, placeOfEvent
	// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
	retVal = retVal.map(function(tmEventObj) {
		return {
			_id: tmEventObj.id,
			nameOfEvent: tmEventObj.name,
			placeOfEvent: tmEventObj._embedded.venues[0].name,
			dateOfEvent: tmEventObj.dates.start.dateTime,
			url: tmEventObj.url,
			imgUrl: tmEventObj.images[0].url
		};
	});

	return retVal;
}

function getEvents(callback) {
	superagent
		.get(buildSearchRequestUrl({
			size: 20,
			latlong: '40.6751542,-73.97601019999999',
			radius: 20,
			unit: 'km'
		}))
		.end(function(err, response) {
			if (err) {
				callback(err);
				return;
			}

			callback(null, transformTicketmasterResponseToEventsArray(response));
		});
}

function getEventsByIds(eventIds, callback) {
	superagent
		.get(buildEventIdsRequestUrl({
			eventIds: eventIds
		}))
		.end(function(err, response) {
			if (err) {
				callback(err);
				return;
			}

			callback(null, transformTicketmasterResponseToEventsArray(response));
		});
}

module.exports = {
	getEvents: getEvents,
	getEventsByIds: getEventsByIds
};
