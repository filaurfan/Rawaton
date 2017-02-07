var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');
var Alamat = require('../models/usersalamat');
var Profile = require('../models/usersprofile');
var Cart = require('../models/cart');
var CartItem = require('../models/cartitem');

//akses list cart buyer :
//option satu
router.get('/list/:id_user', ensureAuthenticated, function(req, res, next){
	var _id = req.params.id_user;
	var id_cart = req.session.id_cart;
	var tanggal_buat = new Date();
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "buyer"){
        		Cart.findOne({ _id: id_cart}, function(err, cart){
				    if(cart) {
				    	CartItem.find({ id_cart: cart._id}, function(err, item){
				    		if (!err) {
				    			return res.render('buyerlistcart', {users: user, carts: cart, items: item, layout: 'layout_buyer'});
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
        });
    }
});

//untuk menginputkan product ke cart jadi posisi buyer berada di localhost:3000/
//masalah ada ketika penyimpanan ke database
router.post('/add/:id_product', ensureAuthenticated, function(req, res){
	var id_product = req.params.id_product;
	var id_cart = req.session.id_cart;
	var id_user = req.session.id_user;
	var harga = req.body.harga;
	var jumlah = req.body.jumlah;
	var tanggal_pesan = new Date();

	User.findOne({ _id: id_user }, function(err, user) {
       	if(user.role == "buyer"){
        	Product.findOne({ _id : id_product}, function(err, product){
				if(product) {
					Alamat.findOne({ id_user: product.id_User }, function(err, alamat){
						if (alamat) {
							var item = new CartItem({
				      			id_cart: id_cart,
				      			id_product: id_product,
				      			nama_product: product.name_product,
				      			nama_seller: alamat.nama_toko,
				      			gambar_item: product.picture_product,
				      			jumlah: jumlah,
				      			harga_nego: harga,
				      			tanggal_pesan: tanggal_pesan
				      		});
						    CartItem.create(item, function(err){
						    	if (!err) {
						    		res.redirect('/product/'+id_product+'/'+id_user);
						    	}else{
						    		return res.render('500');
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

router.get('/delete/:id_cartitem', ensureAuthenticated, function(req, res){
	var id_cartitem = req.params.id_cartitem;
	var id_user = req.session.id_user;
	if (id_cartitem) {
		User.findOne({ _id: id_user }, function(err, user) {
        	if(user.role == "buyer"){
			    if(!err) {
			    	CartItem.remove({_id : id_cartitem}, function(err) {
			        	if(!err) {
				          	console.log('Removed Product');
				          	return res.redirect('/cart/list/'+id_user);
				        } else {
				          	res.statusCode = 500;
				          	console.log('Internal error(%d): %s',res.statusCode,err.message);
				         	return res.send({ error: 'Server error' });
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