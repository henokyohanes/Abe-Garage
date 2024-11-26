const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Create a route to handle the add employee request on post
router.post("/api/employee", employeeController.createEmployee);

// Create a route to handle the get all employees request on get
router.get("/api/employees", employeeController.getAllEmployees);

module.exports = router;