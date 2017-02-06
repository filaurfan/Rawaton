var mongoose = require('mongoose');

// User profile Schema
var AlamatSchema = mongoose.Schema({
	id_user: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	no_telp_kantor:{
		type: String,
		unique: true
	},
	nama_toko:{
		type: String
	},
	alamat_jalan:{
		type: String
	},
	alamat_kecamatan:{
		type: String
	},
	alamat_kota:{
		type: String
	},
	alamat_kabupaten:{
		type: String
	},	
	alamat_provinsi:{
		type: String
	},
	alamat_kode_pos:{
		type: String
	}
});

var Alamat = module.exports = mongoose.model('Alamat', AlamatSchema);