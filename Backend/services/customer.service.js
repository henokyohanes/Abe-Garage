const db = require("../config/db.config");

// Find customer by email
const findCustomerByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM customers WHERE customer_email = ?', [email]);
  return rows.length ? rows[0] : null;
};

// Create a new customer
const createCustomer = async (customerData) => {
  const { customer_email, customer_phone_number, customer_first_name, customer_last_name } = customerData;
  await db.query(
    'INSERT INTO customers (customer_email, customer_phone_number, customer_first_name, customer_last_name) VALUES (?, ?, ?, ?)',
    [customer_email, customer_phone_number, customer_first_name, customer_last_name]
  );
};

// Get all customers
const getAllCustomers = async () => {
  // Query to fetch all customers
  const [rows] = await db.query('SELECT customer_info.customer_first_name, customer_info.customer_last_name, customer_identifier.customer_email, customer_identifier.customer_phone_number FROM customer_info INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id');
  return rows;
};

// Get a customer by ID
const getCustomerById = async (id) => {
  // Query to fetch the customer by ID
  const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
  return rows[0]; // Return the first row if found
};

// Update customer information
const updateCustomer = async (id, customerData) => {
  const fields = [];
  const values = [];

  // Dynamically build query based on provided fields
  for (const [key, value] of Object.entries(customerData)) {
    if (value) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  // If no fields to update, throw an error
  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Add ID to values for the WHERE clause
  values.push(id);

  // Update query
  const query = `UPDATE customers SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await db.query(query, values);

  // Return updated rows
  return result.affectedRows > 0;
};

module.exports = {findCustomerByEmail, createCustomer, getAllCustomers, getCustomerById, updateCustomer};