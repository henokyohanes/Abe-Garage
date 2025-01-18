const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create order endpoint
router.post('/api/order', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.createOrder);

// Get all orders endpoint
router.get('/api/orders', authMiddleware.verifyToken, orderController.getAllOrders);

// Get orders by customer ID endpoint
router.get('/api/orders/customer/:customer_id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.getOrdersByCustomerId);

// Get single order endpoint
router.get('/api/order/:id', authMiddleware.verifyToken, orderController.getOrderById);

// Update order endpoint
router.put('/api/order/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.updateOrder);

// Delete order endpoint
router.delete('/api/order/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.deleteOrder);

// Delete service endpoint of an order
router.delete('/api/order/:orderId/service/:serviceId', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.deleteService);

// Cancel additional request endpoint
router.put('/api/order/:orderId/additional-request', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], orderController.cancelAdditionalRequest);

module.exports = router;