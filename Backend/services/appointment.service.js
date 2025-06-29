const db = require("../config/db.config");
const nodemailer = require("nodemailer");

// Email transporter setup (Gmail example)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send appointment confirmation email
const sendAppointmentConfirmation = async (toEmail, appointment) => {
  const {
    firstName,
    lastName,
    appointmentDate,
    appointmentTime,
    services = [],
  } = appointment;

  const serviceList = services.length
    ? services.map((s) => `• ${s.service_name}`).join("<br>")
    : "No services selected.";

  const mailOptions = {
    from: `"Abe Garage" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Appointment Confirmation - Abe Garage",
    html: `
      <h3>Hello ${firstName} ${lastName},</h3>
      <p>Your appointment has been successfully scheduled at <strong>Abe Garage</strong>.</p>
      <p>
        <strong>Date:</strong> ${appointmentDate}<br/>
        <strong>Time:</strong> ${appointmentTime}
      </p>
      <p><strong>Services:</strong><br/>${serviceList}</p>
      <p>We look forward to serving you!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Function to create a new appointment
const createAppointment = async (appointmentData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    make,
    model,
    year,
    color,
    services,
    appointmentDate,
    appointmentTime,
  } = appointmentData;

  const appointmentStatus = 0;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Insert appointment
    const result = await connection.query(
      `INSERT INTO appointments
        (customer_first_name, customer_last_name, customer_email, customer_phone_number,
         vehicle_make, vehicle_model, vehicle_year, vehicle_color,
         appointment_date, appointment_time, appointment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        phone,
        make,
        model,
        year,
        color,
        appointmentDate,
        appointmentTime,
        appointmentStatus,
      ]
    );

    const appointmentId = result[0]?.insertId || result.insertId;

    // Insert appointment services if available
    if (services && services.length > 0) {
      const insertServicePromises = services.map((service) =>
        connection.query(
          `INSERT INTO appointment_services (appointment_id, service_id) VALUES (?, ?)`,
          [appointmentId, service.service_id]
        )
      );
      await Promise.all(insertServicePromises);
    }

    await connection.commit();

    // Send email confirmation
    try {
      await sendAppointmentConfirmation(email, {
        firstName,
        lastName,
        appointmentDate,
        appointmentTime,
        services,
      });
    } catch (emailErr) {
      console.error("Error sending confirmation email:", emailErr.message);
      // You may choose to log this or save to an email error log table
    }

    return {
      appointment_id: appointmentId,
      ...appointmentData,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Error creating appointment:", error.message);
    throw new Error("Failed to create appointment");
  } finally {
    connection.release();
  }
};

module.exports = {
  createAppointment,
};
