var express = require('express');
var router = express.Router();

var Product = require('../models/product');

// // Get Homepage
// router.get('/', ensureAuthenticated, function(req, res){
// 	res.render('index');
// });

// function ensureAuthenticated(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
// 		res.redirect('/input');
// 	}
// }

router.get('/', function(req, res){
	Product.find(function(err, product) {
	    if(!err) {
	       	return res.render('index', {products: product});
	    } else {
	        return res.render('500');
	    }
    });
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