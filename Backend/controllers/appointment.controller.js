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

// function to get booked times
const getBookedTimes = async (req, res) => {
  const { date } = req.query;
  console.log("date", date);

  if (!date) {
    return res
      .status(400)
      .json({ error: "Date is required in YYYY-MM-DD format." });
  }

  try {
    const bookedTimes = await appointmentService.getBookedTimesByDate(date);
    res.json({ bookedTimes });
  } catch (err) {
    console.error("Error in controller:", err);
    res.status(500).json({ error: "Failed to fetch booked times." });
  }
};

// Get all appointments for a customer by email
const getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const appointments = await appointmentService.getAppointmentsByEmail(email);
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments by email:", err.message);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

module.exports = { createAppointment, getBookedTimes, getAppointmentsByEmail };