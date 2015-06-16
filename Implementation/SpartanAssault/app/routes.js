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
	
	app.get('/main_info', function(req, res) {
		var json_text = "{ \"username\" : \""+ req.session.username + "\", \"gender\" : \"";
		
		if(req.session.gender === "") {
			var User = req.models.user;
			
			User.find({ userID : req.session.user_id }, function(err, user) {
				if(!err) {
					json_text += user[0].gender  + "\" }";
					
					res.writeHead(200, {"Content-Type": "text/plain"});
					res.end(json_text);
				}
			});
		}
		else {
			json_text += req.session.gender  + "\" }";
					
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end(json_text);
		}
	});
	
	app.get('/stats', function(req, res) {
		var character = req.models.character;
		var json_text = "{ \"strength\" : \"";
		
		character.find({ userID : req.session.user_id }, function(err, characterInfo) {
			if(!err) {
				if(characterInfo.length > 0) {
					json_text = json_text + characterInfo[0].strength + "\", \"agility\" : \"" +
											characterInfo[0].agility + "\", \"stamina\" : \"" +
											characterInfo[0].stamina + "\", \"charisma\" : \"" +
											characterInfo[0].charisma + "\" }";
					res.writeHead(200, {"Content-Type": "text/plain"});
					res.end(json_text);
				}
			}
		});
	});
	
	app.get('/equipped_items', function(req, res) {
		var equipment = req.models.equipment;
		var armor = req.models.armour;
		var weap = req.models.weapon;
		var json_text = "{ \"helmet\" : \"";
		
		equipment.find({ userID : req.session.user_id }, function(err, equip) {
			if(!err) {
				armor.find({ armourID : equip[0].helmetID}, function(err, helm) {
					if(!err) {
						json_text += helm[0].armourName + "\", \"chest\" : \"";
						armor.find({ armourID : equip[0].chestID}, function(err, chest) {
							if(!err) {
								json_text += chest[0].armourName + "\", \"gloves\" : \"";
								armor.find({ armourID : equip[0].glovesID}, function(err, gloves) {
									if(!err) {
										json_text += gloves[0].armourName + "\", \"boots\" : \"";
										armor.find({ armourID : equip[0].bootsID}, function(err, boots) {
											if(!err) {
												json_text += boots[0].armourName + "\", \"shield\" : \"";
												armor.find({ armourID : equip[0].shieldID}, function(err, shield) {
													if(!err) {
														json_text += shield[0].armourName + "\", \"weapon\" : \"";
														weap.find({ weaponID : equip[0].weaponID}, function(err, weapon) {
															if(!err) {
																json_text += weapon[0].weaponName + "\" }";
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
				});
			}
		});
	});
	
	app.get('/inventory', function(req, res) {
		var armor = req.models.armour;
		var weap = req.models.weapon;
		var inv = req.models.inventory;
		var consumables = req.models.consumable;
		
		inv.find({ userID : req.session.user_id }, function(err, inventories) {
			if(!err) {
				var json_text = "{ \"inventories\" : [ ";
				var inv_value = 0, max_value = 0, min_value = 0;
				
				var get_inv = function(inventories, index, json_text, get_inv) {
					console.log("Json: " + json_text);
					if(inventories.length === 0) {
						json_text += " ], \"inventory_val\" :  \"" + inv_value +
									 "\", \"min_val\" : \"" + min_value +
									 "\", \"max_val\" : \""+ max_value + "\" }";
						
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(json_text);
						
						return false;
					}
					
					json_text += "{ \"number\" : \""
							   + inventories[index].inventory_number + "\", \"x\" : \""
							   + inventories[index].inventory_x_position + "\", \"y\" : \""
							   + inventories[index].inventory_y_position + "\", \"name\" : \"";
					
					var item_name;
					var item_type;
					if(inventories[index].itemType === "armor") {
						armor = req.models.armour;
						armor.find({ armourID : inventories[index].itemID }, function(err, armor_item) {
							if(!err) {
								json_text += armor_item[0].armourName + "\", \"type\" : \"" + armor_item[0].armourType + "\" }";
								inv_value+= armor_item[0].price;
								if(armor_item[0].price > max_value) {
									max_value = armor_item[0].price;
								}
								if(min_value == 0 || armor_item[0].price < min_value) {
									min_value = armor_item[0].price;
								}
								
								if(index === parseInt(inventories.length-1)) {
									json_text += " ], \"inventory_val\" :  \"" + inv_value +
												 "\", \"min_val\" : \"" + min_value +
												 "\", \"max_val\" : \""+ max_value + "\" }";
									
									res.writeHead(200, {"Content-Type": "text/plain"});
									res.end(json_text);
								}
								else {
									json_text += ", ";
									get_inv(inventories, index+1, json_text, get_inv);
								}
							}
						});
					}
					else 
						if(inventories[index].itemType === "weapon") {
							weap.find({ weaponID : inventories[index].itemID }, function(err, weap_item) {
								if(!err) {
									json_text += weap_item[0].weaponName + "\", \"type\" : \"" + "weapon" + "\" }";
									inv_value+= weap_item[0].price;
									if(weap_item[0].price > max_value) {
										max_value = weap_item[0].price;
									}
									if(min_value == 0 || weap_item[0].price < min_value) {
										min_value = weap_item[0].price;
									}

									if(index === parseInt(inventories.length-1)) {
										json_text += " ], \"inventory_val\" :  \"" + inv_value +
													 "\", \"min_val\" : \"" + min_value +
													 "\", \"max_val\" : \""+ max_value + "\" }";
										
										console.log("Json: " + json_text);
										res.writeHead(200, {"Content-Type": "text/plain"});
										res.end(json_text);
									}
									else {
										json_text += ", "; 
										get_inv(inventories, index+1, json_text, get_inv);
									}
								}
							});
						}
						else {
							consumables.find({ consumableID : inventories[index].itemID }, function(err, cons_item) {
								if(!err) {
									json_text += cons_item[0].consumableName + "\", \"type\" : \"" + cons_item[0].consumableType + "\" }";
									inv_value+= cons_item[0].price;
									if(cons_item[0].price > max_value) {
										max_value = cons_item[0].price;
									}
									if(min_value == 0 || cons_item[0].price < min_value) {
										min_value = cons_item[0].price;
									}
									
									if(index === parseInt(inventories.length-1)) {
										json_text += " ], \"inventory_val\" :  \"" + inv_value +
													 "\", \"min_val\" : \"" + min_value +
													 "\", \"max_val\" : \""+ max_value + "\" }";
										
										res.writeHead(200, {"Content-Type": "text/plain"});
										res.end(json_text);
									}
									else {
										json_text += ", ";
										get_inv(inventories, index+1, json_text, get_inv);
									}
								}
							});
						}
				}
				
				get_inv(inventories, 0, json_text, get_inv);
			}
	
		});
	});
	
	app.get('/fights', function(req, res){
		var Fights = req.models.fights;
		var json_text = "{ \"total\" : \"";
		
		Fights.find({ userID : req.session.user_id, type : "dungeon" }, function(err, fights) {
			if(!err) {
				json_text += fights[0].total + "\", \"wins\" : \""
						  + fights[0].wins + "\", \"defeats\" : \""
						  + fights[0].defeats + "\", \"draws\" : \""
						  + fights[0].draws + "\" , \"dmg_taken\" : \""
						  + fights[0].dmg_taken + "\" , \"dmg_dealt\" : \""
					   	  + fights[0].dmg_dealt + "\" , \"gold_won\" : \""
						  + fights[0].gold_won + "\" , \"gold_lost\" : \""
						  + fights[0].gold_lost + "\" }";
						  
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.end(json_text);
			}
		});
	});
	
	app.get('/pvp', function(req, res){
		var Pvp = req.models.fights;
		var json_text = "{ \"total_pvp\" : \"";
		
		Pvp.find({ userID : req.session.user_id, type : "arena" }, function(err, pvp_fights) {
			if(!err) {
				json_text += pvp_fights[0].total + "\", \"wins_pvp\" : \""
						  + pvp_fights[0].wins + "\", \"defeats_pvp\" : \""
						  + pvp_fights[0].defeats + "\", \"draws_pvp\" : \""
						  + pvp_fights[0].draws + "\" , \"dmg_taken_pvp\" : \""
						  + pvp_fights[0].dmg_taken + "\" , \"dmg_dealt_pvp\" : \""
					   	  + pvp_fights[0].dmg_dealt + "\" , \"gold_won_pvp\" : \""
						  + pvp_fights[0].gold_won + "\" , \"gold_lost_pvp\" : \""
						  + pvp_fights[0].gold_lost + "\" }";
						  
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.end(json_text);
			}
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