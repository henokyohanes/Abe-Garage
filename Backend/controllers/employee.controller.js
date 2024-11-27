const employeeService = require("../services/employee.service");

// Create the add employee controller
async function createEmployee(req, res, next) {
  // Check if employee email already exists in the database
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email
  );

  // If employee exists, send a response to the client
  if (employeeExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!",
    });
  } else {
    try {
      const employeeData = req.body;

      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee) {
        res.status(400).json({
          error: "Failed to add the employee!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

// Create the getAllEmployees controller
async function getAllEmployees(req, res, next) {
  // Call the getAllEmployees method from the employee service
  const employees = await employeeService.getAllEmployees();
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

// Controller for updating an employee
async function updateEmployee(req, res, next) {
  const employeeId = req.params.id;
  const employeeData = req.body;

  try {
    // Call the service function to update the employee
    const result = await employeeService.updateEmployee(employeeId, employeeData);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "Employee not found.") {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Controller for deleting an employee
async function deleteEmployee(req, res, next) {
  const employeeId = req.params.id;

  try {
    // Call the service function to delete the employee
    const result = await employeeService.deleteEmployee(employeeId);

    if (!result) {
      // If the employee does not exist, return 404
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createEmployee, getAllEmployees, updateEmployee, deleteEmployee };
