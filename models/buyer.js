var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Buyer Schema
var BuyerSchema = mongoose.Schema({
	username_buyer: {
		type: String,
		index: true,
		unique: true
	},
	password_buyer: {
		type: String
	},
	email_buyer: {
		type: String,
		unique: true
	},
	profile_buyer: {
		type: Schema.ObjectId,
    	ref: 'Profile'
	}
	role_buyer: {
		type: String
	}
});

var Buyer = module.exports = mongoose.model('Buyer', BuyerSchema);

module.exports.createBuyer = function(newBuyer, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newBuyer.password, salt, function(err, hash) {
	        newBuyer.password = hash;
	        newBuyer.save(callback);
	    });
	});
}

module.exports.getBuyerByUsername = function(username, callback){
	var query = {username: username};
	Buyer.findOne(query, callback);
}

module.exports.getBuyerById = function(id, callback){
	Buyer.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}