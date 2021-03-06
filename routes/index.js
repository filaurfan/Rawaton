var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/users');
var SellerProfile = require('../models/usersprofile');
var SellerAlamat = require('../models/usersalamat');
var Cart = require('../models/cart');
var Online = require('../models/online');

var DumpCart = require('../models/dumpcart');
var DumpCartItem = require('../models/DumpCartItem');

router.get('/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;

	Product.find({}).limit(4).sort({'created_at': -1}).exec(function(err, product) {
	    if(!err) {
	    	User.findOne({ _id : id_user }).exec(function(err, user) {
	    		if(!err){
	    			if (user.role == "buyer") {
	    				Cart.findOne({id_user: id_user, status: "belum"}, function(err, cart){
		    				if (cart) {
		    					req.session.id_cart = cart._id;
		    					console.log("session cart ini haduh"+ req.session.id_cart);
		    					DumpCart.findOne({ id_user: id_user, status: "belum"}, function(err, dumpcart){
									if(dumpcart) {
										req.session.id_dumpcart = dumpcart._id;
										console.log("ini session kalo udah punya cart sebelumnya"+req.session.id_dumpcart);
										return res.render('index', {products: product, users: user, carts: cart});
									}else{

									}
								});
		    				}
		    			});
	    			}else{
	    				Cart.findOne({id_user: id_user}, function(err, cart){
		    				return res.render('index', {products: product, users: user, carts: cart});
		    			});
	    			}	    			
	    		}
	    	});	       	
	    } else {
	        return res.render('500');
	    }
    });
});

router.get('/', function(req, res){
	if(req.isAuthenticated()){
		var id_user = req.session.id_user;
		res.redirect('/' + id_user);
	} else {
		Product.find({}).limit(4).sort({'created_at': -1}).exec(function(err, product) {
		    if(!err) {
		       	return res.render('index', {products: product});
		    } else {
		        return res.render('500');
		    }
	    });
	}
});

router.get('/category/:category/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var category = req.params.category;

	if (category == "Otomotif") {
		Product.find({category_product : category}).sort({'created_at': -1}).exec(function(err, product) {
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
	}else if (category == "SmartphoneHandphone") {
		Product.find({category_product : category}).sort({'created_at': -1}).exec(function(err, product) {
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
	}else if (category == "Fashion") {
		Product.find({category_product : category}).sort({'created_at': -1}).exec(function(err, product) {
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
	}else{

	}	
});

router.get('/category/:category', function(req, res){
	var category = req.params.category;
	if(req.isAuthenticated()){
		var id_user = req.session.id_user;
		if (category == "Otomotif") {
			res.redirect('/category/Otomotif/' + id_user);
		}else if (category == "SmartphoneHandphone") {
			res.redirect('/category/SmartphoneHandphone/' + id_user);
		}else if (category == "Fashion") {
		   	res.redirect('/category/Fashion/' + id_user);
		}else{
		    		
		}
	} else {
		Product
		.find({category_product : category})
		.sort({'created_at': -1})
		.exec(function(err, product) {
		    if(!err) {
		    	if (category == "Otomotif") {
		    		return res.render('productotomotif', {products: product});
		    	}else if (category == "SmartphoneHandphone") {
		    		return res.render('productsmartphone', {products: product});
		    	}else if (category == "Fashion") {
		    		return res.render('productfashion', {products: product});
		    	}else{

		    	}
		    } else {
		        return res.render('500');
		    }
	    });
	}
});

router.get('/product/:id_product/:id_user', ensureAuthenticated, function(req, res){
	var id_user = req.params.id_user;
	var id_product = req.params.id_product;
	Product.find({}).limit(4).sort({'created_at': -1}).exec(function(err, allproducts) {
	   	if(!err){
			Product.findOne({ _id: id_product }, function(err, product) {
			    if(!err){
			    	SellerProfile.findOne({ id_user: product.id_User }, function(err, sellerProfile){
			    		if(!err){
				    		SellerAlamat.findOne({ id_user: product.id_User }, function(err, sellerAlamat){
				    			if(!err){
				    				User.findOne({_id : id_user}).exec(function(err, user) {
				    					if (!err) {
				    						Online.findOne({id_user: product.id_User}, function(err, online){
						    					return res.render('preview', {products: allproducts, sellerprofile: sellerProfile, selleralamat: sellerAlamat, product: product, onlines: online, users: user});
						    				});	
				    					}				    					
							    	});
				    			} else {
							        return res.render('500');
							    }
				    		});
			    		}
			    	});
			    } else {
			        return res.render('500');
			    }	       		
			});
		}
	});
});

router.get('/product/:id_product', function(req, res){
	var id_product = req.params.id_product;
	if(req.isAuthenticated()){
		var id_user = req.session.id_user;
		res.redirect('/product/'+ id_product +'/' + id_user);
	} else {
	    Product
	    .find({})
	    .limit(4)
	    .sort({'created_at': -1})
	    .exec(function(err, allproducts) {
	    	if(!err){
				Product.findOne({ _id: id_product }, function(err, product) {
				    if(!err){
				    	SellerProfile.findOne({ id_user: product.id_User }, function(err, sellerProfile){
				    		if(!err){
					    		SellerAlamat.findOne({ id_user: product.id_User }, function(err, sellerAlamat){
					    			if(!err){
					    				Online.findOne({id_user: product.id_User}, function(err, online){
					    					console.log(sellerProfile);
					    					console.log(sellerAlamat);
					    					return res.render('preview', {products: allproducts, sellerprofile: sellerProfile, selleralamat: sellerAlamat, product: product, onlines: online});
					    				});					    				
					    			} else {
								        return res.render('500');
								    }
					    		});
				    		}
				    	});
				    } else {
				        return res.render('500');
				    }	       		
				});
			}
		});
	}
});

router.get('/cart', ensureAuthenticated, function(req, res){
	var id_user = req.session.id_user;
	res.redirect('/cart/list/'+ id_user);
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