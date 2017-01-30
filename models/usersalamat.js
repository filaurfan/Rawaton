var mongoose = require('mongoose');

// User profile Schema
var AlamatSchema = mongoose.Schema({
	id_user: {
	    type: Schema.ObjectId,
	    ref: 'User'
	},
	alamat_user: {
		jalan: String,
		kota: String,
		kabupaten: String,
		kecamatan: String,
		provinsi: String,
		kode_pos: Number 
	}
});

var Alamat = module.exports = mongoose.model('Alamat', AlamatSchema);