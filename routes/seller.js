var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');
var Profile = require('../models/usersprofile');
var Alamat = require('../models/usersalamat');

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/dashboard/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "seller"){
        		console.log(user);
    	        res.render('sellerdashboard', {users: user, layout: 'layout_user'});
        	}else if(user.role == "buyer"){
        		console.log(user);
    	        res.render('buyerdashboard', {users: user, layout: 'layout_user'});
        	}else{

        	}
        });
    }	
});

//yang ditampilkan adalah profile seller dengan semua element di disable.
//akses profile seller : masalah adalah ketika user hanya mengetikkan /seller/profile di url
//option satu redirect ke /seller/profile/:username
router.get('/profile/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	var profile = "";
	console.log(_id);
	if (_id) {
		User.findOne({ _id: _id }, function(err, user) {
	        Profile.findOne({ id_user: _id }, function(err, profile) {
	        	Alamat.findOne({ id_user: _id }, function(err, alamat){
	        		if(user.role == "seller"){
		        		console.log(user);
		    	        res.render('sellerprofile', {users: user, profile_seller: profile, alamat_seller: alamat, layout: 'layout_user'});
		        	}else if(user.role == "buyer"){
		        		console.log(user);
		    	        res.render('buyerprofile', {users: user, profile_buyer: profile, alamat_buyer: alamat,  layout: 'layout_user'});
		        	}else{

		        	}
	        	});
	        });
        });
    }
});

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/pesan/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "seller"){
        		console.log(user);
    	        res.render('sellerpesan', {users: user, layout: 'layout_user'});
        	}else if(user.role == "buyer"){
        		console.log(user);
    	        res.render('buyerpesan', {users: user, layout: 'layout_user'});
        	}else{

        	}
        });
    }	
});

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/pemesanan/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "seller"){
        		console.log(user);
    	        res.render('sellerpemesanan', {users: user, layout: 'layout_user'});
        	}else if(user.role == "buyer"){
        		console.log(user);
    	        res.render('buyerpemesanan', {users: user, layout: 'layout_user'});
        	}else{

        	}
        });
    }	
});
//yang ditampilkan adalah profile seller dengan semua element di dienable.
//akses edit profile seller : masalah adalah ketika user hanya mengetikkan /seller/profile/update di url
//option satu redirect ke /seller/profile/update/:username
router.get('/pengaturan/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
		User.findOne({ _id: _id }, function(err, user) {
	        Profile.findOne({ id_user: _id }, function(err, profile) {
	        	Alamat.findOne({ id_user: _id }, function(err, alamat){
	        		if(user.role == "seller"){
		        		console.log(user);
		    	        res.render('sellerpengaturan', {users: user, profile_seller: profile, alamat_seller: alamat, layout: 'layout_user'});
		        	}else if(user.role == "buyer"){
		        		console.log(user);
		    	        res.render('buyerpengaturan', {users: user, profile_buyer: profile, alamat_buyer: alamat,  layout: 'layout_user'});
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
router.post('/pengaturan/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	var nama_seller = req.body.nama_seller;
	var no_telp_seller = req.body.no_telp_seller;
	var jalan = req.body.jalan;
	var kota = req.body.kota;
	var kabupaten = req.body.kabupaten;
	var kecamatan = req.body.kecamatan;
	var provinsi = req.body.provinsi;
	var kode_pos = req.body.kode_pos;

	var profileup = new Profile({
		id_user: _id, 
		nama_seller: nama_seller,
		no_telp_seller: no_telp_seller		    
	});
	var alamatup = new Alamat({
		id_user: _id,
		"alamat_seller.jalan": jalan,
		"alamat_seller.kota": kota,
		"alamat_seller.kabupaten": kabupaten,
		"alamat_seller.kecamatan": kecamatan,
		"alamat_seller.provinsi": provinsi,
		"alamat_seller.kode_pos": kode_pos
	});
	
	Profile.findOneAndUpdate({ id_user: _id }, profileup, function(err) {  
		if (err) {
			console.log(err);
		}
		else {
			console.log('berhasil menyimpan');
		}
	});
	Alamat.findOneAndUpdate({ id_user: _id }, alamatup, function(err) {  
		if (err) {
			console.log(err);
		}
		else {
			console.log('berhasil menyimpan');
		}
	});
	return res.redirect('/seller/pengaturan/'+_id);	
	req.flash('success_msg', 'You are registered and can now login');
});

//akses list product sellers :
//option satu
router.get('/product/list/:id_user', ensureAuthenticated, function(req, res, next){
	var _id = req.params.id_user;
	User.findOne({ _id: _id }, function(err, user) {
		Product.find({id_User: _id}).sort({'created_at': 1}).exec(function(err, product){
	      	if(user.role == "seller"){
		        if(!err) {
		        	res.render('sellerlistproduct', {users: user, products: product, layout: 'layout_user'});
		      	} else {
		        	return res.render('500');
		      	}
		    }else if(user.role == "buyer"){

		    }else{

		    }	      	
	    });
    });
});

//untuk menampilkan halaman input barang pada sisi seller
router.get('/product/input/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	User.findOne({ _id: _id }, function(err, user) {
		if(user.role == "seller"){
		    if(!err) {
		    	res.render('sellerinputproduct', {users: user, layout: 'layout_user'});
		    } else {
		       	return res.render('500');
		    }
		}else if(user.role == "buyer"){

		}else{

		}		
    });
});

//untuk menginputkan barang pada table products
router.post('/product/input/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var name_product = req.body.name_product;
	var category_product = req.body.category_product;
	var price_product = req.body.price_product;
	var entity_product = req.body.entity_product;
	var description_product = req.body.description_product;
	var picture_product = req.body.picture_product;
	var created_at = new Date();

	// Validation
	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
	req.checkBody('entity_product', 'Stock Barang is required').notEmpty();
	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
	req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('sellerinputproduct',{
			errors: errors,
			layout: 'layout_user'
		});
	} else {
	    var product = new Product({
		    name_product: name_product,
		    id_User: id_user,
		    category_product: category_product,
		    price_product: price_product,
		    entity_product: entity_product,
		    description_product: description_product,
		    picture_product: picture_product,
		    created_at: created_at
		});
		User.findOne({ _id: id_user }, function(err, user) {
			if(user.role == "seller"){
			    if(!err) {
			    	Product.create(product, function(err) {  
					    if (err) {
					        console.log(err);
					    }
					    else {
					        console.log('berhasil menyimpan');
					    }
					});
					return res.redirect('/seller/product/list/'+ id_user);
					req.flash('success_msg', 'You are registered and can now login');					
			    } else {
			       	return res.render('500');
			    }
			}else if(user.role == "buyer"){

			}else{

			}		
	    });		
	}
});

router.get('/product/update/:id_product/:id_user', ensureAuthenticated, function (req, res) {
	var id_product = req.params.id_product;
	var id_user = req.params.id_user;
    if (id_product) {
        User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "seller"){
			    if(!err) {
			    	Product.findOne({ _id: id_product}, function(err, product) {
						res.render('sellerupdateproduct', {products: product, users: user, layout: 'layout_user'});
				    });					
			    } else {
			       	return res.render('500');
			    }
			}else if(user.role == "buyer"){

			}else{

			}
        });
    }
});

router.post('/product/update/:id_product/:id_user', ensureAuthenticated, function(req, res){
	var id_product = req.params.id_product;
	var id_user = req.params.id_user;

	var name_product = req.body.name_product;
	var category_product = req.body.category_product;
	var price_product = req.body.price_product;
	var entity_product = req.body.entity_product;
	var description_product = req.body.description_product;
	var picture_product = req.body.picture_product;
	var created_at = new Date();

	// Validation
	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
	req.checkBody('entity_product', 'Stock Barang is required').notEmpty();
	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
	req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

    if (id_product) {
    	var product = new Product({
		    name_product: name_product,
		    id_User: id_user,
		    category_product: category_product,
		    price_product: price_product,
		    entity_product: entity_product,
		    description_product: description_product,
		    picture_product: picture_product,
		    created_at: created_at
		});
		User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "seller"){
			    if(!err) {
			    	Product.update({_id : id_product}, {$set: product}, function(err, product) {
			    		if(err){
			    			console.log(err);
			    		}
			        	console.log(id_product);
			            console.log(product);
			            return res.redirect('/seller/product/list/'+id_user);
			        });	
			    } else {
			       	return res.render('500');
			    }
			}else if(user.role == "buyer"){

			}else{

			}
        });
    }
});

router.get('/product/delete/:id_product/:id_user', ensureAuthenticated, function(req, res){
	var id_product = req.params.id_product;
	var id_user = req.params.id_user;
	if (id_product) {
		User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "seller"){
			    if(!err) {
			    	Product.remove({_id : id_product}, function(err) {
			        	if(!err) {
				          	console.log('Removed Product');
				          	return res.redirect('/seller/product/list/'+id_user);
				        } else {
				          	res.statusCode = 500;
				          	console.log('Internal error(%d): %s',res.statusCode,err.message);
				         	return res.send({ error: 'Server error' });
				        }
			        });		
			    } else {
			       	return res.render('500');
			    }
			}else if(user.role == "buyer"){

			}else{

			}
        });
    }
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


module.exports = router;