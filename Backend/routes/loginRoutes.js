const express = require('express');
const router = express.Router();
const loginControllers = require("../controllers/loginController");

// Create a route to handle the login request on post
router.post("/api/employee/login", loginControllers.logIn);

module.exports = router;