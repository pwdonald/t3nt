var Datastore = require('nedb'),
    bcrypt = require('bcrypt');

var User = new Datastore({
    filename: 'data/users',
    autoload: true
});

exports.FindById = function(id, callback) {
    User.findOne({
        _id: id
    }, function(err, user) {
        if (err) {
            callback(err);
        }

        callback(null, user);
    });
};

exports.IsUsernameAvailable = function(req, res, next) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            return next(err);
        }

        if (user) {
            // not available
            return next(new Error('Username already exists'));
        }

        next();
    });
};

exports.HashPassword = function(req, res, next) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hashedPassword) {
            req.body.hashedPassword = hashedPassword;
            next();
        });
    });
};

exports.CheckPassword = function(username, password, callback) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return callback(err);
        }

        if (!user) {
            return callback();
        }

        bcrypt.compare(password, user.password, function(err, res) {
            if (err) {
                return callback(err);
            }

            // if (!res) {
            //     return callback(new Error('Password incorrect!'));
            // }

            if (!res) {
                return callback(new Error('Incorrect password.'), user);
            }

            return callback(null, user);
        })
    });
};

exports.CreateNewUser = function(req, res, next) {
    User.insert({
        username: req.body.username,
        password: req.body.hashedPassword,
        timestamp: new Date()
    }, function(err, user) {
        if (err) {
            next(err);
        }

        req.body.username = user.username;

        next();
    });
};