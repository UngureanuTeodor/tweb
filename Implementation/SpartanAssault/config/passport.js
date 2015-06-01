var LocalStrategy   = require('passport-local').Strategy;

//var db = require('./database.js').database;
//var User = require('../app/models/user.js')(db);

module.exports = function(passport) {
	
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
		done(null, user);
    });

    passport.use('local-register', new LocalStrategy({
        usernameField : 'user_register',
        passwordField : 'pass_register',
        passReqToCallback : true 
    },
    function(req, user_register, pass_register, done) {
		if(req.body.license == undefined) {
			return done(null, false, req.flash('messageLicense', 'You have to accept Terms and Conditions.'));
		}
		if(user_register.length < 5 || user_register.length > 15) {
			return done(null, false, req.flash('messageUser', 'The username needs to have between 5-15 characters.'));
		}
		if(!user_register.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)) {
			return done(null, false, req.flash('messageUser', 'The username needs to contain only alphanumeric characters.'));
		}
		
		var User = req.models.user;

        process.nextTick(function() {

			User.find({ username :  user_register }, function(err, user) {
				
				if (err) {
					return done(err);
				}
				
				if (user.length > 0) {
					return done(null, false, req.flash('messageEmail', 'The username is already taken.'));
				}
			});    
			
			if(pass_register.length < 8 || pass_register.length > 20) {
				return done(null, false, req.flash('messagePass', 'The password needs to have between 8-20 characters.'));
			}
			
			if(!req.body.email_register.match(/^([0-9]|[a-z])+([0-9a-z]+)@([0-9]|[a-z])+([0-9a-z]+).([a-z])+$/i)) {
				return done(null, false, req.flash('messageEmail', 'The email is invalid.'));
			}
			
			User.find({ email :  req.body.email_register }, function(err, user) {
				
				if (err) {
					return done(err);
				}
				
				if (user.length > 0) {
					return done(null, false, req.flash('messageEmail', 'The email has already been used.'));
				}
			});
			
			var newUser = new User();

			// set the user's local credentials
			newUser.username    = user_register;
			newUser.password = newUser.generateHash(pass_register);
			newUser.email = req.body.email_register;
			newUser.gender = "";
			newUser.origin = "";

			// save the user
			newUser.save(function(err) {
				if (err) {
					throw err;
					console.log('Save error : '+err)
				}
				return done(null, newUser);
			});
        });

    }));

};