var mongoose = require('mongoose');

// Seller Schema
var OnlineSchema = mongoose.Schema({
	id_user: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	status: {
		type: String
	},
	online: {
	    type : Date,
	    default: Date.now
	}
	offline: {
	    type : Date,
	    default: Date.now
	}
});

var Online = module.exports = mongoose.model('Online', OnlineSchema);