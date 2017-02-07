var mongoose = require('mongoose');

// User profile Schema
var CartSchema = mongoose.Schema({
  	id_user: {
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
    }
});

var Cart = module.exports = mongoose.model('Cart', CartSchema);