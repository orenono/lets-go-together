var router = require('express').Router();
var passport = require('passport');

router.get('/', passport.authenticate('facebook'));
router.get('/return', passport.authenticate('facebook', { failureRedirect: '/#/login' }),
  	function(req, res) {
    	res.redirect('/');
  	});

module.exports = router;
