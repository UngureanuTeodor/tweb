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
			res.redirect('/overview');
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
			res.redirect('/overview');
		}
		else {
			res.redirect('/origin');
			req.flash('messageOrigin', 'You have to pick a your origins.');
		}
	});
	
    /*app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });*/

    app.get('/logout', function(req, res) {
        req.logout();
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