const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../auth/check-auth');



router.get('/', checkAuth, (req, res, next) => {
 Order.find()
 .select( 'product quantity _id')
 .populate( 'product', 'name price' )
 .exec()
 .then( docs => {
     res.status(200).json({
         count: docs.length,
         orders: docs.map( doc => {
             return {
                 _id: doc._id,
                 product: doc.product,
                 quantity: doc.quantity,
                 request: {
                     type: 'GET',
                     url: process.env.URL + ":" + process.env.PORT + "/orders/" + doc._id
 
                 }
             }
         })
    });
})
 .catch( err => {
     res.status(500).json({
         error: err
     })
 });
});

router.get('/:id', checkAuth, (req, res, next) => {
    Order.findById( req.params.id )
    .populate( 'product', 'name price' )
    .exec()
    .then( order => {
        if (!order) {
            return res.status(404).json({
                message: "Order Not Found"
        });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: process.env.URL + ":" + process.env.PORT + "/orders"
     
            }
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    }); 
  });

router.post('/', checkAuth, (req, res, next) => {
    Product.findById( req.body.productId )
    .then( product => {
        if (!product) {
            return res.status(404).json({
                message: 'Product Not Found'
            });
        } 
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
    .then( result => {
        console.log(result);
         res.status(201).json({
            message: 'Order successfully created',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: process.env.URL + ":" + process.env.PORT + "/orders/" + result._id
            }
        });
    })
    .catch( err => {
        res.status(404).json({
            message: 'ProductId Not Found'
        });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Order.remove({ _id: req.params.id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Order successfully deleted",
            request: {
                type: 'POST',
                url: process.env.URL + ":" + process.env.PORT + "/orders",
                body: { productID: "ID", quantity: "Number"} 
            }
        }) 
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    }); 
  });



module.exports = router;