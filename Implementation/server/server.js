var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongDB = require('mongoose');
var auth = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

mongDB.connect(configDB.url);

//require('./config/authentification')(auth);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({ secret: 'randomsecretforspartanassault' })); 
app.use(auth.initialize());
app.use(auth.session());
app.use(flash());

require('./app/routes.js')(app, auth);

app.listen(port);
console.log('Listening on port ' + port);