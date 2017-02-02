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
    }
});

var Cart = module.exports = mongoose.model('Cart', CartSchema);