const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Routes to add a new vehicle for a specific customer
router.post('/api/vehicle/:customer_id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], vehicleController.createVehicle);

// Route to get all vehicles for a specific customer
router.get('/api/vehicles/:customer_id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], vehicleController.getVehiclesByCustomerId);

// Route to get a single vehicle by ID
router.get('/api/vehicle/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], vehicleController.getVehicleById);

// Update vehicle endpoint
router.put('/api/update-vehicle/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], vehicleController.updateVehicle);

// Delete vehicle endpoint
router.delete('/api/delete-vehicle/:id', [authMiddleware.verifyToken, authMiddleware.isAdminOrManager], vehicleController.deleteVehicle);

module.exports = router;