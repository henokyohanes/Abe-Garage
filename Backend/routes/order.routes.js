const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Create order endpoint
router.post(
  '/api/order',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  orderController.createOrder
);

// Get all orders endpoint
router.get(
  '/api/orders',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  orderController.getAllOrders
);

// Get single order endpoint
router.get(
  '/api/order/:id',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  orderController.getOrderById
);

// Update order endpoint
router.put(
  '/api/order/:id',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  orderController.updateOrder
);

module.exports = router;