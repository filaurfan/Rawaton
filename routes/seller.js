var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'public/uploads'});
var uploadproduct = upload.single('picture_product');
var updateproduct = upload.single('update_picture_product');
var uploadprofile = upload.single('picture_profile');
var fs = require('fs');

var Product = require('../models/product');
var User = require('../models/users');
var Profile = require('../models/usersprofile');
var Alamat = require('../models/usersalamat');
var Cart = require('../models/cart');
var CartItem = require('../models/cartitem');
var AlamatPengiriman = require('../models/cartalamat');
var Message = require('../models/message');

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/dashboard/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "seller"){
        		console.log(user);
    	        return res.render('sellerdashboard', {users: user, layout: 'layout_user'});
        	}else if(user.role == "buyer"){
        		console.log(user);
    	        return res.render('buyerdashboard', {users: user, layout: 'layout_buyer'});
        	}else{

        	}
        });
    }	
});

router.get('/profile/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	User.findOne({ _id: _id }, function(err, user) {
	    Profile.findOne({ id_user: user._id }, function(err, profile) {
	       	Alamat.findOne({ id_user: user._id }, function(err, alamat){
	        	if(user.role == "seller"){
		        	console.log(user);
		    	    return res.render('sellerprofile', {users: user, profile_seller: profile, alamat_seller: alamat, layout: 'layout_user'});
		       	}else if(user.role == "buyer"){
		        	console.log(user);
		    	    return res.render('buyerprofile', {users: user, profile_buyer: profile, alamat_buyer: alamat,  layout: 'layout_buyer'});
		       	}else{

		       	}
	        });
	    });
    });
});

router.get('/pengaturan/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
		User.findOne({ _id: _id }, function(err, user) {
	        Profile.findOne({ id_user: user._id }, function(err, profile) {
	        	Alamat.findOne({ id_user: user._id }, function(err, alamat){
	        		if(user.role == "seller"){
		        		console.log(user);
		    	        return res.render('sellerpengaturan', {users: user, profile_seller: profile, alamat_seller: alamat, layout: 'layout_user'});
		        	}else if(user.role == "buyer"){
		        		console.log(user);
		    	        return res.render('buyerpengaturan', {users: user, profile_buyer: profile, alamat_buyer: alamat,  layout: 'layout_buyer'});
		        	}else{

		        	}
	        	});
	        });
        });
    }
});

//masalah ada pada database alamat
router.post('/pengaturan/:id_user', uploadprofile, ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	var newnama_seller = req.body.nama_seller;
	var newno_telp_seller = req.body.no_telp_seller;
	var newjalan = req.body.jalan;
	var newkota = req.body.kota;
	var newkabupaten = req.body.kabupaten;
	var newkecamatan = req.body.kecamatan;
	var newprovinsi = req.body.provinsi;
	var newkode_pos = req.body.kode_pos;
	var newgambaruser = req.file.originalname;

	var tmp_path = req.file.path;
	var target_path = 'public/uploads/' + req.file.originalname;
	fs.renameSync(tmp_path, target_path);

	User.findOne({ _id: _id}, function(err, user){
		if (user.role == "seller") {
			var newnama_toko = req.body.nama_toko;
			var newno_telp_kantor = req.body.no_telp_kantor;
			Profile.findOne({id_user: _id}, function(err, profile){
				if (!err) {
					Profile.update({id_user : _id}, { $set: {
						gambar_user: newgambaruser,
						nama_user: newnama_seller, 
						no_telp_user: newno_telp_seller
					}}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("you are profile update now");
					});
				}
			});
			Alamat.findOne({id_user: _id}, function(err, alamat){
				if (!err) {
					Alamat.update({_id : alamat._id}, { $set: {
						no_telp_kantor: newno_telp_kantor,
						nama_toko: newnama_toko,
						alamat_jalan: newjalan,
						alamat_kecamatan: newkecamatan,
						alamat_kota: newkota,
						alamat_kabupaten: newkabupaten,
						alamat_provinsi: newprovinsi,
						alamat_kode_pos: newkode_pos
					}}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("you are alamat update now");
					});
				}
			});
			return res.redirect('/seller/profile/'+_id);
			req.flash('success_msg', 'You are registered and can now login');

		}else if(user.role == "buyer"){
			Profile.findOne({id_user: _id}, function(err, profile){
				if (!err) {
					Profile.update({id_user : _id}, { $set: {
						gambar_user: newgambaruser,
						nama_user: newnama_seller, 
						no_telp_user: newno_telp_seller
					}}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("you are profile update now");
					});
				}
			});
			Alamat.findOne({id_user: _id}, function(err, alamat){
				if (!err) {
					Alamat.update({_id : alamat._id}, { $set: {
						alamat_jalan: newjalan,
						alamat_kecamatan: newkecamatan,
						alamat_kota: newkota,
						alamat_kabupaten: newkabupaten,
						alamat_provinsi: newprovinsi,
						alamat_kode_pos: newkode_pos
					}}, function(err) {
						if(err){
							console.log(err);
						}
						console.log("you are alamat update now");
					});
				}
			});
			return res.redirect('/seller/profile/'+_id);
			req.flash('success_msg', 'You are registered and can now login');
		}else{

		}
	});	
});

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/pesan/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "seller"){
        		Message.find({to_id: _id}, function(err, message){
        			if (message) {
        				Profile.findOne({id_user: _id}, function(err, profile){
        					if (profile) {
        						console.log(user);
								return res.render('sellerpesan', {users: user, profile_seller: profile, messages: message, layout: 'layout_user'});
							}
						});
        			}
        		});        		
        	}else if(user.role == "buyer"){
        		Message.find({from_id: _id}, function(err, message){
        			if (message) {
		        		Profile.findOne({id_user: _id}, function(err, profile){
							console.log(user);
							return res.render('buyerpesan', {users: user, profile_buyer: profile, messages: message, layout: 'layout_buyer'});
						});
					}
				});
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
        		Cart.find({id_seller: _id, status: "sudah"}, function(err, cart){
        			if (cart) {
        				Profile.findOne({id_user: _id}, function(err, profile){
		        			console.log(user);
		    	        	return res.render('sellerpemesanan', {users: user, carts: cart, profile_seller: profile, layout: 'layout_user'});
		        		});
        			}
        		});     		
        	}else if(user.role == "buyer"){
        		Cart.find({id_user: _id, status: "sudah"}, function(err, cart){
        			if (cart) {
        				Profile.findOne({id_user: _id}, function(err, profile){
		        			console.log(user);
		    	        	return res.render('buyerpemesanan', {users: user, carts: cart, profile_buyer: profile, layout: 'layout_buyer'});
		        		});
        			}
        		});
        	}else{

        	}
        });
    }	
});

//akses dashboar seller : masalah adalah apa yang di tampilkan di dashboard seller
//option satu jumlah order, permintaan nego
router.get('/listpemesanan/:id_user/:id_cart', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	var id_cart= req.params.id_cart;
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "seller"){
        		Cart.find({_id : id_cart, id_seller: _id}, function(err, cart){
        			if (cart) {
        				CartItem.find({id_cart : id_cart, id_seller: _id}, function(err, item){
        					if (item) {
        						AlamatPengiriman.findOne({id_pembelian: id_cart}, function(err, alamat){
        							if (alamat) {
        								Profile.findOne({id_user: _id}, function(err, profile){
						        			console.log(user);
   		 	        						return res.render('sellerlistpemesanan', {users: user, carts: cart, alamats: alamat, profile_seller: profile, items: item, layout: 'layout_user'});
						        		});
        							}
        						});
        					}
        				});        				
        			}
        		});
        	}else if(user.role == "buyer"){
        		Cart.find({_id : id_cart}, function(err, cart){
        			if (cart) {
        				CartItem.find({id_cart: id_cart}, function(err, item){
        					if (item) {
        						AlamatPengiriman.findOne({id_pembelian: id_cart}, function(err, alamat){
        							if (alamat) {
        								Profile.findOne({id_user: _id}, function(err, profile){
						        			console.log(user);
   		 	        						return res.render('buyerlistpemesanan', {users: user, carts: cart, alamats: alamat, profile_buyer: profile, items: item, layout: 'layout_buyer'});
						        		});
        							}
        						});
        					}
        				});        				
        			}
        		});
        	}else{

        	}
        });
    }	
});

router.get('/product/list/:id_user', ensureAuthenticated, function(req, res, next){
	var _id = req.params.id_user;
	User.findOne({ _id: _id }, function(err, user) {
		Product.find({id_User: _id}).sort({'created_at': 1}).exec(function(err, product){
	      	if(user.role == "seller"){
		        if(!err) {
		        	Profile.findOne({id_user: _id}, function(err, profile){
						console.log(user);
						return res.render('sellerlistproduct', {users: user, profile_seller: profile, products: product, layout: 'layout_user'});
					});
		      	} else {
		        	return res.render('500');
		      	}
		    }else if(user.role == "buyer"){

		    }else{

		    }	      	
	    });
    });
});

router.get('/product/all/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	Product.find().sort({created_at: 1}).exec(function(err, products) {
		if(!err){
			User
		   	.findOne({_id : id_user})
		    .exec(function(err, user) {
		    	return res.render('productall', {products: products, users: user});
		    });
		} else {
		    return res.render('500');
		}
	});
});

router.get('/product/all', function(req, res){
	if(req.isAuthenticated()){
		var id_user = req.session.id_user;
		res.redirect('/seller/product/all/' + id_user);
	} else {
	    Product.find({}).sort({created_at: 1}).exec(function(err, products) {
			return res.render('productall', {products: products});
		});
	}
});

router.get('/product/input/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	User.findOne({ _id: _id }, function(err, user) {
		if(user.role == "seller"){
		    if(!err) {
		    	Profile.findOne({id_user: _id}, function(err, profile){
		        	console.log(user);
		    	    return res.render('sellerinputproduct', {users: user, profile_seller: profile, layout: 'layout_user'});
		        });
		    } else {
		       	return res.render('500');
		    }
		}else if(user.role == "buyer"){

		}else{

		}		
    });
});

//untuk menginputkan barang pada table products
//masalah ada  ketika user tidak mengklik pada combobox category
router.post('/product/input/:id_user', uploadproduct, ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var name_product = req.body.name_product;
	var category_product = req.body.category_product;
	var price_product = req.body.price_product;
	var quantity_product = req.body.quantity_product;
	var description_product = req.body.description_product;
	var picture_product = req.file.originalname;
	var created_at = new Date();

	// Validation
	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
	req.checkBody('quantity_product', 'Stock Barang is required').notEmpty();
	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
	// req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

	var tmp_path = req.file.path;
	var target_path = 'public/uploads/' + req.file.originalname;
	fs.renameSync(tmp_path, target_path);

	// fs.unlinkSync(tmp_path);
	var errors = req.validationErrors();

	if(errors){
		console.log("error boy");
		res.redirect('/seller/product/input/'+id_user);
	} else {
	    var product = new Product({
		    name_product: name_product,
		    id_User: id_user,
		    category_product: category_product,
		    price_product: price_product,
		    quantity_product: quantity_product,
		    description_product: description_product,
		    picture_product: picture_product,
		    created_at: created_at
		});
		User.findOne({ _id: id_user }, function(err, user) {
			if (!err) {
				if(user.role == "seller"){
				    Product.create(product, function(err) {  
						if (err) {
						    console.log(err);
						}
						else {
						    console.log('berhasil menyimpan');
							req.flash('success_msg', 'You are registered and can now login');					
						    return res.redirect('/seller/product/list/'+ id_user);
						}
					});
				}else if(user.role == "buyer"){

				}else{

				}		
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
			    		if (product) {
			    			Profile.findOne({id_user: id_user}, function(err, profile){
					        	console.log(user);
					    	    return res.render('sellerupdateproduct', {users: user, profile_seller: profile, products: product, layout: 'layout_user'});
					        });
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

router.post('/product/update/:id_product/:id_user', updateproduct, ensureAuthenticated, function(req, res){
	var id_product = req.params.id_product;
	var id_user = req.params.id_user;

	var name_product = req.body.name_product;
	var category_product = req.body.category_product;
	var price_product = req.body.price_product;
	var entity_product = req.body.entity_product;
	var description_product = req.body.description_product;
	var picture_product = req.file.originalname;
	var created_at = new Date();

	// Validation
	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
	req.checkBody('entity_product', 'Stock Barang is required').notEmpty();
	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
	// req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

	var tmp_path = req.file.path;
	var target_path = 'public/uploads/' + req.file.originalname;
	fs.renameSync(tmp_path, target_path);

	var errors = req.validationErrors();

	if(errors){
		console.log("error boy");
		res.redirect('/seller/product/update/'+id_product+'/'+id_user);
	} else {
		User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "seller"){
			    if(!err) {
			    	Product.update({_id : id_product}, {$set: {name_product: name_product,
				    id_User: id_user,
				    category_product: category_product,
				    price_product: price_product,
				    entity_product: entity_product,
				    description_product: description_product,
				    picture_product: picture_product,
				    created_at: created_at}}, function(err, product) {
			    		if(err){
			    			console.log(err);
			    		}
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