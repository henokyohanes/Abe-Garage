const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Routes for customer management
router.post(
  "/api/add-customer",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.createCustomer
);

// Route to get all customers (admin-only access)
router.get(
  '/api/all-customers',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getAllCustomers
);

// Route to get a single customer by ID (admin-only access)
router.get(
  '/api/customers/:id',
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getCustomerById
);

module.exports = router;