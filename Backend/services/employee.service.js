const db = require("../config/db.config");
const bcrypt = require("bcrypt");

// A function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ? ";
  const rows = await db.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    // Insert the email in to the employee table
    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await db.query(query, [
      employee.employee_email,
      employee.active_employee,
    ]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false;
    }
    // Get the employee id from the insert
    const employee_id = rows.insertId;

    // Insert the remaining data in to the employee_info, employee_pass, and employee_role tables
    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await db.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);
    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await db.query(query3, [employee_id, hashedPassword]);
    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await db.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);

    // construct to the employee object to return
    createdEmployee = {
      employee_id: employee_id,
    };
  } catch (err) {
    console.log(err);
  }
  // Return the employee object
  return createdEmployee;
}
// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await db.query(query, [employee_email]);
  return rows;
}
// A function to get all employees
async function getAllEmployees() {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC limit 10";
  const rows = await db.query(query);
  return rows;
}
// A function to update an employee
async function updateEmployee(employeeId, employeeData) {
  try {
    // Check if the employee exists
    const existingEmployee = await getEmployeeByEmail(
      employeeData.employee_email
    );
    if (!existingEmployee) {
      throw new Error("Employee not found.");
    }

    // Start building the update query
    let updateQuery = "UPDATE employee SET ";
    let values = [];

    // Update employee email or other fields as needed
    if (employeeData.employee_email) {
      updateQuery += "employee_email = ?, ";
      values.push(employeeData.employee_email);
    }

    // Update active employee status
    if (employeeData.active_employee !== undefined) {
      updateQuery += "active_employee = ?, ";
      values.push(employeeData.active_employee);
    }

    updateQuery = updateQuery.slice(0, -2); // Remove trailing comma and space
    updateQuery += " WHERE employee_id = ?";
    values.push(employeeId);

    const updateResult = await db.query(updateQuery, values);

    // If password is provided, hash and update it
    if (employeeData.employee_password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        employeeData.employee_password,
        salt
      );

      const updatePasswordQuery =
        "UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?";
      await db.query(updatePasswordQuery, [hashedPassword, employeeId]);
    }

    // Update employee info
    const updateInfoQuery =
      "UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?";
    await db.query(updateInfoQuery, [
      employeeData.employee_first_name,
      employeeData.employee_last_name,
      employeeData.employee_phone,
      employeeId,
    ]);

    // Update employee role if provided
    if (employeeData.company_role_id) {
      const updateRoleQuery =
        "UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?";
      await db.query(updateRoleQuery, [
        employeeData.company_role_id,
        employeeId,
      ]);
    }

    return { message: "Employee updated successfully" };
  } catch (err) {
    console.error("Error updating employee:", err);
    throw new Error("Failed to update employee.");
  }
}

// Service function to delete an employee
async function deleteEmployee(employeeId) {
  // Verify the employee exists
  const checkQuery = "SELECT * FROM employee WHERE employee_id = ?";
  const rows = await db.query(checkQuery, [employeeId]);

  if (rows.length === 0) {
    // Employee does not exist
    return false;
  }

  // Proceed with deletion
  const deleteQuery = "DELETE FROM employee WHERE employee_id = ?";
  const result = await db.query(deleteQuery, [employeeId]);

  return result.affectedRows === 1; // Return true if deletion was successful
}

module.exports = {checkIfEmployeeExists, createEmployee, getEmployeeByEmail, getAllEmployees, updateEmployee, deleteEmployee};
