const express = require('express');
const router = express.Router();
const loginControllers = require("../controllers/login.controller");

// Route to handle customer register
router.post("/api/customer/register", loginControllers.register);

// Route to handle employee login
router.post("/api/user/login", loginControllers.logIn);

// route to handle forget password
router.post("/api/user/forgot-password", loginControllers.forgotPassword);

// route to handle reset password
router.post("/api/user/reset-password/:token", loginControllers.resetPassword);

module.exports = router;