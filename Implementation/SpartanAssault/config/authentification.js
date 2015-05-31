var LocalStrategy   = require('passport-local').Strategy;

var User = require('../app/models/user');
var command = require('../app/models/query.js');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        
        usernameField : 'user_register',
        passwordField : 'pass_register',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, user_register, pass_register, done) {

        // asynchronous
        process.nextTick(function() {

			var hashedPass = User.hash(pass_register);
			//console.log('User : '+user_register);
			//console.log('Pass : '+hashedPass);
			//console.log('Email : '+req.body.email_register);
			//console.log('Checkbox : '+req.body.license);
			
			if(user_register.length > 25) {
				return done(null, false, req.flash('messageUser', 'The username is too large.'));
			}
			if(pass_register.length < 5) {
				return done(null, false, req.flash('messagePass', 'The password is too weak.'))
			}
			
			var newCommand = new command('SELECT * FROM users');
			console.log('sent command');
			var result = newCommand.query;
			if(result === 'Error') {
				console.log('Error');
			}
			else {
				console.log('result: '+result);
				for(var i in result) {
					console.log('Result : ' + result[i].username);
				}
			}
        });
    }));
};