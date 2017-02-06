var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var Users = require('../models/users');
var Profile = require('../models/usersprofile');
var Alamat = require('../models/usersalamat');
var Online	= require('../models/online');

// Register
router.get('/register', ensureAuthenticated, function(req, res){
	res.render('homeregister', {layout: 'layout_login'});
});

// Register User
router.post('/register', function(req, res){
	var newusername = req.body.username;
	var newpassword = req.body.password;
	var password2 = req.body.password2;
	var newemail = req.body.email;
	var newrole = req.body.role;
	
	// Validation
	req.checkBody('role', 'Role is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('homeregister',{
			errors:errors
		});
	} else {
		Users.findOne({username: newusername}, function(err, username){
			if (!username) {
			Users.findOne({email: newemail}, function(err, email){
				if (!email) {
					var newUser = new Users({
						username: newusername,
						password: newpassword,
						email: newemail,
						role: newrole
					});
					Users.createUser(newUser, function(err){
						if (!err) {
							Users.findOne({username: newusername}, function(err, user){
								var newProfile = new Profile({
									id_user: user._id,
									nama_user: "",
									no_telp_user: Math.random()
								});
								Profile.create(newProfile, function(err){
									if (err) {
										console.log(err);
									}
									else {
										console.log('berhasil menyimpan');
									}
								});
								var newAlamat = new Alamat({
									id_user: user._id,
									no_telp_kantor: Math.random(),
									alamat_jalan: "",
									alamat_kecamatan: "",
									alamat_kota: "",
									alamat_kabupaten: "",
									alamat_provinsi: "",
									alamat_kode_pos: ""
								});
								Alamat.create(newAlamat, function(err){
									if (err) {
										console.log(err);
									}
									else {
										console.log('berhasil menyimpan');
									}
								});
								var createonline = new Online({
									id_user: user._id,
									status: "Offline",
									online: new Date()
								});
								Online.create(createonline, function(err) {
						    		if(err){
						    			console.log(err);
						    		}
									console.log('berhasil menyimpan');
						        });
							});
						}else{
							throw err;
						}			
					});		
				}else{
					consol.log("email sudah ada");
					res.redirect('/users/register');
				}
			});
			}else{
				console.log("username sama");
				res.redirect('/users/register');
			}
			res.redirect('/users/login');
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
router.get('/login', ensureAuthenticated, function(req, res){
	res.render('homelogin', {layout: 'layout_login'});
});

//ketika login bagaimana caranya bisa masuk sesuai dengan role
router.post('/login', passport.authenticate('local-login', {failureRedirect:'/users/login',failureFlash: true}), function(req, res) {
		var username = req.body.username;

		Users.findOne({ username: username}, function(err, user){
			var id = user._id;
			req.session.id_user = user._id;
			console.log(req.session.id_user);
			if (!err) {
				Online.findOne({id_user: id}, function(err, online){
					if (online) {
						Online.update({_id : online._id}, { $set: {status: "Online", online: new Date()}}, function(err) {
				    		if(err){
				    			console.log(err);
				    		}
				    		console.log("you are online now");
							res.redirect('/' + id);

				        });
					}else if(!Online){
						var createonline = new Online({
							id_user: id,
							status: "Online",
							online: new Date()
						});
						Online.create(createonline, function(err) {
				    		if(err){
				    			console.log(err);
				    		}
							res.redirect('/' + id);
				        });
					}else{

					}
				});
			}
		});
});

router.get('/logout', function(req, res){
	var id_user = req.session.id;
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
	req.session.destroy();

	Online.findOne({id_user: id_user}, function(err, online){
		if (online) {
			Online.update({_id : online._id}, {$set: {status: "Offline", Offline: new Date()}}, function(err) {
	  			if(err){
					console.log(err);
				}
				console.log("you are offline now");
				res.redirect('/' + id);
			});
		}else{

		}
	});
});

function ensureAuthenticated(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}
module.exports = router;