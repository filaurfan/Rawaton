var mongoose = require('mongoose');

// User profile Schema
var DumpCartSchema = mongoose.Schema({
    id_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    },
  	id_user: {
  		type: mongoose.Schema.Types.ObjectId,
    	ref: 'User'
  	},
    id_seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  	tanggal_buat: {
      type : Date,
      default: Date.now
    },
    status: {
    	type: String
    },
    total_harga:{
      type: Number
    },
    tanggal_selesai:{
      type : Date,
      default: Date.now
    }
});

var DumpCart = module.exports = mongoose.model('DumpCart', DumpCartSchema);