var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');

// Get Homepage
router.get('/cart', ensureAuthenticated, function(req, res){
	var username = req.body.username;
	User.findOne({ username: username}, function(err, user){
		var id = user._id;
		res.redirect('/cart/list/'+ id);
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

router.get('/', function(req, res){
	if(req.isAuthenticated()){
		var username = req.body.username;
		User.findOne({ username: username}, function(err, user){
			var id = user._id;
			res.redirect('/' + id);
		});
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

router.get('/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;

	Product
	.find({})
	.limit(4)
	.sort({'created_at': -1})
	.exec(function(err, product) {
	    if(!err) {
	    	User
	    	.findOne({_id : id_user})
	    	.exec(function(err, user) {
	    		return res.render('index', {products: product, users: user});
	    	});
	       	
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/product/:id_product', function(req, res){
	var id = req.params.id_product;
	var new_product = Product.find().sort({created_at: 1}).limit(4);
	Product.findOne({ _id: id }, function(err, product) {
	    if(!err){
	    	return res.render('preview', {products: new_product, product : product});
	    }	       		
	});
});

router.get('/product/view/:id_product/:id_user', function(req, res){
	var id_product = req.params.id_product;
	var new_product = Product.find().sort({created_at: 1}).limit(4);
	Product.findOne({ _id: id_product }, function(err, product) {
	    if(!err){
	    	return res.render('preview', {products: new_product, product : product});
	    }	       		
	});
});


// router.post('/product/:id_product', ensureAuthenticated, function(req, res){
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