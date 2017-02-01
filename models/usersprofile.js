var mongoose = require('mongoose');


// User profile Schema
var ProfileSchema = mongoose.Schema({
	id_user: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	nama_user: {
		type: String
	},
	no_telp_user: {
		type: String,
		unique: true
	}
});

var Profile = module.exports = mongoose.model('Profile', ProfileSchema);