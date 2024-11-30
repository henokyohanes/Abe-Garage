const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");

const authMiddleware = require("../middlewares/auth.middleware");


// Add Service Endpoint
router.post(
  "/api/service",
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrManager,
  serviceController.addService
);

// Get All Services Endpoint
router.get(
  '/api/services',
  authMiddleware.verifyToken,
  serviceController.getAllServices
);

module.exports = router;
