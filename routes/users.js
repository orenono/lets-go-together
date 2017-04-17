var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/duet');
/*
First we call the get method on the db object, passing the name 
of the collection (users). It returns a collection object. 
This collection object provides a number of methods to work 
with documents in that collection: insert, find, findOne, update
and remove.
Here, we use the find method to get all users in the 
collection. The first argument to this method is an object 
that determines the criteria for filtering. Since we want all 
users, we pass an empty object as the argument. The second 
argument is a callback method that is executed when the 
result is returned from the database. This method follows 
the “error-first” callback pattern, which is the standard p
rotocol for callback methods in Node. With this pattern, 
the first argument of a callback method should be an error 
object, and the second should be the result (if any). 
As you develop more applications with Node, 
you’re going to see more of this callback pattern.

Inside this callback, first we check if the err object is set. 
If there are no errors as part of getting the user documents, 
err will be null; otherwise it will be set. We throw the err 
here to stop the execution of the program and report an error 
to the user. If there are no errors, however, we simply 
return a JSON object by calling res.json method.
*/
router.get('/', function(req, res) {
    var collection = db.get('users');
    collection.find({}, function(err, users){
        if (err) throw err;
      	res.json(users);
    });
});
/*
With this line, we specify the object (or method) 
that is returned when we require this module in 
another module. In this case, we’re returning the 
router object in Express. So, the purpose of this 
module is to get the router, register a few routes on it, 
and then return it.
*/
module.exports = router;