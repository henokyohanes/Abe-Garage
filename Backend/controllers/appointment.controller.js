const appointmentService = require('../services/appointment.service');

// function to Create appointment
const createAppointment = async (req, res) => {
  const {
    firstName, lastName, email, phone,
    make, model, year, color,
    services, appointmentDate, appointmentTime
  } = req.body;

  try {
    const newAppointment = await appointmentService.createAppointment({
      firstName, lastName, email, phone,
      make, model, year, color,
      services, appointmentDate, appointmentTime
    });

    return res.status(201).json({
      status: "success",
      message: "Appointment created successfully",
      data: newAppointment
    });
  } catch (err) {
    console.error("Error creating appointment:", err.message);
    return res.status(500).json({ status: "fail", message: "Failed to create appointment" });
  }
};

module.exports = { createAppointment };