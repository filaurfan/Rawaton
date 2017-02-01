var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Seller Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	role: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = function(newSeller, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newSeller.password, salt, function(err, hash) {
	        newSeller.password = hash;
	        newSeller.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}