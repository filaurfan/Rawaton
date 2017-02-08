var mongoose = require('mongoose');

// User profile Schema
var AlamatPengirimanSchema = mongoose.Schema({
	id_pembelian: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Pembelian'
	},
	nama_penerima:{
		type: String
	},
	no_telp_penerima:{
		type: String,
		unique: true
	},
	alamat_jalan_penerima:{
		type: String
	},
	alamat_kecamatan_penerima:{
		type: String
	},
	alamat_kota_penerima:{
		type: String
	},
	alamat_kabupaten_penerima:{
		type: String
	},	
	alamat_provinsi_penerima:{
		type: String
	},
	alamat_kode_pos_penerima:{
		type: String
	}
});

var AlamatPengiriman = module.exports = mongoose.model('AlamatPengiriman', AlamatPengirimanSchema);