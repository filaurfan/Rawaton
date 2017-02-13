var mongoose = require('mongoose');

// User profile Schema
var CartSchema = mongoose.Schema({
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
    status_pembayaran:{
      type: String
    },
    status_pengiriman:{
      String: String
    },
    total_harga:{
      type: Number
    },
    tanggal_pembayaran:{
      type : Date,
      default: Date.now
    },
    tanggal_pengiriman:{
      type : Date,
      default: Date.now
    },
    tanggal_selesai:{
      type : Date,
      default: Date.now
    }
});

var Cart = module.exports = mongoose.model('Cart', CartSchema);