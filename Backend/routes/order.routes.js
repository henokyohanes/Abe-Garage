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

module.exports = router;