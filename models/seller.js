var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Seller Schema
var SellerSchema = mongoose.Schema({
	username_seller: {
		type: String,
		index: true,
		unique: true
	},
	password_seller: {
		type: String
	},
	email_seller: {
		type: String,
		unique: true
	},
	profile_seller: {
		type: Schema.ObjectId,
    	ref: 'Profile'
	}
	role_seller: {
		type: String
	}
});

var Seller = module.exports = mongoose.model('Seller', SellerSchema);

module.exports.createSeller = function(newSeller, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newSeller.password, salt, function(err, hash) {
	        newSeller.password = hash;
	        newSeller.save(callback);
	    });
	});
}

module.exports.getSellerByUsername = function(username, callback){
	var query = {username: username};
	Seller.findOne(query, callback);
}

module.exports.getSellerById = function(id, callback){
	Seller.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}