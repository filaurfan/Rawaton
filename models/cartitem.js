var mongoose = require('mongoose');

// User profile Schema
var CartItemSchema = mongoose.Schema({
    id_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart'
    },
    id_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    nama_product: {
      type: String
    },
    nama_seller: {
      type: String
    },
    gambar_item:{
      type : String
    },
    jumlah: {
      type : Number
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