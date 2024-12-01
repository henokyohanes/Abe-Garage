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

// Get Single Service by ID
router.get(
  '/api/service/:id',
  authMiddleware.verifyToken,
  serviceController.getServiceById
);

// Update Service by ID
router.put(
  '/api/service/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrManager,
  serviceController.updateService
);

// Delete Service by ID
router.delete(
  '/api/service/:id',
  authMiddleware.verifyToken,
  authMiddleware.isAdminOrManager,
  serviceController.deleteService
);

module.exports = router;
