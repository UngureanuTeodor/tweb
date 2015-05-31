var _mysql = require('mysql');

var configDB = require('../../config/database.js');

var mysql = _mysql.createConnection({
	host : configDB.host,
	user : configDB.user,
	password : configDB.pass,
	database : configDB.name
});

var result;

mysql.connect();

module.exports = function(sqlCommand) {
	this.query = executeQuery(sqlCommand);
};

function executeQuery(sqlCommand) {
	mysql.query(sqlCommand, getQueryResult);
			
	return result;
}

function getQueryResult(err, rows, fields) {
	if(!err) {
		console.log('rows : ' + rows);
		result = rows;
	}
	else {
		result = 'Error';
	}
}