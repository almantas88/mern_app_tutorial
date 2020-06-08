const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const Order = require("../models/orders");
const Product = require("../models/product");

/*
  @ROUTE - .../orders
  @METHOD - GET
  @DESCRIPTION - getting information about ALL orders
  @RETURNS -
    SUCCES an array of orders with information about products
    FAILURE an error with a message
*/
router.get("/", checkAuth , (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});


/*
  @ROUTE - .../orders
  @METHOD - POST
  @DESCRIPTION - posting an order, storing product id to the order. First we check if a product exists then we post
  @RETURN - 
    SUCCESS - returns a success message wit the information of the posted order
    FAILURE - an error with a message
*/
router.post("/", checkAuth ,(req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});


/*
  @ROUTE - .../:orderId
  @METHOD - GET
  @DESCRIPTION - getting information about a specific order using an id as a parameter
  @RETURN - 
    SUCCESS - returns an order object with the information of the order
    FAILURE - an error with a message
*/
router.get("/:orderId",checkAuth , (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("_id product quantity")
    .populate("product", "_id name price")
    .exec()
    .then((order) => {
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});


/*
  @ROUTE - .../:orderId
  @METHOD - DELETE
  @DESCRIPTION - delete a specific order with the id of the order
  @RETURN - 
    SUCCESS - returns a success message
    FAILURE - returns an error with a message
*/
router.delete("/:orderId", checkAuth ,(req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        message: "Order deleted",
        request: {
          description: "Creating a new order",
          type: "POST",
          url: "http://localhost:3000/order/",
          body: { productId: "String", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
