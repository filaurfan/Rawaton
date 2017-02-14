var express = require('express');
var router = express.Router();
var math = require('mathjs');
var Product = require('../models/product');

var User = require('../models/users');
var Alamat = require('../models/usersalamat');
var Profile = require('../models/usersprofile');

var Cart = require('../models/cart');
var CartItem = require('../models/cartitem');
var AlamatPengiriman = require('../models/cartalamat');

var DumpCart = require('../models/dumpcart');
var DumpCartItem = require('../models/DumpCartItem');

router.get('/nego/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var id_cart = req.session.id_cart;
	User.findOne({ _id: id_user }, function(err, user) {
		if (!err) {
			if(user.role == "buyer"){
        		Cart.findOne({ _id: id_cart}, function(err, cart){
				    if(cart) {
				    	CartItem.find({ id_cart: cart._id}, function(err, item){
				    		if (!err) {
				    			Profile.findOne({id_user: id_user}, function(err, profile){
				          			if (!err) {
				          				console.log(user);
				    	        		return res.render('buyerdetailnego', {users: user, profile_buyer : profile, carts: cart, items: item,  layout: 'layout_buyer'});
				          			}
				          		});
				    		}else{
				    			return res.render('500');
				    		}
				    	});

				    } else {
				    	console.log("Keranjang belum ada");
				    }
			    });
        	}else if(user.role == "seller"){

        	}else{

        	}
		}        	
    });
});

router.post('/konfirmasipembayaran/:id_user/:id_cart', ensureAuthenticated, function(req, res){
	var id_seller = req.params.id_user;
	var id_cart = req.params.id_cart;
	var tanggal_pembayaran = req.body.tanggal_pembayaran;
	var status_pembayaran = req.body.status_pembayaran;

	Cart.update({ _id: id_cart, id_seller: id_seller}, {$set:{ 
		tanggal_pembayaran: tanggal_pembayaran, 
		status_pembayaran: status_pembayaran}
	}, function(err){
		if (!err) {
			res.redirect('/seller/listpemesanan/'+id_seller+'/'+id_cart);
		}
	});
});

router.post('/konfirmasipengiriman/:id_user/:id_cart', ensureAuthenticated, function(req, res){
	var id_seller = req.params.id_user;
	var id_cart = req.params.id_cart;
	var tanggal_pengiriman = req.body.tanggal_pengiriman;
	var status_pengiriman = req.body.status_pengiriman;

	Cart.update({ _id: id_cart, id_seller: id_seller}, {$set:{ 
		tanggal_pengiriman: tanggal_pengiriman, 
		status_pengiriman: status_pengiriman}
	}, function(err){
		if (!err) {
			res.redirect('/seller/listpemesanan/'+id_seller+'/'+id_cart);
		}
	});
});

router.get('/pembayaran/:id_user', ensureAuthenticated, function(req, res, next){
	var id_buyer = req.params.id_user;
	var id_cart = req.session.id_cart;
	console.log(id_buyer);
	if (id_buyer) {
        User.findOne({ _id: id_buyer }, function(err, user) {
        	if(user.role == "buyer"){
        		Profile.findOne({id_user: id_buyer}, function(err, profile){
          			if (!err) {
          				console.log(user);
    	        		res.render('cartpembayaran', {users: user, profiles_buyer: profile,  layout: 'layout_buyer'});
          			}
          		});
        	}else if(user.role == "seller"){
        		
        	}else{

        	}
        });
    }	
});

router.post('/pembayaran/:id_user', ensureAuthenticated, function(req, res, next){
	var id_buyer = req.params.id_user;
	var id_cart = req.session.id_cart;
	var tanggal_selesai = new Date();
	var tanggal_pembayaran = new Date();
	console.log(id_buyer);
	if (id_buyer) {
        User.findOne({ _id: id_buyer }, function(err, user) {
        	if(user.role == "buyer"){
        		Cart.update({_id: id_cart}, {$set: {
        			status : "sudah", 
        			tanggal_selesai: tanggal_selesai,
        			status_pembayaran: "belum di konfirmasi",
				    tanggal_pembayaran: tanggal_pembayaran
        			}
        		}, function(err){
					if(!err){
						delete req.session.id_cart;

					}
				});
        		Cart.findOne({ status: "belum", id_user: id_buyer}, function(err, cart){
					if(cart) {
						req.session.id_cart = cart._id;
						res.redirect('/seller/pemesanan/'+id_buyer);
					} else if (!cart) {
						var cart = new Cart({
				      		id_user: id_buyer,
				      		tanggal_buat: new Date(),
				      		status: "belum",
				      		total_harga : 0
				      	});
				      	Cart.create(cart ,function(err) {  
							if (!err) {
								console.log('berhasil menyimpan');
							}
							else {
								console.log(err);
							}
						});
						Cart.findOne({ id_user: id_buyer, status: "belum"}, function(err, cart2){
							if (cart2) {
								req.session.id_cart = cart2._id;
								res.redirect('/seller/pemesanan/'+id_buyer);
							}
						});
					}else{

					}
				});
        	}else if(user.role == "seller"){
        		
        	}else{

        	}
        });
    }	
});

router.get('/checkout/:id_user', ensureAuthenticated, function(req, res, next){
	var id_user = req.params.id_user;
	var id_cart = req.session.id_cart;
	console.log(id_user);
	if (id_user) {
        User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "buyer"){
          		Alamat.findOne({ id_user: id_user }, function(err, alamat){
          			if (!err) {
          				Profile.findOne({id_user: id_user}, function(err, profile){
          					if (!err) {
          						console.log(user);
    	        				res.render('cartalamatpemesan', {users: user, alamats: alamat, profiles_buyer: profile, layout: 'layout_buyer'});
          					}
          				});
          			}
          		});
        	}else if(user.role == "seller"){
        		
        	}else{

        	}
        });
    }	
});

router.post('/checkout/:id_user', ensureAuthenticated, function(req, res, next){
	var id_buyer = req.params.id_user;
	var id_cart = req.session.id_cart;
	var nama_penerima = req.body.nama_penerima;
	var no_telp_penerima = req.body.no_telp_penerima;
	var alamat_jalan_penerima = req.body.alamat_jalan_penerima;
	var alamat_kecamatan_penerima = req.body.alamat_kecamatan_penerima;
	var alamat_kota_penerima = req.body.alamat_kota_penerima;
	var alamat_kabupaten_penerima = req.body.alamat_kabupaten_penerima;
	var alamat_provinsi_penerima = req.body.alamat_provinsi_penerima;
	var alamat_kode_pos_penerima = req.body.alamat_kode_pos_penerima;

	req.checkBody('nama_penerima', 'nama_penerima is required').notEmpty();
	req.checkBody('no_telp_penerima', 'no_telp_penerima is required').notEmpty();
	req.checkBody('alamat_jalan_penerima', 'alamat_jalan_penerima is not valid').notEmpty();
	req.checkBody('alamat_kecamatan_penerima', 'alamat_kecamatan_penerima is required').notEmpty();
	req.checkBody('alamat_kota_penerima', 'alamat_kota_penerima is required').notEmpty();
	req.checkBody('alamat_kabupaten_penerima', 'alamat_kabupaten_penerima do not match').notEmpty();
	req.checkBody('alamat_provinsi_penerima', 'alamat_provinsi_penerima is required').notEmpty();
	req.checkBody('alamat_kode_pos_penerima', 'alamat_kode_pos_penerima do not match').notEmpty();

	var errors = req.validationErrors();

	console.log(id_buyer);
	if(errors){
		console.log("error boy");
		res.redirect('/cart/checkout/'+id_buyer);
	} else {
        User.findOne({ _id: id_buyer }, function(err, user) {
        	if(user.role == "buyer"){
          		var alamatpengiriman = new AlamatPengiriman({
					id_pembelian: id_cart,
					id_buyer: id_buyer,
					nama_penerima: nama_penerima,
					no_telp_penerima: no_telp_penerima,
					alamat_jalan_penerima: alamat_jalan_penerima,
					alamat_kecamatan_penerima: alamat_kecamatan_penerima,
					alamat_kota_penerima: alamat_kota_penerima,
					alamat_kabupaten_penerima: alamat_kabupaten_penerima,
					alamat_provinsi_penerima: alamat_provinsi_penerima,
					alamat_kode_pos_penerima: alamat_kode_pos_penerima
				});
				AlamatPengiriman.create(alamatpengiriman, function(err){
					if (!err) {
						console.log("berhasil menyimpan alamat pengiriman");
					}else{
						console.log(err);
						res.redirect('/cart/checkout/'+id_buyer);
					}
				});
				Cart.update({ _id: id_cart }, { $set: {status_pengiriman: "belum di konfirmasi", tanggal_pengiriman: ""}}, function(err){
					if (!err) {
						res.redirect('/cart/pembayaran/'+id_buyer);
					}else{
						console.log(err);
						res.redirect('/cart/checkout/'+id_buyer);
					}
				});
        	}else if(user.role == "seller"){
        		
        	}else{

        	}
        });
    }	
});

//akses list cart buyer :
//option satu
router.get('/list/:id_user', ensureAuthenticated, function(req, res){
	var _id = req.params.id_user;
	var id_cart = req.session.id_cart;
	var tanggal_buat = new Date();
	var id_dumpcart = req.session.id_dumpcart;

	console.log("session dump cart di list"+id_dumpcart);

	User.findOne({ _id: _id }, function(err, user) {
		if (user) {
			if(user.role == "buyer"){
	        	Cart.findOne({ _id: id_cart}, function(err, cart){
					if(cart) {
						CartItem.find({ id_cart: cart._id}, function(err, item){
							if (!err) {
								Profile.findOne({id_user: _id}, function(err, profile){
								    if (!err) {
								    	DumpCart.findOne({_id : id_dumpcart}, function(err, dumpcart){
									    	if (!err) {
										    	DumpCartItem.find({id_cart: dumpcart._id}, function(err, dumpitem){
										    		if (!err) {
		    		console.log(user);
		    	    return res.render('buyerlistcart', {users: user, carts: cart, items: item, dumpcarts: dumpcart, dumpitems: dumpitem, profile_buyer: profile, layout: 'layout_buyer'});
								    				}
								    			});
								    		}
								    	});
		          					}
		          				});
				    		}else{
				    			return res.render('500');
				    		}
				    	});
				    } else {
				    	console.log("Keranjang belum ada");
				    }
			    });
        	}else if(user.role == "seller"){

        	}else{

        	}
		}        	
    });
});

//untuk menginputkan product ke cart jadi posisi buyer berada di localhost:3000/
//masalah ada ketika penyimpanan ke database
router.post('/add/:id_product', ensureAuthenticated, function(req, res){
	var id_product = req.params.id_product;
	var id_cart = req.session.id_cart;
	var id_dumpcart = req.session.id_dumpcart;
	var id_user = req.session.id_user;
	var harga = req.body.harga;
	var jumlah = req.body.jumlah;
	var tanggal_pesan = new Date();
	var hargaakhir = math.multiply(harga, jumlah);

	User.findOne({ _id: id_user }, function(err, user) {
       	if(user.role == "buyer"){
        	Product.findOne({ _id: id_product}, function(err, product){
				if(product) {
					Alamat.findOne({ id_user: product.id_User }, function(err, alamat){
						if (alamat) {
							console.log("Session dumpcart "+id_dumpcart);
							DumpCart.findOne({_id: id_dumpcart}, function(err, dumpcart){
								if (dumpcart) {
									var total = dumpcart.total_harga + hargaakhir;
									DumpCart.update({ _id: id_dumpcart}, {$set: {total_harga : total, id_seller: product.id_User}}, function(err){
						      			if(err){
							    			console.log(err);
							    		}
						      		});
						      	
								    var dumpitem = new DumpCartItem({
						      			id_cart: id_dumpcart,
						      			id_product: id_product,
						      			id_seller: product.id_User,
						      			nama_product: product.name_product,
						      			nama_seller: alamat.nama_toko,
						      			gambar_item: product.picture_product,
						      			jumlah: jumlah,
						      			harga_nego: hargaakhir,
						      			tanggal_pesan: tanggal_pesan
						      		});
								    DumpCartItem.create(dumpitem, function(err, dumpitem){
								    	if (!err) {
								    		req.session.id_dumpitem = dumpitem._id;
								    		console.log("Berhasil mengadd dumpitem 0 ="+req.session.id_dumpitem);
								    		Cart.findOne({_id : id_cart}, function(err, cart){
												if (cart) {
													var total = cart.total_harga + hargaakhir;
													console.log("Berhasil mengadd dumpitem 1 ="+req.session.id_dumpitem);
													Cart.update({_id: id_cart}, {$set: {total_harga : total, id_seller: product.id_User}}, function(err){
										      			if(err){
											    			console.log(err);
											    		}
										      		});	
										      		console.log("Berhasil mengadd dumpitem 2 ="+req.session.id_dumpitem);
										      		var item = new CartItem({
										      			id_cart: id_cart,
										      			id_dumpitem : req.session.id_dumpitem,
										      			id_product: id_product,
										      			id_seller: product.id_User,
										      			nama_product: product.name_product,
										      			nama_seller: alamat.nama_toko,
										      			gambar_item: product.picture_product,
										      			jumlah: jumlah,
										      			harga_nego: hargaakhir,
										      			tanggal_pesan: tanggal_pesan
										      		});				
												    CartItem.create(item, function(err){
												    	if (!err) {
												    		res.redirect('/cart/list/'+id_user);
												    		console.log("Berhasil mengadd item");
												    	}else{
												    		return res.render('500');
												    	}
												    });					      		
												}
											});
								    	}else{
								    		return res.render('500');
								    	}
								    });
								}
							});
						}
					});
				}
			});
        }else if(user.role == "seller"){

        }else{

        }
    });
});

router.get('/delete/:id_cartitem/:id_dumpitem', ensureAuthenticated, function(req, res, next){
	var id_cartitem = req.params.id_cartitem;
	var id_dumpcartitem = req.params.id_dumpitem;
	var id_dumpcart = req.session.id_dumpcart;
	var id_cart = req.session.id_cart;
	var id_user = req.session.id_user;

	if (id_cartitem) {
		User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "buyer"){
			    if(!err) {
			    	Cart.findOne({_id : id_cart}, function(err, cart){
			    		if(!err) {
			    			CartItem.findOne({_id: id_cartitem}, function(err, item){
			    				if(!err){
			    					var total = cart.total_harga - item.harga_nego;
									Cart.update({_id: id_cart}, {$set: {total_harga : total}}, function(err){
								      	if(!err){
									    	console.log("harga total broo"+total);
									    }
								    });
								    CartItem.remove({_id : id_cartitem}, function(err) {
							        	if(!err) {
								          	console.log('Removed Product1');
								          	// return next();
								        } else {
								          	res.statusCode = 500;
								          	console.log('Internal error(%d): %s',res.statusCode,err.message);
								         	return res.send({ error: 'Server error' });
								        }
							        });
			    				}
			    			});
			    		}
					});
					DumpCart.findOne({_id : id_dumpcart}, function(err, dumpcart){
			    		if(!err) {
			    			DumpCartItem.findOne({_id: id_dumpcartitem}, function(err, dumpitem){
			    				if(!err){
			    					var total = dumpcart.total_harga - dumpitem.harga_nego;
									DumpCart.update({_id: id_dumpcart}, {$set: {total_harga : total}}, function(err){
								      	if(err){
									    	console.log(err);
									    }
								    });
								    DumpCartItem.remove({_id : id_dumpcartitem}, function(err) {
							        	if(!err) {
								          	console.log('Removed Dump Product');
								          	return res.redirect('/cart/list/'+id_user);
								        } else {
								          	res.statusCode = 500;
								          	console.log('Internal error(%d): %s',res.statusCode,err.message);
								         	return res.send({ error: 'Server error' });
								        }
							        });
			    				}
			    			});
			    		}
					});			    		
			    } else {
			       	return res.render('500');
			    }
			}else if(user.role == "seller"){

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