const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
      message: 'Fetching All Orders'
  });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).json({
        message: `Fetching Order Id: ${id}`
    });
  });

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order Created',
        order: order
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    res.status(200).json({
        message: `Deleted Order Id: ${id}`
    });
  });



module.exports = router;