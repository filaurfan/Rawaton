var express = require('express');
var router = express.Router();
var math = require('mathjs');
var Product = require('../models/product');

var User = require('../models/users');
var Alamat = require('../models/usersalamat');
var Profile = require('../models/usersprofile');

var Cart = require('../models/cart');
var CartItem = require('../models/cartitem');

router.get('/nego/:id_user/:id_cart', ensureAuthenticated, function(req, res){
	
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