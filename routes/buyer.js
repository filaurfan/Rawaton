var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');
var Alamat = require('../models/usersalamat');
var Profile = require('../models/usersprofile');

//akses dashboar buyer : masalah adalah apa yang di tampilkan di dashboard buyer
//option satu produk produk baru
router.get('/dashboard', function(req, res){
	var username_buyer = req.body.username_buyer;
	if (username_buyer) {
        User.findOne({username: username_buyer}, function(err, buyer) {
            console.log(buyer);
            res.render('/buyer/buyerdashboard', {users: buyer, layout: 'layout_buyer'});
        });
    }	
});

//yang ditampilkan adalah profile buyer dengan semua element di disable.
//akses profile buyer : masalah adalah ketika user hanya mengetikkan /buyer/profile di url
//option satu redirect ke /buyer/profile/:username
router.get('/profile/:username', function(req, res){
	var username_buyer = req.params.username;
	if (username_buyer) {
        Buyer.findOne({username_buyer: username_buyer}, function(err, buyer) {
            console.log(buyer);
            res.render('/buyer/buyerprofile', {users: buyer, layout: 'layout_buyer'});
        });
    }	
});

//yang ditampilkan adalah profile buyer dengan semua element di dienable.
//akses edit profile buyer : masalah adalah ketika user hanya mengetikkan /buyer/profile/update di url
//option satu redirect ke /buyer/profile/update/:username
router.get('/profile/update/:username', function(req, res){
	var username_buyer = req.params.username;
	if (username_buyer) {
        Buyer.findOne({username_buyer: username_buyer}, function(err, buyer) {
            console.log(buyer);
            res.render('/buyer/buyerupdate', {users: buyer, layout: 'layout_buyer'});
        });
    }	
});

//melakukan edit pada profile : masalah ada pada ketika kita hanya mengedit pada table profile 
//apakah pada table buyer akan ikut berubah dengan asumsi bahwa table profile memiliki relasi ke table buyer
//melakukan edit pada profile : masalah ada pada menginputkan data ke database
//option satu cari cara menginputkan data relasi
router.post('/profile/update/:username', function(req, res){
	var nama_buyer = req.body.nama_buyer;
	var no_telp_buyer = req.body.no_telp_buyer;
	var alamat_buyer.jalan = req.body.jalan;
	var alamat_buyer.kota = req.body.kota;
	var alamat_buyer.kabupaten = req.body.kabupaten;
	var alamat_buyer.kecamatan = req.body.kecamatan;
	var alamat_buyer.provinsi = req.body.provinsi;
	var alamat_buyer.kode_pos = req.body.kode_pos;

	var username_buyer = req.params.username;
	
	// Validation
	req.checkBody('nama_buyer', 'Nama Barang is required').notEmpty();
	req.checkBody('no_telp_buyer', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('alamat_buyer.jalan', 'Harga Barang is not valid').notEmpty();
	req.checkBody('alamat_buyer.kota', 'Stock Barang is required').notEmpty();
	req.checkBody('alamat_buyer.kabupaten', 'Deskripsi Barang is required').notEmpty();
	req.checkBody('alamat_buyer.kecamatan', 'Gambar Barang is required').notEmpty();
	req.checkBody('alamat_buyer.provinsi', 'Stock Barang is required').notEmpty();
	req.checkBody('alamat_buyer.kode_pos', 'Gambar Barang is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('/buyer/buyerupdate',{
			errors:errors,
			layout: 'layout_buyer'
		});
	} else {
	    var profile = new Profile({
		    "nama_buyer": nama_buyer,
		    "no_telp_buyer": no_telp_buyer,
		    "alamat_buyer.jalan": alamat_buyer.jalan,
		    "alamat_buyer.kota": alamat_buyer.kota,
		    "alamat_buyer.kabupaten": alamat_buyer.kabupaten,
		    "alamat_buyer.kecamatan": alamat_buyer.kecamatan,
		    "alamat_buyer.provinsi": alamat_buyer.provinsi,
		    "alamat_buyer.kode_pos": alamat_buyer.kode_pos,
		});
	req.flash('success_msg', 'You are registered and can now login');
	}
});

//akses list cart buyer :
//option satu
router.get('/cart/list', function(req, res, next){
	var no_telp_buyer = req.body.no_telp_buyer;
	Cart.find({"buyer_profile.no_telp_buyer": no_telp_buyer}).sort({created_at: 1}, function(err, cart){
      if(!err) {
        return res.render('/buyer/buyerlistcart', {carts: cart, layout: 'layout_buyer'});
      } else {
        return res.render('500');
      }
    });
});

//untuk menginputkan product ke cart jadi posisi buyer berada di localhost:3000/
//masalah ada ketika penyimpanan ke database
router.post('/cart/add/:id_product', function(req, res){
	var id_product = req.params.id_product;
	var no_telp_buyer = req.body.no_telp_buyer;
	var tanggal_pesan = new Date();

	Product.findOne({"product_on_cart._id": id_product}).sort({created_at: 1}, function(err, product){
      if(!err) {
      	Profile.findOne({no_telp_buyer: no_telp_buyer}, function(err, profile){
      		if(!err){
      			var cart = new Cart({
      				product_on_cart: product,
      				buyer_profile: profile,
      				tanggal_pesan: tanggal_pesan
      			});
      			Cart.save(cart, function(req, res){
				    if (err) {
						return res.render('500');
					}
					console.log(cart);
				});
      		}
      	});
		return res.redirect('/cart/list');
      } else {
        return res.render('500');
      }
    });
});

module.exports = router;