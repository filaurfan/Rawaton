var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');

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

router.get('/', function(req, res){
	if(req.isAuthenticated()){
		var id_user = req.session.id;
		res.redirect('/' + id_user);
	} else {
		Product
		.find({})
		.limit(8)
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

router.get('/category/:otomotif/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var category = req.params.otomotif;
	Product
	.find({category_product : category})
	.sort({'created_at': -1})
	.exec(function(err, product) {
	    if(!err) {
	    	User
	    	.findOne({_id : id_user})
	    	.exec(function(err, user) {
	    		return res.render('productotomotif', {products: product, users: user});
	    	});
	       	
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/category/:otomotif', function(req, res){
	var category = req.params.otomotif;
	if(req.isAuthenticated()){
		var id_user = req.body.id;
		res.redirect('/category/otomotif/' + id_user);
	} else {
		Product
		.find({category_product : category})
		.sort({'created_at': -1})
		.exec(function(err, product) {
		    if(!err) {
		       	return res.render('productotomotif', {products: product});
		    } else {
		        return res.render('500');
		    }
	    });
	}
});

router.get('/category/:smartphone/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var category = req.params.smartphone;
	Product
	.find({category_product : category})
	.sort({'created_at': -1})
	.exec(function(err, product) {
	    if(!err) {
	    	User
	    	.findOne({_id : id_user})
	    	.exec(function(err, user) {
	    		return res.render('productsmartphone', {products: product, users: user});
	    	});
	       	
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/category/:smartphone', function(req, res){
	var category = req.params.smartphone;
	if(req.isAuthenticated()){
		var id_user = req.body.id;
		res.redirect('/category/smartphone/' + id_user);
	} else {
		Product
		.find({category_product: category})
		.sort({'created_at': -1})
		.exec(function(err, product) {
		    if(!err) {
		       	return res.render('productsmartphone', {products: product});
		    } else {
		        return res.render('500');
		    }
	    });
	}
});

router.get('/category/:fashion/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var category = req.params.fashion;
	Product
	.find({category_product : category})
	.sort({'created_at': -1})
	.exec(function(err, product) {
	    if(!err) {
	    	User
	    	.findOne({_id : id_user})
	    	.exec(function(err, user) {
	    		return res.render('productfashion', {products: product, users: user});
	    	});	       	
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/category/:fashion', function(req, res){
	var category = req.params.fashion;
	if(req.isAuthenticated()){
		var id_user = req.body.id;
		res.redirect('/category/fashion/' + id_user);
	} else {
		Product
		.find({category_product: category})
		.sort({'created_at': -1})
		.exec(function(err, product) {
		    if(!err) {
		       	return res.render('productfashion', {products: product});
		    } else {
		        return res.render('500');
		    }
	    });
	}
});

router.get('/product/:id_product/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var id_product = req.params.id_product;
	Product.find().sort({created_at: 1}).limit(4).exec(function(err, products) {
		Product.findOne({ _id: id_product }, function(err, product) {
			if(!err){
				User
		    	.findOne({_id : id_user})
		    	.exec(function(err, user) {
		    		return res.render('preview', {products: products, product : product, users: user});
		    	});
			} else {
			    return res.render('500');
			}	       		
		});
	});
});

router.get('/product/:id_product', function(req, res){
	var id_product = req.params.id_product;
	if(req.isAuthenticated()){
		var id_user = req.body.id;
		res.redirect('/product/'+ id_product +'/' + id_user);
	} else {
	    Product.find().sort({created_at: 1}).limit(4).exec(function(err, products) {
			Product.findOne({ _id: id_product }, function(err, product) {
			    if(!err){
			    	res.render('preview', {products: products, product : product});
			    } else {
			        return res.render('500');
			    }	       		
			});
		});
	}
});



// Get Homepage
router.get('/cart', ensureAuthenticated, function(req, res){
	var id_user = req.body.id;
	res.redirect('/cart/list/'+ id);
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

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;