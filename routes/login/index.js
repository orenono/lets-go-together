var router = require('express').Router();
var passport = require('passport');

router.get('/confirm', function (req, res) {
    res.send(req.user)
});

module.exports = router;
