var mongoose = require('mongoose');
require('mongoose-big-decimal')(mongoose);
// User profile Schema
var DumpCartItemSchema = mongoose.Schema({
    id_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DumpCart'
    },
    id_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    id_seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

var DumpItem = module.exports = mongoose.model('DumpItem', DumpCartItemSchema);