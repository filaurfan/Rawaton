var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var Seller = require('../models/seller');
var Buyer = require('../models/buyer');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Register User
router.post('/register', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var email = req.body.email;
	var role = req.body.role;
	// var name = req.body.name;
	
	// Validation
	req.checkBody('role', 'Role is required').notEmpty();
	// req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		if (role == "seller") {
			var newUser = new Seller({
				username_seller: username,
				password_seller: password,
				email_seller: email,
				role_seller: role
			});

			Seller.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
				req.flash('success_msg', 'You are registered and can now login');
			});
			res.redirect('/users/login');
		}else if (role == "buyer") {
			var newUser = new Buyer({
				username_buyer: username,
				password_buyer: password,
				email_buyer: email,
				role_buyer: role
			});

			Buyer.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
				req.flash('success_msg', 'You are registered and can now login');
			});
			res.redirect('/users/login');
		}else{

		}
	}
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, username, password, done) {
   		User.getUserByUsername(username, function(err, user){
   		if(err) throw err;
   		
   		if(!user){
   			return done(null, false, {message: 'Unknown User'});
   		}

   		User.comparePassword(password, user.password, function(err, isMatch){
   			if(err) throw err;
   			
   			if(isMatch){
   				return done(null, user);
   			} else {
   				return done(null, false, {message: 'Invalid password'});
   			}
   		});
   	});
}));


// Login
router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login', passport.authenticate('local', {successRedirect:'/seller/dashboard', failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
    	res.redirect('/seller/dashboard');
});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});



// router.get('/:users', function(req, res, next){
// 	res.send('users' + req.params.users); 
// 	console.log('although this matches');
//   	next();
// });


module.exports = router;