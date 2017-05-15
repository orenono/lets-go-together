
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	//Here, we render the index view, which is defined in views > index.jade.
  res.render('index', { title: 'Let\'s go together' });
});

module.exports = router;
