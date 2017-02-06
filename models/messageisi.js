var mongoose = require('mongoose');

// Seller Schema
var MessageIsiSchema = mongoose.Schema({
	id_message: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'Message'
	},
	title_message: {
		type: String
	},
	isi_message: {
	    type: String
	}
	tanggal_message: {
	    type : Date,
	    default: Date.now
	}
	status_message: {
	    type: String
	}
});

var MessageIsi = module.exports = mongoose.model('MessageIsi', MessageIsiSchema);
