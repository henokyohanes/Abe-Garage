// const loginService = require('../services/login.service');
// const customerService = require('../services/customer.service');
// const jwt = require("jsonwebtoken");
// const jwtSecret = process.env.JWT_SECRET;

// // Handle customer register
// async function register(req, res, next) {
//   const customerData = req.body;
//   const { customer_email } = customerData;

//   try {
//     // Check if customer already exists
//     const existingCustomer = await customerService.findCustomerByEmail(
//       customer_email
//     );

//     if (existingCustomer.length === 0) {
//       // If not found, create new customer
//       const newCustomer = await loginService.register(customerData);

//       const payload = {
//         customer_id: newCustomer.customer_id,
//         customer_email: newCustomer.customer_email,
//         customer_first_name: newCustomer.customer_first_name,
//         customer_last_name: newCustomer.customer_last_name,
//       };

//       const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
//       const sendBack = { customer_token: token };

//       return res.status(200).json({
//         status: "success",
//         message: "customer registered successfully",
//         data: sendBack,
//       });
//     }

//     // Customer exists and has password: already registered
//     if (existingCustomer[0].customer_password_hashed) {
//       return res.status(409).json({
//         status: "fail",
//         message: "Customer already exists",
//       });
//     }

//     // Customer exists but no password: update and register
//     await customerService.updateCustomer(
//       existingCustomer[0].customer_id,
//       customerData
//     );

//     const payload = {
//       customer_id: existingCustomer[0].customer_id,
//       customer_email: existingCustomer[0].customer_email,
//       customer_first_name: existingCustomer[0].customer_first_name,
//       customer_last_name: existingCustomer[0].customer_last_name,
//     };

//     const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
//     const sendBack = { customer_token: token };

//     return res.status(200).json({
//       status: "success",
//       message: "customer registered successfully",
//       data: sendBack});
//   } catch (error) {
//     console.error("Error registering:", error);
//     res.status(400).json({ status: "fail", message: "Something went wrong!" });
//   }
// }

// // Handle user login 
// async function logIn(req, res, next) {
//   try {
//     const userData = req.body;

//     // Call the logIn method from the login service 
//     const response = await loginService.logIn(userData);

//     // If the employee is not found
//     if (response.status === "fail") {
//       res.status(403).json({status: response.status, message: response.message});
//       return;
//     }

//     const payload = {
//       user_id: response.data.employee_id || response.data.customer_id,
//       user_name: response.data.employee_username || response.data.customer_email,
//       first_name: response.data.employee_first_name || response.data.customer_first_name,
//       last_name: response.data.employee_last_name || response.data.customer_last_name,
//       email: response.data.employee_email || response.data.customer_email,
//       phone: response.data.employee_phone || response.data.customer_phone_number,
//       company_role: response.data.company_role_id || null,
//       profile_picture: response.data.employee_profile_picture || response.data.customer_profile_picture || null
//     };

//     // Generate a JWT token
//     const token = jwt.sign(payload, jwtSecret, {expiresIn: "24h"});
//     const sendBack = {user_token: token};
//     const userInfo = response.data;
//     res.status(200).json({status: "success", message: "user logged in successfully", data: {sendBack, userInfo}});
//   } catch (error) {
//     res.status(400).json({error: "Something went wrong!"});
//   }
// }

// // handle forgot password
// async function forgotPassword(req, res) {
//   const email = req.body.email;

//   if (!email) {
//     return res.json({ status: "fail", message: "Please provide your email" });
//   }

//   try {
//     const result = await loginService.forgotPassword(email);
//     return res.json({ status: "success", ...result });
//   } catch (err) {
//     console.error("Forgot password error:", err);
//     return res.json({ status: "fail", message: "Something went wrong!" });
//   }
// }

// // handle Reset Password
// async function resetPassword(req, res) {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   console.log(token, newPassword);

//   if (!newPassword || newPassword.length < 8) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Password must be at least 8 characters long",
//     });
//   }

//   try {
//     const result = await loginService.resetPassword(token, newPassword);
//     return res.status(200).json(result);
//   } catch (err) {
//     console.error("Reset password error:", err);
//     return res.status(500).json({
//       status: "fail",
//       message: "Something went wrong while resetting password.",
//     });
//   }
// }

// // Check username availability
// async function checkUsernameAvailability(req, res) {
//   try {
//     const { username } = req.query;

//     console.log("username", username);

//     if (!username) {
//       return res.status(400).json({ available: false, message: "Username is required" });
//     }

//     // Call a service method to check DB
//     const existingUser = await loginService.findUserByUsername(username);

//     if (existingUser) {
//       return res.json({ available: false, message: "Username already used" });
//     }

//     return res.json({ available: true });
//   } catch (error) {
//     console.error("Error checking username:", error);
//     res.status(500).json({ available: false, message: "Server error" });
//   }
// }


// module.exports = {logIn, register, forgotPassword, resetPassword, checkUsernameAvailability};



































const loginService = require("../services/login.service");
const employeeService = require("../services/employee.service");
const customerService = require("../services/customer.service");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/auth");

const jwtSecret = process.env.JWT_SECRET;

// ===================== REGISTER =====================
async function register(req, res) {
  const customerData = req.body;
  const { customer_email } = customerData;

  try {
    const existingCustomer = await customerService.findCustomerByEmail(
      customer_email
    );

    if (!existingCustomer.length) {
      const newCustomer = await loginService.register(customerData);
      const token = jwt.sign(
        {
          customer_id: newCustomer.customer_id,
          customer_email: newCustomer.customer_email,
          customer_first_name: newCustomer.customer_first_name,
          customer_last_name: newCustomer.customer_last_name,
        },
        jwtSecret,
        { expiresIn: "24h" }
      );
      return res
        .status(200)
        .json({
          status: "success",
          message: "Customer registered successfully",
          data: { customer_token: token },
        });
    }

    if (existingCustomer[0].customer_password_hashed) {
      return res
        .status(409)
        .json({ status: "fail", message: "Customer already exists" });
    }

    await customerService.updateCustomer(
      existingCustomer[0].customer_id,
      customerData
    );
    const token = jwt.sign(
      {
        customer_id: existingCustomer[0].customer_id,
        customer_email: existingCustomer[0].customer_email,
        customer_first_name: existingCustomer[0].customer_first_name,
        customer_last_name: existingCustomer[0].customer_last_name,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );
    return res
      .status(200)
      .json({
        status: "success",
        message: "Customer registered successfully",
        data: { customer_token: token },
      });
  } catch (error) {
    console.error("Error registering:", error);
    return res
      .status(400)
      .json({ status: "fail", message: "Something went wrong!" });
  }
}

// ===================== LOGIN =====================

async function logIn(req, res, next) {
  try {
    const userData = req.body;

    // Call the logIn method from the login service 
    const response = await loginService.logIn(userData);
    console.log("response controller", response  );

    // If the employee is not found
    if (response.status === "fail") {
      res.status(403).json({status: response.status, message: response.message});
      return;
    }

    // if (response.status === "success") {
      
    //   const payload = {
    //     user_id: response.data.employee_id || response.data.customer_id,
    //     user_name: response.data.employee_username || response.data.customer_email,
    //     first_name: response.data.employee_first_name || response.data.customer_first_name,
    //     last_name: response.data.employee_last_name || response.data.customer_last_name,
    //     email: response.data.employee_email || response.data.customer_email,
    //     phone: response.data.employee_phone || response.data.customer_phone_number,
    //     company_role: response.data.company_role_id || null,
    //     profile_picture: response.data.employee_profile_picture || response.data.customer_profile_picture || null
    //   };
      
    //   // Generate a JWT token
    //   const token = jwt.sign(payload, jwtSecret, {expiresIn: "24h"});
    //   const sendBack = {user_token: token};
    //   const userInfo = response.data;
    //   console.log("userInfo", userInfo, "sendBack", sendBack);
    //   res.status(200).json({status: "success", message: "user logged in successfully", data: {sendBack, userInfo}});
    // }


    else if (response.status === "success") {
      const token = generateToken(response.data);
      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: {
          user_token: token,
          userInfo: response.data,
        },
      });
    }

    else return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({error: "Something went wrong!"});
  }
}

// async function logIn(req, res) {
//   try {
//     const userData = req.body;
//     const response = await loginService.logIn(userData);
//     return res.status(200).json(response);
//   } catch (error) {
//     console.error("Login error:", error);
//     return res
//       .status(400)
//       .json({ status: "fail", message: "Something went wrong!" });
//   }
// }

// ===================== VERIFY 2FA =====================
async function verify2FA(req, res) {
  try {
    const { userId, userEmail, userType, otp } = req.body;
    console.log("userId", userId, "userEmail", userEmail, "userType", userType, "otp", otp);
    const verifyResponse = await loginService.verify2FA({
      userId,
      userEmail,
      userType,
      otp,
    });

    // if (verifyResponse.status !== "success")
    //   return res.status(400).json(verifyResponse);

    // const user = await loginService.findUserByUsername(userName);
    // const token = jwt.sign(
    //   {
    //     user_id: user.employee_id || user.customer_id,
    //     email: user.employee_email || user.customer_email,
    //     user_name: user.employee_username || user.customer_username,
    //     first_name: user.employee_first_name || user.customer_first_name,
    //     last_name: user.employee_last_name || user.customer_last_name,
    //     company_role: user.company_role_id || null,
    //     profile_picture:
    //       user.employee_profile_picture ||
    //       user.customer_profile_picture ||
    //       null,
    //   },
    //   jwtSecret,
    //   { expiresIn: "24h" }
    // );

    // return res
    //   .status(200)
    //   .json({
    //     status: "success",
    //     message: "2FA verification successful",
    //     data: { user_token: token, userInfo: user },
    //   });

    // const { generateToken } = require("../utils/auth");

    if (verifyResponse.status !== "success") {
      return res.status(400).json(verifyResponse);
    }

    const [employee] = await employeeService.getEmployeeByEmail(userEmail);
    const [customer] = await customerService.findCustomerByEmail(userEmail);
    
        if (!employee && !customer) {
          return { status: "fail", message: "The user does not exist" };
        }
    
        let user;
        if (employee) {
          user = employee;
        } else {
          user = customer;
        }
    const token = generateToken(user);

    return res.status(200).json({
      status: "success",
      message: "2FA verification successful",
      data: { user_token: token, userInfo: user },
    });

  } catch (error) {
    console.error("2FA verification error:", error);
    return res
      .status(500)
      .json({
        status: "fail",
        message: "Something went wrong verifying code.",
      });
  }
}

// ===================== FORGOT PASSWORD =====================
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email)
      return res.json({ status: "fail", message: "Please provide your email" });

    const result = await loginService.forgotPassword(email);
    return res.json(result);
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.json({ status: "fail", message: "Something went wrong!" });
  }
}

// ===================== RESET PASSWORD =====================
async function resetPassword(req, res) {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8)
    return res
      .status(400)
      .json({
        status: "fail",
        message: "Password must be at least 8 characters long",
      });

  try {
    const result = await loginService.resetPassword(token, newPassword);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Reset password error:", err);
    return res
      .status(500)
      .json({
        status: "fail",
        message: "Something went wrong while resetting password.",
      });
  }
}

// ===================== CHECK USERNAME AVAILABILITY =====================
async function checkUsernameAvailability(req, res) {
  try {
    const { username } = req.query;
    if (!username)
      return res
        .status(400)
        .json({ available: false, message: "Username is required" });

    const existingUser = await loginService.findUserByUsername(username);
    return res.json(
      existingUser
        ? { available: false, message: "Username already used" }
        : { available: true }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ available: false, message: "Server error" });
  }
}

module.exports = {
  register,
  logIn,
  verify2FA,
  forgotPassword,
  resetPassword,
  checkUsernameAvailability,
};

