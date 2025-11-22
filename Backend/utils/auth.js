// utils/auth.js
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function createUserPayload(user) {
  return {
    user_id: user.employee_id || user.customer_id,
    user_name:
      user.employee_username || user.customer_username || user.customer_email,
    first_name: user.employee_first_name || user.customer_first_name,
    last_name: user.employee_last_name || user.customer_last_name,
    email: user.employee_email || user.customer_email,
    phone: user.employee_phone || user.customer_phone_number || null,
    company_role: user.company_role_id || null,
    profile_picture:
      user.employee_profile_picture || user.customer_profile_picture || null,
  };
}

function generateToken(user) {
  const payload = createUserPayload(user);
  return jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
}

module.exports = { createUserPayload, generateToken };