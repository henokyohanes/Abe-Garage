const db = require("../config/db.config");

// Find customer by email
const findCustomerByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM customers WHERE customer_email = ?', [email]);
  return rows.length ? rows[0] : null;
};

// Create a new customer
const createCustomer = async (customerData) => {
  const { customer_email, customer_phone_number, customer_first_name, customer_last_name } = customerData;
  await db.execute(
    'INSERT INTO customers (customer_email, customer_phone_number, customer_first_name, customer_last_name) VALUES (?, ?, ?, ?)',
    [customer_email, customer_phone_number, customer_first_name, customer_last_name]
  );
};

// Get all customers
const getAllCustomers = async () => {
  // Query to fetch all customers
  const [rows] = await db.execute('SELECT * FROM customers');
  return rows;
};

module.exports = {findCustomerByEmail, createCustomer, getAllCustomers};