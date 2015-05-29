module.exports = function(app, auth) {

    app.get('/', function(req, res) {
        res.render('index');
    });

	app.post('/register', function(req, res) {
		//
	})
	
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
	
    res.redirect('/');
}