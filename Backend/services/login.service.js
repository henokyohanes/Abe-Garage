const db = require("../config/db.config");
const employeeService = require("./employee.service");
const customerService = require("./customer.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//Handle customer register
async function register(customerData) {
  try {
    const customer = await customerService.createCustomer(customerData);
    return customer;
  } catch (error) {
    console.error("Error registering:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
}

// Handle employee OR customer login
async function logIn(userData) {
  try {
    // 1. Look up both
    const [employee] = await employeeService.getEmployeeByEmail(userData.email);
    const [customer] = await customerService.findCustomerByEmail(userData.email);

    if (!employee && !customer) {
      return { status: "fail", message: "The user does not exist" };
    }

    // 2. Determine which record we have and what the hash field is
    let userRecord, hashToCompare;
    if (employee) {
      userRecord    = employee;
      hashToCompare = employee.employee_password_hashed;
    } else {
      userRecord    = customer;
      hashToCompare = customer.customer_password_hashed;
    }

    // 3. Compare the password once
    const isMatch = await bcrypt.compare(userData.password, hashToCompare);
    if (!isMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // 4. Success!
    return { status: "success", data: userRecord };

  } catch (error) {
    console.error("Error logging in:", error);
    return { status: "fail", message: "Something went wrong" };
  }
}

// handle forgot password
async function forgotPassword(email) {
  try {
    const employee = await employeeService.getEmployeeByEmail(email);
    const customer = await customerService.findCustomerByEmail(email);

    if (!employee && !customer) {
      return { status: "fail", message: "No user with that email exists." };
    }

    let isEmployee = false;
    let userRecord;
    if (employee) {
      isEmployee = true;
      userRecord = employee;
    } else {
      userRecord = customer;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    if (isEmployee) {
      await db.query(
        "UPDATE employee_pass SET reset_token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE employee_id = ?",
        [hashedToken, userRecord[0].employee_id]
      );
    } else {
      await db.query(
        "UPDATE customer_identifier SET reset_token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE customer_id = ?",
        [hashedToken, userRecord[0].customer_id]
      );
    }

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipientEmail = isEmployee
      ? userRecord[0].employee_email
      : userRecord[0].customer_email;

    const firstName =
      userRecord[0].employee_first_name ||
      userRecord[0].customer_first_name ||
      "User";

    const mailOptions = {
      to: recipientEmail,
      subject: "Password Reset Request",
      text: `
Hello ${firstName},

You requested a password reset. Copy and paste the following link into your browser:

${resetLink}

This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
      `,
      html: `
<p>Hello ${firstName},</p>
<p>You requested a password reset. Click the link below to reset your password:</p>
<p><a href="${resetLink}">Reset Password</a></p>
<p>This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: "success",
      message: "Password reset link sent to your email address.",
    };
  } catch (err) {
    console.error("Error in loginService.forgotPassword:", err);
    return {
      status: "fail",
      message: "Something went wrong. Please try again later.",
    };
  }
}

module.exports = { logIn, register, forgotPassword };