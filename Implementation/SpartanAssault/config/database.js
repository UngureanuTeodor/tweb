var orm = require('orm');
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(app) {
	app.use(orm.express("mysql://root:@localhost/spartandb",
	{
		define: function (db, models) {
			models.user = db.define("user", {
				userID : { type: 'serial', key: true },
				username : String,
				password : String,
				email : String,
				gender : ["male", "female", ""],
				origin : ["north", "east", "south", "west", ""]
			}, {
					methods: {
						generateHash: function(pass) {
							return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
						},
						checkPass: function(pass) {
							return bcrypt.compareSync(pass, this.password);
						}
					}
				}
			);
			
			db.sync();
		}
	}));
	
	//this.db = orm;

};

//exports.userSchema = User;