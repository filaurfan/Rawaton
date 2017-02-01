var mongoose = require('mongoose');

// Product Schema
var ProductSchema = mongoose.Schema({
  id_User: {
    type: String,
    ref: 'User'
  },
  name_product: {
    type: String,
    index: true
  },
  category_product: {
    type: String
  },
  price_product: {
    type: Number
  },
  entity_product: {
    type: Number
  },
  description_product: {
    type: String
  },
  picture_product: {
    type: String
  },
  created_at: {
    type : Date,
    default: Date.now
  }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);