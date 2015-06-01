module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs', { messageUser : req.flash('messageUser'),
								  messagePass : req.flash('messagePass'),
								  messageEmail : req.flash('messageEmail'),
								  messageLicense : req.flash('messageLicense')}
				   );
    });

	app.get('/terms', function(req, res) {
		res.render('terms.ejs');
	});
	
    // app.post('/login', do all our passport stuff here);

    app.post('/register', passport.authenticate('local-register', {
		successRedirect : '/success',
		failureRedirect : '/',
		failureFlash : true
	}));

	app.get('/success', function(req, res) {
		res.render('canvas.ejs');
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