var mongoose = require('mongoose');

// User profile Schema
var CartSchema = mongoose.Schema({
  	id_user: {
  		type: Schema.ObjectId,
    	ref: 'User'
  	}
});

var Cart = module.exports = mongoose.model('Cart', CartSchema);