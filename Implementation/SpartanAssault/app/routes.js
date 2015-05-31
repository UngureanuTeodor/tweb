var user = require('./models/user.js');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs', { messageUser: req.flash('messageUser'),
								  messagePass: req.flash('messagePass')});
    });

	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/success',
		failureRedirect : '/',
		failureFlash : true
	}));
	
	/*app.post('/register', function(req, res) {
		if(!isLoggedIn(req, res, "")) {
			var connection = mysql.createConnection({
				host : configDB.host,
				user : configDB.user,
				password : configDB.pass,
				database : configDB.name
			});

			connection.connect();
			
			connection.query('SELECT * FROM Users', function(err,rows,fields) {
				if(!err)
					console.log('Result '+ rows);
				else
					console.log('error');
			});
			
		}
		else {
			//redirect to profile page
		}
	});*/
	
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	
	/*app.get('*', function(req,res) {
		res.redirect('/');
		//check if logged in
	});*/
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
	
    res.redirect('/');
}