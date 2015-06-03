var orm = require('orm');
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(app) {
	app.use(orm.express("mysql://root:@localhost/spartandb",
	{
		define: function (db, models) {
			models.user = db.define("user", {
				userID : { type: 'number', key: true },
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
			
			models.character=db.define("character",{
				userID: { type: 'number', key: true },
				level:Number,
				xp:Number,
				hp:Number,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				guildID:Number,
				gold: Number
			},{
				methods: {
					
				}
			});
			
			models.guild=db.define("guild",{
				guildID:Number,
				guildName:String,
				ownerID:Number,
				number_members:Number,
				level:Number
			},{
				methods: {
					
				}
			});
			
			models.inventory=db.define("inventory",{
				userID:Number,
				itemID:Number,
				itemType:String,
				inventory_number:Number,
				inventory_x_position:Number,
				inventory_y_position:Number
			},{
				methods: {
					
				}
			});
			
			models.equipment=db.define("equipment",{
				userID:{ type: 'number', key: true },
				helmetID:Number,
				chestID:Number,
				glovesID:Number,
				bootsID:Number,
				weaponID:Number,
				shieldID:Number
			},{
				methods: {
					
				}
			});
			
			models.weapon=db.define("weapon",{
				weaponID:{ type: 'number', key: true },
				damage_min:Number,
				damage_max:Number,
				upgrade_level:Number,
				price:Number,
				weaponName:String,
				weight:Number
			},{
				methods: {
					
				}
			});
			
			models.consumable=db.define("consumable",{
				consumableID:{ type: 'number', key: true },
				consumableType:String,
				consumableHP:Number,
				price:Number
			},{
				methods: {
					
				}
			});
			
			models.armour=db.define("armour",{
				armourID:{ type: 'number', key: true },
				armourType:String,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				upgrade_level:Number,
				price:Number,
				weight:Number,
				armourName:String
			},{
				methods: {
					
				}
			});
			
			models.market=db.define("market",{
				auctionID:Number,
				userID:Number,
				price:Number,
				duration:Number,
				inventoryID:Number
			},{
				methods: {
					
				}
			});
			
			db.sync();
		}
	}));
	
	//this.db = orm;

};

//exports.userSchema = User;