var LocalStrategy   = require('passport-local').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

var configAuth = require('../app/auth');
var randomstring = require("randomstring");

module.exports = function(passport, app) {
	
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
		done(null, user);
    });

	passport.use('twitter', new TwitterStrategy({
		consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
	},
	function(token, tokenSecret, profile, done) {
		var db = require('../config/database')(app);
		var User = app.user;
		
		process.nextTick(function() {
			User.findOne({'twitterID' : profile.id }, function(err, user) {
				if (err) {
                    return done(err);
				}
				
				if (user) {
					req.session.username = user[0].username;
					req.session.gender = user[0].gender;
					req.session.origin = user[0].origin;
					req.session.user_id = user[0].userID;
					
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.twitterID = profile.id;
                    newUser.username = profile.username;
                    newUser.password = newUser.generateHash(randomstring.generate(10));

                    newUser.save(function(err) {
                        if (err)
                            //throw err;
                        return done(null, newUser);
                    });
                }
			});
		});
	}));
	
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
			var taken = false;
			User.find({ username :  user_register }, function(err, user) {
				if (err) {
					taken = true;
					return done(err);
				}
				
				if (user.length > 0) {
					taken = true;
					return done(null, false, req.flash('messageEmail', 'The username is already taken.'));
				}
			});
			
			if(pass_register.length < 8 || pass_register.length > 20) {
				taken = true;
				return done(null, false, req.flash('messagePass', 'The password needs to have between 8-20 characters.'));
			}
			
			if(!req.body.email_register.match(/^([0-9]|[a-z])+([0-9a-z]+)@([0-9]|[a-z])+([0-9a-z]+).([a-z])+$/i)) {
				taken = true;
				return done(null, false, req.flash('messageEmail', 'The email is invalid.'));
			}
			
			User.find({ email :  req.body.email_register }, function(err, user) {
				
				if (err) {
					taken = true;
					return done(err);
				}
				
				if (user.length > 0) {
					taken = true;
					return done(null, false, req.flash('messageEmail', 'The email has already been used.'));
				}
			});
			
			process.nextTick(function(taken) {
				if(!taken) {
					var newUser = new User();

					User.find({ }, function(err, users) {
						if (err) {
							//throw err;
							console.log('Find error : '+err);
						}
						
						if (users.length == 0) {
							newUser.userID = 0;
						}
					});
					
					// set the user's local credentials
					newUser.username = user_register;
					newUser.password = newUser.generateHash(pass_register);
					newUser.email = req.body.email_register;

					// save the user
					newUser.save(function(err) {
						if (err) {
							//throw err;
							console.log('Save error : '+err);
						}
						return done(null, newUser);
					});
					
					process.nextTick(function(ID) {
					
						var Character = req.models.character;
						var newChar = new Character();
						
						newChar.level = 1;
						newChar.xp = 0;
						newChar.hp = 100;
						newChar.strength = 1;
						newChar.agility = 1;
						newChar.stamina = 1;
						newChar.charisma = 1;
						
						newChar.save(function(err) {
							if(err) {
								//throw err;
								console.log('Save error : '+err);
							}
							return done(null, newChar);
						});
						
						var Equip = req.models.equipment;
						var newEquipment = new Equip();
						
						newEquipment.helmetID = 2;
						newEquipment.chestID = 3;
						newEquipment.glovesID = 1;
						newEquipment.bootsID = 0;
						newEquipment.weaponID = 0;
						newEquipment.shieldID = 4;
						
						newEquipment.save(function(err) {
							if(err) {
								//throw err;
								console.log('Save error : '+err);
							}
							return done(null, newEquipment);
						});
						

						var Fights = req.models.fights;
						var newFights = new Fights();
						
						newFights.username = user_register;
						newFights.total = 0;
						newFights.wins = 0;
						newFights.defeats = 0;
						newFights.draws = 0;
						newFights.dmg_taken = 0;
						newFights.dmg_dealt = 0;
						newFights.gold_won = 0;
						newFights.gold_lost = 0;
						newFights.type = "dungeon";
						
						newFights.save(function(err) {
							if(err) {
								//throw err;
								console.log('Save error : '+err);
							}
							return done(null, newFights);
						});
						
						var newFights2 = new Fights();
						
						newFights2.username = user_register;
						newFights2.total = 0;
						newFights2.wins = 0;
						newFights2.defeats = 0;
						newFights2.draws = 0;
						newFights2.dmg_taken = 0;
						newFights2.dmg_dealt = 0;
						newFights2.gold_won = 0;
						newFights2.gold_lost = 0;
						newFights2.type = "arena";
						newFights2.save(function(err) {
							if(err) {
								//throw err;
								console.log('Save error : '+err);
							}
							return done(null, newFights2);
						});
					
					});
				}
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