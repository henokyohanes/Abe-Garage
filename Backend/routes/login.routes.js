const express = require('express');
const router = express.Router();
const loginControllers = require("../controllers/login.controller");

// Route to handle customer register
router.post("/api/customer/register", loginControllers.register);

// Route to handle employee login
router.post("/api/employee/login", loginControllers.logIn);

module.exports = router;