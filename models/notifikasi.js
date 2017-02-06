var mongoose = require('mongoose');

// Seller Schema
var NotifikasiSchema = mongoose.Schema({
	id_user: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	title_notif: {
		type: String
	},
	isi_notif: {
	    type: String
	}
	tanggal_notif: {
	    type : Date,
	    default: Date.now
	}
	status_notif: {
	    type: String
	}
});

var Notifikasi = module.exports = mongoose.model('Notifikasi', NotifikasiSchema);