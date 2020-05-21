const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handling GET request to /orders"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: "Handling POST request to /orders"
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: "order deleted"
    });
});

module.exports = router;