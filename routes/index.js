var express = require('express');
var router = express.Router();

var Product = require('../models/product');

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

router.get('/', function(req, res){
	Product.find().sort({created_at: 1}).limit(4, function(err, product) {
	    if(!err) {
	       	return res.render('index', {products: product});
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/product/:id', function(req, res){
	var new_product = Product.find().sort({created_at: 1}).limit(4);
	Product.findOne({_id : id}, function(err, product) {
	    if(!err){
	    	return res.render('preview', {products: new_product, product : product});
	    }	       		
	});
});

router.post('/product/:id', ensureAuthenticated, function(req, res){
	var id_product = req.params.id;
	res.redirect('/seller/cart/add/' + id_product);
});

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