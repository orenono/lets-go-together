/*
With the first line, we import Express into this module. 
When using the require method, depending on how the target 
module is implemented, the require method may return an object 
or a method. In this case, the express variable is an object. 
It exposes a method called Router, which we call on the second line, 
to get access to the router object in Express. 
We use a router to define endpoints for our application. 
These are the endpoints where we receive requests. 
Each endpoint will be associated with a route handler, 
which is responsible for handling a request that is 
received in that endpoint.
*/
var express = require('express');
var router = express.Router();

/*
Here, we use the get method on the router to define a 
route and its handler. The first argument is the endpoint; 
in this case, ‘/’ represents the root of the site or the home page. 
The second argument is the route handler.
In Express, all route handlers have the same signature. 
The first parameter is the request object, the second is the response, 
and the third references the next handler in the chain. 
Express uses middleware functions that are chained together. 
When building middleware with Express, sometimes you may want to 
call the next middleware function in the chain. You can use the 
next variable for that. But when working with routes, we hardly 
ever need to do this, so you can safely delete the next variable here.
*/
/* GET home page. */
router.get('/', function(req, res) {
	//Here, we render the index view, which is defined in views > index.jade.
  res.render('index', { title: 'Let\'s go together' });
});

module.exports = router;
