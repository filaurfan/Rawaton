var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');

// Get Homepage
router.get('/cart', ensureAuthenticated, function(req, res){
	res.redirect('/seller/cart/list');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
//////////////////////////////////////////////////////////////////////////////////////
router.get('/', function(req, res){
	if(req.isAuthenticated()){
		var username = username;
		return res.redirect('/:username');
	} else {
		Product
		.find({})
		.limit(4)
		.sort({'created_at': -1})
		.exec(function(err, product) {
		    if(!err) {
		       	return res.render('index', {products: product});
		    } else {
		        return res.render('500');
		    }
	    });
	}
	
});
///////////////////////////////////////////////////////////////////////////////////
router.get('/:username', ensureAuthenticated, function(req, res){
	var username = req.params.username;

	Product
	.find({})
	.limit(4)
	.sort({'created_at': -1})
	.exec(function(err, product) {
	    if(!err) {
	    	User
	    	.findOne({username : username})
	    	.exec(function(err, user) {
	    		return res.render('index', {products: product, users: user});
	    	});
	       	
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/product/:id', function(req, res){
	var id = req.params.id;
	var new_product = Product.find().sort({created_at: 1}).limit(4);
	Product.findOne({ _id: id }, function(err, product) {
	    if(!err){
	    	return res.render('preview', {products: new_product, product : product});
	    }	       		
	});
});

// router.post('/product/:id', ensureAuthenticated, function(req, res){
// 	var id_product = req.params.id;
// 	res.redirect('/seller/cart/add/' + id_product);
// });

router.get('/about', function(req, res){
	res.render('about');
});

router.get('/contact', function(req, res){
	res.render('contact');
});

router.get('/news', function(req, res){
	res.render('news');
});

router.get('/preview', function(req, res){
	res.render('preview');
});

router.get('/delivery', function(req, res){
	res.render('delivery');
});

module.exports = router;