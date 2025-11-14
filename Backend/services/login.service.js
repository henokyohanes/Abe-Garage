// const db = require("../config/db.config");
// const employeeService = require("./employee.service");
// const customerService = require("./customer.service");
// const bcrypt = require("bcrypt");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");

// //Handle customer register
// async function register(customerData) {
//   try {
//     const customer = await customerService.createCustomer(customerData);
//     return customer;
//   } catch (error) {
//     console.error("Error registering:", error);
//     throw error.response?.data || { message: "Unknown error occurred" };
//   }
// }

// // Handle employee OR customer login
// async function logIn(userData) {
//   console.log("user data", userData);
//   try {
//     // 1. Look up both
//     const [employee] = await employeeService.getEmployeeByEmail(userData.email);
//     const [customer] = await customerService.findCustomerByEmail(userData.email);

//     if (!employee && !customer) {
//       return { status: "fail", message: "The user does not exist" };
//     }

//     // 2. Determine which record we have and what the hash field is
//     let userRecord, hashToCompare;
//     if (employee) {
//       userRecord    = employee;
//       hashToCompare = employee.employee_password_hashed;
//     } else {
//       userRecord    = customer;
//       hashToCompare = customer?.customer_password_hashed;
//     }

//     if (!hashToCompare) {
//       return { status: "fail", message: "The user does not exist" };
//     }

//     // 3. Compare the password once
//     const isMatch = await bcrypt.compare(userData.password, hashToCompare);
//     if (!isMatch) {
//       return { status: "fail", message: "Incorrect password" };
//     }

//     // 4. Success!
//     return { status: "success", data: userRecord };

//   } catch (error) {
//     console.error("Error logging in:", error);
//     return { status: "fail", message: "Something went wrong" };
//   }
// }

// // handle forgot password
// async function forgotPassword(email) {
//   try {
//     const employee = await employeeService.getEmployeeByEmail(email);
//     const customer = await customerService.findCustomerByEmail(email);

//     if (!employee && !customer) {
//       return { status: "fail", message: "No user with that email exists." };
//     }

//     console.log("now", employee, customer);

//     let isEmployee = false;
//     let userRecord;
//     if (employee.length > 0) {
//       isEmployee = true;
//       userRecord = employee;
//     } else {
//       userRecord = customer;
//     }

//     const rawToken = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(rawToken)
//       .digest("hex");

//     if (isEmployee) {
//       await db.query(
//         "UPDATE employee_pass SET reset_token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE employee_id = ?",
//         [hashedToken, userRecord[0].employee_id]
//       );
//     } else {
//       await db.query(
//         "UPDATE customer_identifier SET reset_token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE customer_id = ?",
//         [hashedToken, userRecord[0].customer_id]
//       );
//     }

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const recipientEmail = isEmployee
//       ? userRecord[0].employee_email
//       : userRecord[0].customer_email;

//     const firstName =
//       userRecord[0].employee_first_name ||
//       userRecord[0].customer_first_name ||
//       "User";

//     const mailOptions = {
//       from: `"Abe Garage" <${process.env.EMAIL_USER}>`,
//       to: recipientEmail,
//       subject: "Password Reset Request",
//       text: `
// Hello ${firstName},

// You requested a password reset. Copy and paste the following link into your browser:

// ${resetLink}

// This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
//       `,
//       html: `
// <p>Hello ${firstName},</p>
// <p>You requested a password reset. Click the link below to reset your password:</p>
// <p><a href="${resetLink}">Reset Password</a></p>
// <p>This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     return {
//       status: "success",
//       message: "Password reset link sent to your email address.",
//     };
//   } catch (err) {
//     console.error("Error in loginService.forgotPassword:", err);
//     return {
//       status: "fail",
//       message: "Something went wrong. Please try again later.",
//     };
//   }
// }

// // Handle reset password
// async function resetPassword(token, newPassword) {
//   try {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//     // Try finding employee first
//     const employee = await db.query(
//       "SELECT * FROM employee_pass WHERE reset_token = ? AND token_expiry > NOW()",
//       [hashedToken]
//     );

//     console.log("employee", employee);

//     if (employee.length > 0) {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       await db.query(
//         "UPDATE employee_pass SET employee_password_hashed = ?, reset_token = NULL, token_expiry = NULL WHERE employee_id = ?",
//         [hashedPassword, employee[0].employee_id]
//       );

//       return { status: "success", message: "Employee password reset successful" };
//     }

//     // If not an employee, try customer
//     const customer = await db.query(
//       "SELECT * FROM customer_identifier WHERE reset_token = ? AND token_expiry > NOW()",
//       [hashedToken]
//     );

//     if (customer.length > 0) {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       await db.query(
//         "UPDATE customer_identifier SET customer_password_hashed = ?, reset_token = NULL, token_expiry = NULL WHERE customer_id = ?",
//         [hashedPassword, customer[0].customer_id]
//       );

//       return { status: "success", message: "Customer password reset successful" };
//     }

//     // If neither found
//     return { status: "fail", message: "Invalid or expired reset token" };
//   } catch (err) {
//     console.error("Error resetting password:", err);
//     throw err;
//   }
// }

// // Find user by username
// async function findUserByUsername(username) {
//   const query = `
//     SELECT * FROM customer_info WHERE customer_username = ? 
//     UNION 
//     SELECT * FROM employee WHERE employee_username = ?;
//   `;
//   const rows = await db.query(query, [username, username]);
//   console.log("rows", rows);
//   return rows.length > 0 ? rows[0] : null;
// }

// module.exports = {
//   logIn,
//   register,
//   forgotPassword,
//   resetPassword,
//   findUserByUsername,
// };

// module.exports = { logIn, register, forgotPassword, resetPassword, findUserByUsername };































// services/login.service.js

const db = require("../config/db.config");
const employeeService = require("./employee.service");
const customerService = require("./customer.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { generateOTP } = require("../utils/otp");
const { sendEmail } = require("../utils/sendEmail");

// --------------------------------------------------
// Customer registration
// --------------------------------------------------
async function register(customerData) {
  try {
    const customer = await customerService.createCustomer(customerData);
    return customer;
  } catch (error) {
    console.error("Error registering:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
}

// --------------------------------------------------
// Employee or customer login + 2FA (email OTP)
// --------------------------------------------------
async function logIn(userData) {
  try {
    const [employee] = await employeeService.getEmployeeByEmail(userData.email);
    const [customer] = await customerService.findCustomerByEmail(userData.email);

    if (!employee && !customer) {
      return { status: "fail", message: "The user does not exist" };
    }

    let userRecord, hashToCompare, isEmployee;
    if (employee) {
      userRecord = employee;
      hashToCompare = employee.employee_password_hashed;
      isEmployee = true;
    } else {
      userRecord = customer;
      hashToCompare = customer?.customer_password_hashed;
      isEmployee = false;
    }

    if (!hashToCompare) {
      return { status: "fail", message: "The user does not exist" };
    }

    const isMatch = await bcrypt.compare(userData.password, hashToCompare);
    if (!isMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // Check if 2FA is enabled
    const twoFactorEnabled =
      userRecord.two_factor_enabled === 1 || userRecord.two_factor_enabled === true;
      console.log("userRecord", userRecord);

    if (twoFactorEnabled) {
      // Generate OTP and expiry
      const otp = generateOTP();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      console.log("otp", otp, "expiry", expiry);

      const table = isEmployee ? "employee_pass" : "customer_identifier";
      const idField = isEmployee ? "employee_id" : "customer_id";

      await db.query(
        `UPDATE ${table} SET two_factor_otp = ?, two_factor_expiry = ? WHERE ${idField} = ?`,
        [otp, expiry, userRecord[idField]]
      );

      // Send OTP via email
      const recipientEmail = userRecord.employee_email || userRecord.customer_email;
      const firstName = userRecord.employee_first_name || userRecord.customer_first_name || "User";

      await sendEmail(
        recipientEmail,
        "Your Abe Garage Verification Code",
        `Hello ${firstName},\n\nYour OTP code is ${otp}. It expires in 5 minutes.`
      );

      return {
        status: "pending_2fa",
        message: "Verification code sent to your email.",
        userType: isEmployee ? "employee" : "customer",
        userId: userRecord[idField],
        userEmail: userRecord.employee_email || userRecord.customer_email || "email",
      };
    }

    // Normal login (no 2FA)
    return { status: "success", data: userRecord };
  } catch (error) {
    console.error("Error logging in:", error);
    return { status: "fail", message: "Something went wrong" };
  }
}

// --------------------------------------------------
// Verify 2FA OTP
// --------------------------------------------------
async function verify2FA({ userId, userType, otp }) {

  console.log("userId", userId, "userType", userType, "otp", otp);
  try {
    const table = userType === "employee" ? "employee_pass" : "customer_identifier";
    const idField = userType === "employee" ? "employee_id" : "customer_id";

    const rows = await db.query(
      `SELECT two_factor_otp, two_factor_expiry FROM ${table} WHERE ${idField} = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return { status: "fail", message: "User not found" };
    }

    const user = rows[0];
    const now = new Date();

    if (user.two_factor_otp !== otp || now > new Date(user.two_factor_expiry)) {
      return { status: "fail", message: "Invalid or expired verification code" };
    }

    // Clear OTP after verification
    await db.query(
      `UPDATE ${table} SET two_factor_otp = NULL, two_factor_expiry = NULL WHERE ${idField} = ?`,
      [userId]
    );

    return { status: "success", message: "Verification successful" };
  } catch (error) {
    console.error("Error verifying 2FA:", error);
    return { status: "fail", message: "Something went wrong verifying code" };
  }
}

// --------------------------------------------------
// Forgot password
// --------------------------------------------------
async function forgotPassword(email) {
  try {
    const employee = await employeeService.getEmployeeByEmail(email);
    const customer = await customerService.findCustomerByEmail(email);

    if (!employee && !customer) {
      return { status: "fail", message: "No user with that email exists." };
    }

    const isEmployee = employee && employee.length > 0;
    const userRecord = isEmployee ? employee : customer;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

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

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    const recipientEmail = isEmployee ? userRecord[0].employee_email : userRecord[0].customer_email;
    const firstName = userRecord[0].employee_first_name || userRecord[0].customer_first_name || "User";

    await sendEmail(
      recipientEmail,
      "Password Reset Request",
      `Hello ${firstName},\n\nYou requested a password reset. Click the link below:\n${resetLink}\n\nThis link will expire in 1 hour.`
    );

    return { status: "success", message: "Password reset link sent to your email address." };
  } catch (err) {
    console.error("Error in loginService.forgotPassword:", err);
    return { status: "fail", message: "Something went wrong. Please try again later." };
  }
}

// --------------------------------------------------
// Reset password
// --------------------------------------------------
async function resetPassword(token, newPassword) {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [employee] = await db.query(
      "SELECT * FROM employee_pass WHERE reset_token = ? AND token_expiry > NOW()",
      [hashedToken]
    );

    if (employee.length > 0) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query(
        "UPDATE employee_pass SET employee_password_hashed = ?, reset_token = NULL, token_expiry = NULL WHERE employee_id = ?",
        [hashedPassword, employee[0].employee_id]
      );
      return { status: "success", message: "Employee password reset successful" };
    }

    const [customer] = await db.query(
      "SELECT * FROM customer_identifier WHERE reset_token = ? AND token_expiry > NOW()",
      [hashedToken]
    );

    if (customer.length > 0) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query(
        "UPDATE customer_identifier SET customer_password_hashed = ?, reset_token = NULL, token_expiry = NULL WHERE customer_id = ?",
        [hashedPassword, customer[0].customer_id]
      );
      return { status: "success", message: "Customer password reset successful" };
    }

    return { status: "fail", message: "Invalid or expired reset token" };
  } catch (err) {
    console.error("Error resetting password:", err);
    throw err;
  }
}

// --------------------------------------------------
// Find user by username
// --------------------------------------------------
async function findUserByUsername(username) {
  const query = `
    SELECT * FROM customer_info WHERE customer_username = ? 
    UNION 
    SELECT * FROM employee WHERE employee_username = ?;
  `;
  const rows = await db.query(query, [username, username]);
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  register,
  logIn,
  verify2FA,
  forgotPassword,
  resetPassword,
  findUserByUsername,
};





