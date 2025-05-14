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
    const employeeData = req.body;

    // Call the logIn method from the login service 
    const employee = await loginService.logIn(employeeData);

    // If the employee is not found
    if (employee.status === "fail") {
      res.status(403).json({status: employee.status, message: employee.message});
      return;
    }
    // If successful, send a response to the client
    const payload = {
      employee_id: employee.data.employee_id,
      employee_username: employee.data.employee_username,
      employee_first_name: employee.data.employee_first_name,
      employee_last_name: employee.data.employee_last_name,
      employee_email: employee.data.employee_email,
      employee_phone: employee.data.employee_phone,
      employee_role: employee.data.company_role_id,
      employee_profile_picture: employee.data.employee_profile_picture
    };

    // Generate a JWT token
    const token = jwt.sign(payload, jwtSecret, {expiresIn: "24h"});
    const sendBack = {employee_token: token};
    const employeeInfo = employee.data;
    res.status(200).json({status: "success", message: "Employee logged in successfully", data: {sendBack, employeeInfo}});
  } catch (error) {
    res.status(400).json({error: "Something went wrong!"});
  }
}

module.exports = {logIn, register};