var mongoose = require('mongoose');

// Seller Schema
var MessageSchema = mongoose.Schema({
	from_id: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	from_name:{
		type: mongoose.Schema.Types.String,
		ref: 'Profile'
	},
	to_id: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	id_cart:{
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'DumpCart'
	},
	tanggal_message: {
	    type : Date,
	    default: Date.now
	},
	status_nego:{
		type: String
	}
});

var Message = module.exports = mongoose.model('Message', MessageSchema);
