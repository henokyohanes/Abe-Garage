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

module.exports = router;