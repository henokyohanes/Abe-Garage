const loginService = require('../services/login.service');
const customerService = require('../services/customer.service');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Handle customer register
async function register(req, res, next) {
  const customerData = req.body;
  const { customer_email } = customerData;

  try {
    // Check if customer already exists
    const existingCustomer = await customerService.findCustomerByEmail(
      customer_email
    );

    if (existingCustomer.length === 0) {
      // If not found, create new customer
      const newCustomer = await loginService.register(customerData);

      const payload = {
        customer_id: newCustomer.customer_id,
        customer_email: newCustomer.customer_email,
        customer_first_name: newCustomer.customer_first_name,
        customer_last_name: newCustomer.customer_last_name,
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
      const sendBack = { customer_token: token };

      return res.status(200).json({
        status: "success",
        message: "customer registered successfully",
        data: sendBack,
      });
    }

    // Customer exists and has password: already registered
    if (existingCustomer[0].customer_password) {
      return res.status(409).json({
        status: "fail",
        message: "Customer already exists",
      });
    }

    // Customer exists but no password: update and register
    await customerService.updateCustomer(
      existingCustomer[0].customer_id,
      customerData
    );

    const payload = {
      customer_id: existingCustomer[0].customer_id,
      customer_email: existingCustomer[0].customer_email,
      customer_first_name: existingCustomer[0].customer_first_name,
      customer_last_name: existingCustomer[0].customer_last_name,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
    const sendBack = { customer_token: token };

    return res.status(200).json({
      status: "success",
      message: "customer registered successfully",
      data: sendBack});
  } catch (error) {
    console.error("Error registering:", error);
    res.status(400).json({ status: "fail", message: "Something went wrong!" });
  }
}

// Handle employee login 
async function logIn(req, res, next) {
  try {
    const userData = req.body;

    // Call the logIn method from the login service 
    const response = await loginService.logIn(userData);

    // If the employee is not found
    if (response.status === "fail") {
      res.status(403).json({status: response.status, message: response.message});
      return;
    }

    const payload = {
      user_id: response.data.employee_id || response.data.customer_id,
      user_name: response.data.employee_username || response.data.customer_email,
      first_name: response.data.employee_first_name || response.data.customer_first_name,
      last_name: response.data.employee_last_name || response.data.customer_last_name,
      email: response.data.employee_email || response.data.customer_email,
      phone: response.data.employee_phone || response.data.customer_phone_number,
      company_role: response.data.company_role_id || null,
      profile_picture: response.data.employee_profile_picture || response.data.customer_profile_picture || null
    };

    // Generate a JWT token
    const token = jwt.sign(payload, jwtSecret, {expiresIn: "24h"});
    const sendBack = {user_token: token};
    const userInfo = response.data;
    res.status(200).json({status: "success", message: "user logged in successfully", data: {sendBack, userInfo}});
  } catch (error) {
    res.status(400).json({error: "Something went wrong!"});
  }
}

module.exports = {logIn, register};