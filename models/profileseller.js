var mongoose = require('mongoose');

// User profile Schema
var ProfileSellerSchema = mongoose.Schema({
	nama_seller: {
		type: String
	},
	no_telp_seller: {
		type: Number,
		unique: true
	},
	alamat_seller: {
		jalan: String,
		kota: String,
		kabupaten: String,
		kecamatan: String,
		provinsi: String,
		kode_pos: Number 
	}
});

var ProfileSeller = module.exports = mongoose.model('ProfileSeller', ProfileSellerSchema);