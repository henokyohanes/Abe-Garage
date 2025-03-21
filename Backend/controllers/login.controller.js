const loginService = require('../services/login.service');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

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
      employee_email: employee.data.employee_email,
      employee_role: employee.data.company_role_id,
      employee_first_name: employee.data.employee_first_name,
    };

    // Generate a JWT token
    const token = jwt.sign(payload, jwtSecret, {expiresIn: "24h"});
    const sendBack = {employee_token: token};
    res.status(200).json({status: "success", message: "Employee logged in successfully", data: sendBack});
  } catch (error) {
    res.status(400).json({error: "Something went wrong!"});
  }
}

module.exports = {logIn};