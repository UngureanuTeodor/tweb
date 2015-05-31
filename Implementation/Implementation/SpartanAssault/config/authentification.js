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

    passport.use('local-signup', new LocalStrategy(//{
    /*    // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },*/
    function(req, done) {
        // asynchronous
       // process.nextTick(function() {
		console.log('here I am');
		var username = req.body.user_register;
		console.log(username);
		if(username.length > 25) {
			return done(null, false, req.flash('message', 'The username is too large.'));
		}
		var pass = User.hash(req.body.pass_register);
		var email = req.body.email_register;
		var license = req.body.license;
		/*console.log('User '+ username);
		console.log(' Password '+ pass);
		console.log('Email '+ email);
		console.log('Checkbox ' + license);*/
		
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        /*User.checkEmail({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if there's already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        }); */   

        //});

    }));

};