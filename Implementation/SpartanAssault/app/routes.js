module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs', { messageLoginUser : req.flash('messageLoginUser'),
								  messageLoginPass : req.flash('messageLoginPass'),
								  messageUser : req.flash('messageUser'),
								  messagePass : req.flash('messagePass'),
								  messageEmail : req.flash('messageEmail'),
								  messageLicense : req.flash('messageLicense')}
				   );
    });

	app.get('/terms', function(req, res) {
		res.render('terms.ejs');
	});
	
    app.post('/register', passport.authenticate('local-register', {
		successRedirect : '/success',
		failureRedirect : '/',
		failureFlash : true
	}));

	app.get('/success', function(req, res) {
		res.render('success.ejs');
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/gender',
		failureRedirect : '/',
		failureFlash : true
	}));
	
	app.get('/gender', function(req, res) {
		if(req.session.gender === "") {
			res.render('gender.ejs', { messageGender : req.flash('messageGender')});
		}
		else {
			res.redirect('/origin');
		}
	});
	
	app.post('/gender', function(req, res) {
		if(req.body.male == "on" || req.body.female == "on") {
			var value;
			if(req.body.male == "on")
				value = "male";
			else 
				value = "female";
			var User = req.models.user;
			
			User.find({ username : req.session.username}, function(err, user) {
				if(!err) {
					user[0].save({ gender: value }, function (err) {
					});
				}
				else console.log('Error: '+err);
			});
			res.redirect('/origin');
		}
		else {
			res.redirect('/gender');
			req.flash('messageGender', 'You have to pick a gender.');
		}
	});
	
	app.get('/origin', function(req, res) {
		if(req.session.origin === "") {
			res.render('origin.ejs', { messageOrigin : req.flash('messageOrigin')});
		}
		else {
			res.redirect('/canvas');
		}
	});
	
	app.post('/origin', function(req, res) {
		if(req.body.n == "on" || req.body.e == "on" || req.body.s == "on" || req.body.w == "on") {
			var value;
			if(req.body.n == "on")
				value = "north";
			else if(req.body.e == "on")
					value = "east";
				else if(req.body.s == "on")
						value = "south";
					else
						value = "west";
			var User = req.models.user;
			
			User.find({ username : req.session.username}, function(err, user) {
				if(!err) {
					user[0].save({ origin: value }, function (err) {
					});
				}
				else console.log('Error: '+ err);
			});
			res.redirect('/canvas');
		}
		else {
			res.redirect('/origin');
			req.flash('messageOrigin', 'You have to pick your origins.');
		}
	});
	
    app.get('/canvas', function(req, res) {
		if(req.isAuthenticated())
			res.render('canvas.ejs');
		else res.redirect('/');
    });
	
	app.get('/title', function(req, res) {
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end(req.session.username);
	});
	
	app.get('/items', function(req, res) {
		var equipment = req.models.equipment;
		var armor = req.models.armour;
		var helm_ID;
		
		equipment.find({ userID : req.session.user_id }, function(err, equip) {
			if(!err) {
				armor.find({ armourID : equip[0].helmetID}, function(err, helm) {
					if(!err) {
						console.log('Helm: ' + helm[0].armourName);
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(helm[0].armourName);
					}
					else console.log('Helm error');
				});
			}
			else console.log('Error: '+ err);
		});
	});
	
	app.get('/overview', function(req, res) {
		var json_text = "{ \"username\" : \""+ req.session.username + "\", \"helmet\" : \"";
		var equipment = req.models.equipment;
		var armor = req.models.armour;
		var weap = req.models.weapon;

		equipment.find({ userID : req.session.user_id }, function(err, equip) {
			if(!err) {
				armor.find({ armourID : equip[0].helmetID}, function(err, helm) {
					if(!err) {
						json_text = json_text + helm[0].armourName + "\", \"chest\" : \"";
						armor.find({ armourID : equip[0].chestID}, function(err, chest) {
							if(!err) {
								json_text = json_text + chest[0].armourName + "\", \"gloves\" : \"";
								armor.find({ armourID : equip[0].glovesID}, function(err, gloves) {
									if(!err) {
										json_text = json_text + gloves[0].armourName + "\", \"boots\" : \"";
										armor.find({ armourID : equip[0].bootsID}, function(err, boots) {
											if(!err) {
												json_text = json_text + boots[0].armourName + "\", \"shield\" : \"";
												armor.find({ armourID : equip[0].shieldID}, function(err, shield) {
													if(!err) {
														json_text = json_text + shield[0].armourName + "\", \"weapon\" : \"";
														weap.find({ weaponID : equip[0].weaponID}, function(err, weapon) {
															if(!err) {
																json_text = json_text + weapon[0].weaponName + "\"}";
																res.writeHead(200, {"Content-Type": "text/plain"});
																res.end(json_text);
															}
														});
													}
												});
											}
										});
									}
								});
							}
						});
					}
					else console.log('Helm error');
				});
			}
			else console.log('Error: '+ err);
		});
	});

    app.post('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');
    });
	
	/*app.get('*', function(req, res) {
		if(!isLoggedIn(req, res, '')) {
			res.redirect('/');
		}
    });*/
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}