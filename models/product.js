var mongoose = require('mongoose');

var util = require('util');



// Product Schema
var ProductSchema = mongoose.Schema({
  name_product: {
    type: String,
    index:true
  },
  name_seller: {
    type: String
  },
  category_product: {
    type: String
  },
  price_product: {
    type: Number
  },
  entity_product: {
    type: Number
  },
  description_product: {
    type: String
  },
  picture_product: {
    type: String
  },
  created_at: {
    type : Date
  }
});

var Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.addBarang = function(newBarang, callback) {
  newBarang.save(callback);
};


module.exports.findBarang = function(req, res) {
  Product.find(function(err, products) {
    if(!err) {
      return res.send(products);
    } else {
      // return res.render('500');
    }
  });
  return res.send(products);
};

module.exports.findBarangById = function(id, callback){
  return Product.findById(req.params.id, function(err, product) {
      if(!err) {
        return res.send({ status: 'OK', products:product });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
}
                     
  module.exports.deleteBarang = function(req, res) {

    return Product.findById(req.params.id, function(err, product) {
      if(!product) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return product.remove(function(err) {
        if(!err) {
          console.log('Removed car');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });














































  /**
   * Find and retrieves a single car by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */









  /**
   * Update a car by its ID
   * @param {Object} req HTTP request object.
   * @param {Object} res HTTP response object.
   */
  module.exports.updateCar = function(req, res) {

    console.log("PUT - /car/:id");
    return Car.findById(req.params.id, function(err, car) {

      if(!car) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if (req.body.model != null) car.model = req.body.model;
      if (req.body.year != null) car.year = req.body.year;
      if (req.body.price != null) car.price  = req.body.price;
      if (req.body.color != null) car.color = req.body.color;

      return car.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', car:car });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }

        res.send(car);

      });
    });
  };



 
  }