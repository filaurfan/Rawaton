var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var Users = require('../models/users');

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
	
	// Validation
	req.checkBody('role', 'Role is required').notEmpty();
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
		var newUser = new Users({
			username: username,
			password: password,
			email: email,
			role: role
		});

		Users.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
			req.flash('success_msg', 'You are registered and can now login');
		});
		res.redirect('/users/login');
	}
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findOne({_id: id}, function(err, user) {
    done(err, user);
  });
});


passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    Users.findOne({ username: username }, function (err, user) {
      	if (err) {
       		return done(err); 
   		}
      	if (!user) {
      		return done(null, false); 
      	}
      	// if (!user.verifyPassword(password)) {
      	// 	return done(null, false); 
      	// }
      	return done(null, user);
    });
  }
));

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

//ketika login bagaimana caranya bisa masuk sesuai dengan role
router.post('/login', passport.authenticate('local-login', {failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
		var username = req.body.username;
		Users.findOne({username: username}, function(err, user){
			req.session.username = "username";
	    	req.session.role = role;
			res.redirect('/' + username);
		}); 
});

router.get('/', function(req, res){
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