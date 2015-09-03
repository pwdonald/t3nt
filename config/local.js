var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('../models/UserModel');

module.exports = function() {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.CheckPassword(username, password, function(err, user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Username not found.'
                    });
                }

                if (err) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }

                return done(null, user, true);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.FindById(id, function(err, user) {
            done(err, user);
        });
    });
};