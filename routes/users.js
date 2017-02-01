var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var Users = require('../models/users');
var Profile = require('../models/usersprofile');
var Alamat = require('../models/usersalamat');

// Register
router.get('/register', function(req, res){
	res.render('register', {layout: 'layout_login'});
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
		Users.createUser(newUser, function(err){
			if (!err) {
				Users.findOne({username: username}, function(err, user){
					var newProfile = new Profile({
						id_user: user._id,
						nama_user: "",
						no_telp_user: ""
					});
					var newAlamat = new Alamat({
						id_user: user._id,
						"alamat_user.jalan": "",
						"alamat_user.kota": "",
						"alamat_user.kabupaten": "",
						"alamat_user.kecamatan": "",
						"alamat_user.provinsi": "",
						"alamat_user.kode_pos": ""
					});
					Profile.create(newProfile, function(err){
						if (err) {
							console.log(err);
						}
						else {
							console.log('berhasil menyimpan');
						}
					});
					Alamat.create(newAlamat, function(err){
						if (err) {
							console.log(err);
						}
						else {
							console.log('berhasil menyimpan');
						}
					});
				});
				res.redirect('/users/login');
			}else{
				throw err;
			}			
		});		
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
   		Users.getUserByUsername(username, function(err, user){
   		if(err) throw err;
   		
   		if(!user){
   			return done(null, false, {message: 'Unknown User'});
   		}

   		Users.comparePassword(password, user.password, function(err, isMatch){
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
	res.render('login', {layout: 'layout_login'});
});

//ketika login bagaimana caranya bisa masuk sesuai dengan role
router.post('/login', passport.authenticate('local-login', {failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
		var username = req.body.username;

		Users.findOne({ username: username}, function(err, user){
			var id = user._id;
			res.redirect('/' + id);
		});
});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;