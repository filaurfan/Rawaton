var mongoose = require('mongoose');

// User profile Schema
var ProfileBuyerSchema = mongoose.Schema({
	nama_buyer: {
		type: String
	},
	no_telp_buyer: {
		type: Number,
		unique: true
	},
	alamat_buyer: {
		jalan: String,
		kota: String,
		kabupaten: String,
		kecamatan: String,
		provinsi: String,
		kode_pos: Number 
	}
});

var ProfileBuyer = module.exports = mongoose.model('ProfileBuyer', ProfileBuyerSchema);