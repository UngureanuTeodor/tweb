var LocalStrategy   = require('passport-local').Strategy;

var User = require('../app/models/user');

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
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
       
		console.log('User : '+user_register);
		console.log('Pass : '+pass_register);
		console.log('Email : '+req.body.email_register);
		console.log('Checkbox : '+req.body.license);
		
		if(user_register.length > 25) {
			return done(null, false, req.flash('message', 'The username is too large.'));
		}
        });
    }));
};