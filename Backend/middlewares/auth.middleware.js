require('dotenv').config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({status: "fail", message: "No token provided!"});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({status: "fail", message: "Unauthorized!"});
    }
    req.employee_email = decoded.email;
    next();
  });
}

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
  const employee_email = req.employee_email;
  const employee = await employeeService.getEmployeeByEmail(employee_email);
  if (employee[0].company_role_id === 3) {
    next();
  } else {
    return res.status(403).send({status: "fail", error: "Not an Admin!"});
  }
}

// Middleware to check admin or manager role
const isAdminOrManager = async (req, res, next) => {
  const employee_email = req.employee_email;
  const employee = await employeeService.getEmployeeByEmail(employee_email);
  console.log(employee);
  const role_id = employee[0].company_role_id;

  if (![2, 3].includes(role_id)) {
    return res.status(403).json({status: "fail", message: "You are not authorized to perform this action."});
  }
  next();
};

module.exports = { verifyToken, isAdmin, isAdminOrManager };