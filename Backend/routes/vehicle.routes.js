const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Routes to add a new vehicle for a specific customer
router.post('/api/customer/:customer_id/car', [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.createVehicle);

// Route to get all vehicles for a specific customer (admin-only access)
router.get('/api/customer/:customer_id/cars', [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.getVehiclesByCustomerId);

// Route to get a single vehicle by ID (admin-only access)
router.get('/api/vehicle/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.getVehicleById);

// Update vehicle endpoint
router.put('/api/update-vehicle/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.updateVehicle);

// Delete vehicle endpoint
router.delete('/api/delete-vehicle/:id', [authMiddleware.verifyToken, authMiddleware.isAdmin], vehicleController.deleteVehicle);

module.exports = router;