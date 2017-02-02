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
router.get('/list/:id_user', function(req, res, next){
	var _id = req.params.id_user;
	var tanggal_buat = new Date();
	console.log(_id);
	if (_id) {
        User.findOne({ _id: _id }, function(err, user) {
        	if(user.role == "buyer"){
        		Cart.findOne({ id_user: _id}, function(err, cart){
				    if(cart) {
				    	CartItem.find({ id_cart: cart._id}, function(err, item){
				    		if (!err) {
				    			return res.render('buyerlistcart', {users: user, carts: cart, items: item, layout: 'layout_user'});
				    		}else{
				    			return res.render('500');
				    		}
				    	});
				    } else {
				    	var cart = new Cart({
		      				id_user: _id,
		      				tanggal_buat: tanggal_buat
		      			});
		      			Cart.create(cart ,function(err) {  
							if (err) {
								console.log(err);
							}
							else {
								console.log('berhasil menyimpan');
								res.redirect('/cart/list/'+_id);
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

//untuk menginputkan product ke cart jadi posisi buyer berada di localhost:3000/
//masalah ada ketika penyimpanan ke database
router.post('/add/:id_product/:id_cart/:id_user', function(req, res){
	var id_product = req.params.id_product;
	var id_cart = req.params.id_cart;
	var id_user = req.params.id_user;
	var harga = req.body.harga;
	var tanggal_pesan = new Date();

	User.findOne({ _id: id_user }, function(err, user) {
       	if(user.role == "buyer"){
        	Cart.findOne({ id_user: id_user}, function(err, cart){
				if(cart) {
					var item = new CartItem({
		      			id_cart: id_cart,
		      			id_product: id_product,
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
				} else {
				   
				}
			});
        }else if(user.role == "seller"){

        }else{

        }
    });
});

module.exports = router;