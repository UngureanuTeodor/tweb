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
					console.log('Save error : '+err);
				}
				return done(null, newUser);
			});
			
			var Character = req.models.character;
			var newChar = new Character();
			
			newChar.level = 1;
			newChar.xp = 0;
			newChar.hp = 100;
			newChar.strength = 1;
			newChar.agility = 1;
			newChar.stamina = 1;
			newChar.charisma = 1;
			newChar.gold = 0;
			
			newChar.save(function(err) {
				if(err) {
					throw err;
					console.log('Save error : '+err);
				}
				return done(null, newChar);
			});
			
			var Equip = req.models.equipment;
			var newEquipment = new Equip();
			
			newEquipment.helmetID = 3;
			newEquipment.chestID = 1;
			newEquipment.glovesID = 2;
			newEquipment.bootsID = 0;
			newEquipment.weaponID = 0;
			newEquipment.shieldID = 4;
			
			newEquipment.save(function(err) {
				if(err) {
					throw err;
					console.log('Save error : '+err);
				}
				return done(null, newEquipment);
			});
        });

    }));

	passport.use('local-login', new LocalStrategy({
        usernameField : 'user_login',
        passwordField : 'pass_login',
        passReqToCallback : true 
    },
	function(req, user_login, pass_login, done) {
		var User = req.models.user;
		
		User.find({ username :  user_login }, function(err, user) {
				
				if (err) {
					return done(err);
				}
				
				if (user.length == 0) {
					return done(null, false, req.flash('messageLoginUser', 'The username does not exist.'));
				}
				if(!user[0].checkPass(pass_login)) {
					return done(null, false, req.flash('messageLoginPass', 'The password does not match.'));
				}
				
				req.session.username = user[0].username;
				req.session.gender = user[0].gender;
				req.session.origin = user[0].origin;
				req.session.user_id = user[0].userID;

				return done(null, user);
			});
	}));
};