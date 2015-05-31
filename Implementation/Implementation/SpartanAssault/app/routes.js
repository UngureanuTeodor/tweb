var mysql = require('mysql');
var configDB = require('../config/database.js');
var user = require('./models/user.js');

module.exports = function(app, auth) {

    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('mesage') });
    });

	app.post('/register', auth.authenticate('local-signup', {
		successRedirect : '/',
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
	
	app.get('*', function(req,res) {
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
	
    res.redirect('/');
}