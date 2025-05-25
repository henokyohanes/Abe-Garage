const db = require("../config/db.config");
const employeeService = require("./employee.service");
const customerService = require("./customer.service");
const bcrypt = require("bcrypt");

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


module.exports = { logIn, register };