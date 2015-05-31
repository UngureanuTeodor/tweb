var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
//var _mysql = require('mysql');

var auth = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//var configDB = require('./config/database.js');

/*var mysql = _mysql.createConnection({
	host : configDB.host,
	user : configDB.user,
	password : configDB.pass,
	database : configDB.name
});*/

/*mysql.connect();

mysql.query('SELECT * FROM users', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
	else
		console.log('Error');
});*/
			
app.set('views', __dirname + '/views');

require('./config/authentification')(auth);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'randomsecretforspartanassault' })); 
app.use(auth.initialize());
app.use(auth.session());
app.use(flash());

require('./app/routes.js')(app, auth);

app.listen(port);
console.log('Listening on port ' + port);