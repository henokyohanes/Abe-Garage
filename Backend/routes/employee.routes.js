const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

// Import the auth middleware
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add employee request on post
router.post("/api/employee", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.createEmployee);

// Create a route to handle the get all employees request on get
router.get("/api/employees", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.getAllEmployees);

module.exports = router;