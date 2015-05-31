var bcrypt   = require('bcrypt-nodejs');
var generateHash = function(pass) {
	return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
}

module.exports = {
	'hash' : generateHash,
};