const { validationResult, checkSchema } = require('express-validator');
const customerService = require('../services/customer.service');

// Validation schema for customer creation
const customerValidationSchema = checkSchema({
  customer_email: {
    isEmail: {
      errorMessage: 'Invalid email address',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  customer_phone_number: {
    isLength: {
      options: { min: 10 },
      errorMessage: 'Phone number must be at least 10 characters long',
    },
    notEmpty: {
      errorMessage: 'Phone number is required',
    },
  },
  customer_first_name: {
    notEmpty: {
      errorMessage: 'First name is required',
    },
  },
  customer_last_name: {
    notEmpty: {
      errorMessage: 'Last name is required',
    },
  },
});

// Middleware for validation
const validateCustomer = async (req, res, next) => {
  await Promise.all(customerValidationSchema.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', errors: errors.array() });
  }
  next();
};

// Create customer
const createCustomer = async (req, res) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
  } = req.body;

  try {
    // Check for duplicate email
    const existingCustomer = await customerService.findCustomerByEmail(
      customer_email
    );
    if (existingCustomer) {
      return res
        .status(409)
        .json({
          status: "fail",
          message: "Customer with this email already exists",
        });
    }

    // Create new customer
    await customerService.createCustomer({
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
    });

    return res
      .status(201)
      .json({ status: "success", message: "Customer created successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({
        status: "fail",
        message: "Failed to create customer",
        error: err.message,
      });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await customerService.getAllCustomers();

    // Successful response with the list of customers
    return res.status(200).json({ status: 'success', data: customers });
  } catch (err) {
    // Log the error and return an internal server error response
    console.error('Error retrieving customers:', err.message);
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to retrieve customers',
      error: err.message,
    });
  }
};

module.exports = {validateCustomer, createCustomer: [validateCustomer, createCustomer], getAllCustomers};