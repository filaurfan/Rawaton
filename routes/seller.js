var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');
var Profile = require('../models/usersprofile');
var Alamat = require('../models/usersalamat');

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/dashboard/:id', function(req, res){
	var _id = req.params.id;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, seller) {
        	if(seller.role == "seller"){
        		console.log(seller);
    	        res.render('sellerdashboard', {users: seller, layout: 'layout_seller'});
        	}else if(seller.role == "buyer"){
        		console.log(seller);
    	        res.render('buyerdashboard', {users: seller, layout: 'layout_buyer'});
        	}else{

        	}
        });
    }	
});

//yang ditampilkan adalah profile seller dengan semua element di disable.
//akses profile seller : masalah adalah ketika user hanya mengetikkan /seller/profile di url
//option satu redirect ke /seller/profile/:username
router.get('/profile/:id', function(req, res){
	var _id = req.params.id;
	console.log(_id);
	if (_id) {
		User.findOne({ _id: _id }, function(err, seller) {
	        Profile.findOne({ _id: _id }, function(err, profile) {
	        	Alamat.findOne({ _id: _id }, function(err, alamat){
	        		if(seller.role == "seller"){
		        		console.log(seller);
		    	        res.render('sellerprofile', {users: seller, profile_seller: profile, alamat_seller: alamat, layout: 'layout_seller'});
		        	}else if(seller.role == "buyer"){
		        		console.log(seller);
		    	        res.render('buyerprofile', {users: seller, profile_buyer: profile, alamat_buyer: alamat,  layout: 'layout_buyer'});
		        	}else{

		        	}
	        	});
	        });
        });
    }	
});

//yang ditampilkan adalah profile seller dengan semua element di dienable.
//akses edit profile seller : masalah adalah ketika user hanya mengetikkan /seller/profile/update di url
//option satu redirect ke /seller/profile/update/:username
router.get('/pengaturan/:id', function(req, res){
	var _id = req.params.id;
	console.log(_id);
	if (_id) {
		User.findOne({ _id: _id }, function(err, seller) {
	        Profile.findOne({ _id: _id }, function(err, profile) {
	        	Alamat.findOne({ _id: _id }, function(err, alamat){
	        		if(seller.role == "seller"){
		        		console.log(seller);
		    	        res.render('sellerprofile', {users: seller, profile_seller: profile, alamat_seller: alamat, layout: 'layout_seller'});
		        	}else if(seller.role == "buyer"){
		        		console.log(seller);
		    	        res.render('buyerprofile', {users: seller, profile_buyer: profile, alamat_buyer: alamat,  layout: 'layout_buyer'});
		        	}else{

		        	}
	        	});
	        });
        });
    }
});

//melakukan edit pada profile : masalah ada pada ketika kita hanya mengedit pada table profile 
//apakah pada table seller akan ikut berubah dengan asumsi bahwa table profile memiliki relasi ke table seller
//melakukan edit pada profile : masalah ada pada menginputkan data ke database
//option satu cari cara menginputkan data relasi
router.post('/pengaturan/:id', function(req, res){
	var _id = req.params.id;
	var nama_seller = req.body.nama_seller;
	var no_telp_seller = req.body.no_telp_seller;
	var alamat_seller.jalan = req.body.jalan;
	var alamat_seller.kota = req.body.kota;
	var alamat_seller.kabupaten = req.body.kabupaten;
	var alamat_seller.kecamatan = req.body.kecamatan;
	var alamat_seller.provinsi = req.body.provinsi;
	var alamat_seller.kode_pos = req.body.kode_pos;
	

	// Validation
	req.checkBody('nama_seller', 'Nama Barang is required').notEmpty();
	req.checkBody('no_telp_seller', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('alamat_seller.jalan', 'Harga Barang is not valid').notEmpty();
	req.checkBody('alamat_seller.kota', 'Stock Barang is required').notEmpty();
	req.checkBody('alamat_seller.kabupaten', 'Deskripsi Barang is required').notEmpty();
	req.checkBody('alamat_seller.kecamatan', 'Gambar Barang is required').notEmpty();
	req.checkBody('alamat_seller.provinsi', 'Stock Barang is required').notEmpty();
	req.checkBody('alamat_seller.kode_pos', 'Gambar Barang is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		if (_id) {
			User.findOne({ _id: _id }, function(err, user) {
		        if(user.role == "seller"){
		        	console.log(user);
		    	    res.render('sellerpengaturan', {errors:errors, layout: 'layout_seller'});
		        }else if(user.role == "buyer"){
		        	console.log(user);
		    	    res.render('buyerpengaturan', {errors:errors,  layout: 'layout_buyer'});
		       	}else{

		        }
	        });
	    }
	} else {
	    var profile = new Profile({
		    "nama_seller": nama_seller,
		    "no_telp_seller": no_telp_seller		    
		});
		var alamat = new Alamat({
			"alamat_seller.jalan": alamat_seller.jalan,
		    "alamat_seller.kota": alamat_seller.kota,
		    "alamat_seller.kabupaten": alamat_seller.kabupaten,
		    "alamat_seller.kecamatan": alamat_seller.kecamatan,
		    "alamat_seller.provinsi": alamat_seller.provinsi,
		    "alamat_seller.kode_pos": alamat_seller.kode_pos
		});
		User.findOne({ _id: _id }, function(err, user) {
			Profile.findOne({ id_user: user._id}, function(err, profile){
				if(!profile){
					Profile.save(function(err) {  
					    if (err) {
					        console.log(err);
					    }
					    else {
					        console.log('berhasil menyimpan');
					    }
					});
				}else{

				}
			});
		    if(user.role == "seller"){
		        console.log(user);
		    	res.render('sellerpengaturan', {errors:errors, layout: 'layout_seller'});
		    	return res.redirect('/seller/pengaturan/{ _id }');
		    }else if(user.role == "buyer"){
		       	console.log(user);
		    	res.render('buyerpengaturan', {errors:errors,  layout: 'layout_buyer'});
		    	return res.redirect('/profile/'+ username_seller);
		    }else{

		    }
	    });
		Profile.update(profile, function(err, product){
		   	if (err) {
				return res.render('500');
			}
			console.log(profile);
			return res.redirect('/profile/'+ username_seller);
		});
	req.flash('success_msg', 'You are registered and can now login');
	}
});

// //akses list product sellers :
// //option satu
// router.get('/product/list', function(req, res, next){
// 	var no_telp_seller = req.body.no_telp_seller;
// 	Product.find({"seller_profile.no_telp_seller": no_telp_seller}).sort({created_at: 1}, function(err, product){
//       if(!err) {
//         return res.render('/seller/sellerlistproduct', {products: product, layout: 'layout_seller'});
//       } else {
//         return res.render('500');
//       }
//     });
// });

// //untuk menampilkan halaman input barang pada sisi seller
// router.get('/product/input', function(req, res){
// 	res.render('/seller/sellerinputproduct', {layout: 'layout_seller'});
// });

// //untuk menginputkan barang pada table products
// router.post('/product/input', function(req, res){
// 	var nama_seller = req.body.nama_seller;
// 	var no_telp_seller = req.body.no_telp_seller;
// 	var alamat_seller.jalan = req.body.jalan;
// 	var alamat_seller.kota = req.body.kota;
// 	var alamat_seller.kabupaten = req.body.kabupaten;
// 	var alamat_seller.kecamatan = req.body.kecamatan;
// 	var alamat_seller.provinsi = req.body.provinsi;
// 	var alamat_seller.kode_pos = req.body.kode_pos;

// 	var name_product = req.body.name_product;
// 	var category_product = req.body.category_product;
// 	var price_product = req.body.price_product;
// 	var entity_product = req.body.entity_product;
// 	var description_product = req.body.description_product;
// 	var picture_product = req.body.picture_product;
// 	var created_at = new Date();

// 	// Validation
// 	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
// 	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
// 	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
// 	req.checkBody('entity_product', 'Stock Barang is required').notEmpty();
// 	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
// 	req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

// 	var errors = req.validationErrors();

// 	if(errors){
// 		res.render('/seller/sellerinputproduct',{
// 			errors:errors,
// 			layout: 'layout_seller'
// 		});
// 	} else {
// 	    var product = new Product({
// 		    name_product: name_product,
// 		    "seller_profile.nama_seller": nama_seller,
// 		    "seller_profile.no_telp_seller": no_telp_seller,
// 		    "seller_profile.alamat_seller.jalan": alamat_seller.jalan,
// 		    "seller_profile.alamat_seller.kota": alamat_seller.kota,
// 		    "seller_profile.alamat_seller.kabupaten": alamat_seller.kabupaten,
// 		    "seller_profile.alamat_seller.kecamatan": alamat_seller.kecamatan,
// 		    "seller_profile.alamat_seller.provinsi": alamat_seller.provinsi,
// 		    "seller_profile.alamat_seller.kode_pos": alamat_seller.kode_pos,
// 		    category_product: category_product,
// 		    price_product: price_product,
// 		    entity_product: entity_product,
// 		    description_product: description_product,
// 		    picture_product: picture_product,
// 		    created_at: created_at
// 		});
// 		Product.save(product, function(err, product){
// 		    if (err) {
// 				return res.render('500');
// 			}
// 			console.log(product);
// 			return res.redirect('/seller/input');
// 		});
// 	req.flash('success_msg', 'You are registered and can now login');
// 	}
// });

// router.get('/product/update/:id_product', function (req, res) {
// 	var id = req.params.id_product;
//     if (id) {
//         Product.findById({_id : id}, function(err, product) {
//         	console.log(id);
//             console.log(product); 
//             res.render('seller/sellerupdateproduct', {products: product, layout: 'layout_seller'});
//         });
//     }
// });

// router.post('/product/update/:id_product', function(req, res){
// 	var id = req.params.id_product;
// 	var name_product = req.body.name_product;
// 	var category_product = req.body.category_product;
// 	var price_product = req.body.price_product;
// 	var entity_product = req.body.entity_product;
// 	var description_product = req.body.description_product;
// 	var picture_product = req.body.picture_product;
// 	var created_at = new Date();

// 	// Validation
// 	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
// 	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
// 	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
// 	req.checkBody('entity_product', 'Stock Barang is required').notEmpty();
// 	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
// 	req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

//     if (id) {
//         Product.update({_id : id}, function(err, product) {
//         	console.log(id);
//             console.log(product);
//             return res.redirect('/seller/product/list');
//         });
//     }
// }};

// router.post('/product/delete/:id_product', function(req, res){
// 	var id = req.params.id_product;
// 	if (id) {
//         Product.remove({_id : id}, function(err) {
//         	if(!err) {
// 	          	console.log('Removed Product');
// 	          	return res.redirect('/seller/product/list');
// 	        } else {
// 	          	res.statusCode = 500;
// 	          	console.log('Internal error(%d): %s',res.statusCode,err.message);
// 	         	return res.send({ error: 'Server error' });
// 	        }
//         });
//     }
// });

module.exports = router;