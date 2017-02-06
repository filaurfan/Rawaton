var mongoose = require('mongoose');

// Seller Schema
var MessageSchema = mongoose.Schema({
	from_id: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	to_id: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	tanggal_message: {
	    type : Date,
	    default: Date.now
	}
});

var Message = module.exports = mongoose.model('Message', MessageSchema);
