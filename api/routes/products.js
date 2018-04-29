const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const router = express.Router();
const checkAuth = require('../auth/check-auth');


router.get('/',  (req, res, next) => {
   Product.find()
   .select('name price _id')
   .exec() 
   .then( docs => {
        const response = {
            count: docs.length,
            products: docs.map( doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request : {
                        type: 'GET',
                        url: process.env.URL + ":" + process.env.PORT + "/products/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
   })
   .catch( err => {
       console.log(err);
       res.status(500),json({
           error: err
       });
   });
});

router.get('/:id',  (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .select( 'name price _id')
    .exec() 
    .then( doc => {
        console.log("From Database", doc);
        if( doc ) {
           res.status(200).json({
               request: {
                product: doc,
                description: 'Get All Products',
                url: process.env.URL + ":" + process.env.PORT + "/products"
               }
           });
        } else {
            res.status(404).json({
                message: 'No Valid Entry for this Id'
            });
        }
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth,  (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product Successfully Created',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'GET',
                    url: process.env.URL + ":" + process.env.PORT + "/products/" +  result._id
                }
            }
    })
    .catch(err => console.log(err));
    res.tatus(500).json({
        error: err
    })
    }); 
});

router.patch('/:id', checkAuth, (req, res, next) => {
   const id = req.params.id;
   const updateOps = {};
   for( const ops of req.body ) {
       updateOps[ops.propName ] = ops.value;
   }
   Product.update({ _id: id }, { $set: updateOps })
   .exec()
   .then( result => {
       console.log(result);
       res.status(200).json({
           message: 'Product Successfully Updated',
           request: {
               type: 'GET',
               url: process.env.URL + ":" + process.env.PORT + "/products/" + id
           }
       });
   })
   .catch( err => {
       console.log(err);
       res.status(500).json({
           error: err
       });
   });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Product Successfully Deleted',
            request: {
                type: 'POST',
                url: process.env.URL + ":" + process.env.PORT + "/products",
                body: { name: 'String', price: 'Number'} 
            }
        });
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;