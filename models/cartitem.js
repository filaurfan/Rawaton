var mongoose = require('mongoose');

// User profile Schema
var CartItemSchema = mongoose.Schema({
    id_cart: {
      type: Schema.ObjectId,
      ref: 'Cart'
    },
    id_product: {
      type: Schema.ObjectId,
      ref: 'Product'
    },
    harga_nego: {
      type : Number
    },
    tanggal_pesan: {
      type : Date,
      default: Date.now
    }
});

var Item = module.exports = mongoose.model('Item', CartItemSchema);