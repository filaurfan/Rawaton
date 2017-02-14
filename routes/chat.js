var express = require('express');
var router = express.Router();
var math = require('mathjs');
var Product = require('../models/product');

var User = require('../models/users');
var Alamat = require('../models/usersalamat');
var Profile = require('../models/usersprofile');

var Cart = require('../models/cart');
var CartItem = require('../models/cartitem');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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

        	}else{

        	}
		}        	
    });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
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