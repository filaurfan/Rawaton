var mongoose = require('mongoose');

// User profile Schema
var CartSchema = mongoose.Schema({
	 product_on_cart: {
	    type: Schema.ObjectId,
	    ref: 'Product'
  	},
  	buyer_profile: {
  		type: Schema.ObjectId,
    	ref: 'Profile'
  	},
  	tanggal_pesan: {
  		type : Date,
    	default: Date.now
  	}
});

var Cart = module.exports = mongoose.model('Cart', CartSchema);