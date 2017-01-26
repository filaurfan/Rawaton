var express = require('express');
var router = express.Router();

var Product = require('../models/product');

// app.get('/upload', common.imageForm);
// app.post('/upload', common.uploadImage);

router.get('/dashboard', function(req, res){
	res.render('admindashboard', {layout: 'layout2'});
});

//untuk menampilkan semua barang pada halaman index
router.get('/list', function(req, res, next){
	
	Product.find(function(err, product) {
      if(!err) {
        return res.render('adminlistproduct', {products: product, layout: 'layout2'});
      } else {
        return res.render('500');
      }
    });
});

//untuk menampilkan halaman input barang pada sisi admin
router.get('/input', function(req, res){
	res.render('admininputproduct', {layout: 'layout2'});
});

//untuk menginputkan barang pada table products
router.post('/input', function(req, res){

	var name_seller = "basri";
	
	var name_product = req.body.name_product;
	var category_product = req.body.category_product;
	var price_product = req.body.price_product;
	var entity_product = req.body.entity_product;
	var description_product = req.body.description_product;
	var picture_product = req.body.picture_product;
	var created_at = new Date();

	// Validation
	req.checkBody('name_product', 'Nama Barang is required').notEmpty();
	req.checkBody('category_product', 'Kategory Barang is not valid').notEmpty();
	req.checkBody('price_product', 'Harga Barang is not valid').notEmpty();
	req.checkBody('entity_product', 'Stock Barang is required').notEmpty();
	req.checkBody('description_product', 'Deskripsi Barang is required').notEmpty();
	req.checkBody('picture_product', 'Gambar Barang is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('productinput',{
			errors:errors,
			layout: 'layout2'
		});
	} else {
		var product = new Product({
		  name_seller: name_seller,
	      name_product: name_product,
	      category_product: category_product,
	      price_product: price_product,
	      entity_product: entity_product,
	      description_product: description_product,
	      picture_product: picture_product,
	      created_at: created_at
	    });

		Product.addBarang(product, function(err, product){
			if (err) {
				//logger.error('error bung ', err);
				return res.render('500');
			}
			// logger.debug('data tersimpan bung ', pegawai);
			//logger.info('render page awal');
			console.log(product);
			return res.redirect('/seller/input');

			 if(err) throw err;
			
		});
		 req.flash('success_msg', 'You are registered and can now login');
	}
});

// app.get('/users/:_id', function (req, res) {
//     if (req.params._id) {
//         Product.find({ _id: req.params._id }, function (err, docs) {
//             console.log(_id);
//         });
//     }
// });

// router.post('/update', function(req, res){

// });

module.exports = router;