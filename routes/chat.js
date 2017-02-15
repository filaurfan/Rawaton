var express = require('express');
var router = express.Router();
var math = require('mathjs');
var Product = require('../models/product');

var User = require('../models/users');
var Alamat = require('../models/usersalamat');
var Profile = require('../models/usersprofile');

var Cart = require('../models/cart');
var CartItem = require('../models/cartitem');
var Message = require('../models/message');

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

var DumpCart = require('../models/dumpcart');
var DumpCartItem = require('../models/DumpCartItem');

router.post('/update/:id_dumpcart', ensureAuthenticated, function(req, res){
	var id_dumpcart = req.params.id_dumpcart;
	// var total_harga = req.body.total_harga;
	// var harga_nego = req.body.harga_nego;

	// console.log("ini id dump cart"+id_dumpcart);
	// DumpCart.update({_id: id_dumpcart, status: "belum"}, {$set: {total_harga: total_harga}}, function(err, dump){
	// 	if (!err) {
	// 		console.log("berhasil update boy"+dump);
	// 	}
	// });
	// DumpCartItem.update({_id: id_dumpitem}, {$set: {harga_nego: harga_nego}}, function(err, dump){
	// 	if (!err) {
	// 		console.log("berhasil update boy"+dump);
	// 	}
	// });
	return console.log("berhasil berhasil update");
});

router.get('/nego/:id_user/:id_seller/:id_dumpcart', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var id_seller = req.params.id_seller;
	var id_dumpcart = req.session.id_dumpcart;

	var id_xyz = req.session.id_user;
	User.findOne({ _id: id_xyz }, function(err, user) {
		if (!err) {
			if(user.role == "buyer"){
        		Message.findOne({id_cart: id_dumpcart}, function(err, message){ 
        				if (!message) {
        					Profile.findOne({id_user: id_user}, function(err, profile){
        						var message = new Message({
						      		from_id: id_user,
						      		from_name: profile.nama_user,
						      		to_id: id_seller,
						      		id_cart: id_dumpcart,
						      		tanggal_message : new Date(),
						      		status_nego : "aktif"
						      	});
						      	Message.create(message ,function(err) {  
									if (!err) {
										console.log('berhasil menyimpan');
										Message.findOne({ id_cart: id_dumpcart, status_nego: "aktif"}, function(err, message){
											if (message) {
												var id_message = message._id;
												req.session.id_message = message._id;
												return res.redirect('/chat/nego/'+id_user+'/'+id_seller+'/'+id_dumpcart+'/'+id_message);
											}
										});
									}
									else {
										console.log(err);
									}
								});
        					});
        				}else if (message) {
        					var id_message = message._id;
        					req.session.id_message = message._id;
        					console.log(user);
							return res.redirect('/chat/nego/'+id_user+'/'+id_seller+'/'+id_dumpcart+'/'+id_message);
        				}else{

        				}
        		});
			    
        	}else if(user.role == "seller"){

        	}else{

        	}
		}        	
    });
});

router.get('/nego/:id_user/:id_seller/:id_dumpcart/:id_message', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var id_seller = req.params.id_seller;
	var id_dumpcart = req.params.id_dumpcart;
	var id_message = req.params.id_message;

	var id_xyz = req.session.id_user;
	User.findOne({ _id: id_xyz }, function(err, user) {
		if (!err) {
			if(user.role == "buyer"){
        		DumpCart.findOne({ _id: id_dumpcart}, function(err, cart){
				    if(cart) {
				    	DumpCartItem.find({ id_cart: cart._id}, function(err, item){
				    		if (!err) {
				    			Profile.findOne({id_user: id_xyz}, function(err, profile){
				          			if (!err) {
				          				console.log(user);
				    	        		return res.render('test', {users: user, profile_buyer : profile, carts: cart, items: item,  layout: 'layout_buyer'});
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
        		DumpCart.findOne({ _id: id_dumpcart}, function(err, cart){
				    if(cart) {
				    	DumpCartItem.find({ id_cart: cart._id}, function(err, item){
				    		if (!err) {
				    			Profile.findOne({id_user: id_xyz}, function(err, profile){
				          			if (!err) {
				          				console.log(user);
				    	        		return res.render('test', {users: user, profile_seller : profile, carts: cart, items: item,  layout: 'layout_user'});
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
        	}else{

        	}
		}        	
    });
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;