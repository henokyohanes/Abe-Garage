const db = require("../config/db.config");
const employeeService = require("./employee.service");
const bcrypt = require("bcrypt");

// Handle employee login
async function logIn(employeeData) {
  try {
    let returnData = {};

    // Check if the employee exists
    const employee = await employeeService.getEmployeeByEmail(employeeData.employee_email);
    if (employee.length === 0) {
      returnData = {status: "fail", message: "Employee does not exist"};
      return returnData;
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(
      employeeData.employee_password,
      employee[0].employee_password_hashed
    );

    // If the password is incorrect
    if (!passwordMatch) {
      returnData = {status: "fail", message: "Incorrect password"};
      return returnData;
    }

    // If the password is correct
    returnData = {status: "success", data: employee[0]};
    return returnData;
  } catch (error) {
    console.error("Error logging in:", error);
    return {status: "fail", message: "Something went wrong"};
  }
}

module.exports = { logIn };
