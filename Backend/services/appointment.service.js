const db = require("../config/db.config");
const nodemailer = require("nodemailer");
// const twilio = require("twilio");

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

  const formattedDate = new Date(appointmentDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

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
        <strong>Date:</strong> ${formattedDate}<br/>
        <strong>Time:</strong> ${appointmentTime}
      </p>
      <p><strong>Services:</strong><br/>${serviceList}</p>
      <p>We look forward to serving you!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Twilio setup
// const twilio = require("twilio");

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// Function to send appointment confirmation SMS
// const sendAppointmentSMS = async (toPhone, appointment) => {
//   const {
//     firstName,
//     appointmentDate,
//     appointmentTime,
//     services = [],
//   } = appointment;

//   const formattedDate = new Date(appointmentDate).toLocaleDateString("en-US", {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//   });

//   const serviceList = services.length
//     ? services.map((s) => s.service_name).join(", ")
//     : "No services selected";

//   const messageBody = `Hello ${firstName}, your appointment at Abe Garage is confirmed for ${formattedDate} at ${appointmentTime}. Services: ${serviceList}.`;

//   try {
//     const message = await twilioClient.messages.create({
//       body: messageBody,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: toPhone, // Make sure this is in E.164 format: +1xxxxxxxxxx
//     });
//     console.log("SMS sent:", message.sid);
//   } catch (error) {
//     console.error("Failed to send SMS:", error.message);
//   }
// };

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
    if (email) {
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
      }
    }

    // Send SMS confirmation
    // if (phone) {
    //   try {
    //     await sendAppointmentSMS(phone, {
    //       firstName,
    //       appointmentDate,
    //       appointmentTime,
    //       services,
    //     });
    //   } catch (smsErr) {
    //     console.error("Error sending confirmation SMS:", smsErr.message);
    //   }
    // }

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

// Function to get booked times by date
const getBookedTimesByDate = async (date) => {
  const rows = await db.query(
    "SELECT appointment_time FROM appointments WHERE DATE(appointment_date) = ?",
    [date]
  );
  console.log("rows", rows);

  return rows.map((row) => row.appointment_time);
};

// Function to get appointments by customer email
const getAppointmentsByEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  // Get all appointments by customer email
  const appointments = await db.query(
    `
    SELECT *
    FROM appointments
    WHERE customer_email = ?
    ORDER BY appointment_date DESC, appointment_time DESC
    `,
    [email]
  );

  console.log("appointments", appointments);

  // For each appointment, fetch related services
  for (const appt of appointments) {
    const [services] = await db.query(
      `
      SELECT s.id, s.service_name, s.description
      FROM appointment_services aps
      JOIN services s ON aps.service_id = s.id
      WHERE aps.appointment_id = ?
      `,
      [appt.id]
    );
    appt.services = services; // Attach services to each appointment
  }

  return appointments;
};

module.exports = {
  createAppointment, getBookedTimesByDate, getAppointmentsByEmail
};
