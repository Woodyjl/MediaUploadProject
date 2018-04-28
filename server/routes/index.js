var express = require('express');
var router = express.Router();

router.use('/*', function(req, res, next) {
    // Maybe add middleware to check for requirements before reaching routes. ie Authentication
    next();
});

router.use('/mediaUpload', require('./media/media.js'));

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
    res.status(404).end();
});

module.exports = router;
