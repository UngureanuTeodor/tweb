//var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var generateHash = function(pass) {
	return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
}

module.exports = {
	'hash' : generateHash,
};

/*var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
*/