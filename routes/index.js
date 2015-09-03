var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'T3nT',
        user: req.user && req.user.username || 'anon'
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login to T3nT',
        error: req.flash('error')
    });
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function() {
        req.logout();
        res.redirect('/');
    });
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'Register',
        error: req.flash('error')
    });
});

module.exports = router;