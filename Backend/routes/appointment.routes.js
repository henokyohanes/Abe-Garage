const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

// Route to create appointment endpoint
router.post('/api/appointments', appointmentController.createAppointment);

// Route to get booked times endpoint for a specific date
router.get('/api/appointments/booked-times', appointmentController.getBookedTimes);

// Route to get appointements endpoint for specific customer
router.get('/api/appointments/by-email',appointmentController.getAppointmentsByEmail);

module.exports = router;