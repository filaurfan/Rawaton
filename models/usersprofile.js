var mongoose = require('mongoose');


// User profile Schema
var ProfileSchema = mongoose.Schema({
	id_user: {
	    type: Schema.ObjectId,
	    ref: 'User'
	},
	nama_user: {
		type: String
	},
	no_telp_user: {
		type: Number,
		unique: true
	}
});

var Profile = module.exports = mongoose.model('Profile', ProfileSellerSchema);