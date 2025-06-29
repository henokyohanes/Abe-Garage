const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// Route to create appointment endpoint
router.post('/api/appointments', appointmentController.createAppointment);

module.exports = router;