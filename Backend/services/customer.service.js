const db = require("../config/db.config");

// Find customer by email
const findCustomerByEmail = async (email) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM customer_info 
       INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id
       WHERE customer_identifier.customer_email = ?`,
      [email]
    );

    return rows ? rows : null;

  } catch (error) {
    console.error("Error in findCustomerByEmail:", error.message);
    throw new Error("Database query failed");
  }
};


// Create a new customer
const createCustomer = async (customerData) => {
  const {
    customer_email,
    customer_phone_number,
    customer_first_name,
    customer_last_name,
    active_customer_status,
    customer_hash
  } = customerData;

  try {
    // Insert into customer_info table
    const result = await db.query(
      `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)`,
      [customer_email, customer_phone_number, customer_hash]
    );

    // Check the result to ensure it's an array and contains insertId
    if (result && result.insertId) {
      const customer_id = result.insertId;

      // Insert into customer_info table using the generated customer_id
      await db.query(
        `INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)`,
        [
          customer_id,
          customer_first_name,
          customer_last_name,
          active_customer_status,
        ]
      );
    } else {
      throw new Error(
        "Failed to retrieve insertId from customer_identifier insert."
      );
    }
  } catch (error) {
    console.log("Error in createCustomer:", error);
    console.error("Error creating customer:", error.message);
    throw new Error("Failed to create customer");
  }
};

// Get all customers
const getAllCustomers = async () => {
  const rows = await db.query(
    `SELECT customer_info.customer_id, customer_info.customer_first_name, customer_info.customer_last_name, 
    customer_info.active_customer_status, customer_identifier.customer_email, customer_identifier.customer_phone_number, customer_identifier.customer_added_date 
    FROM customer_info 
    INNER JOIN customer_identifier 
    ON customer_info.customer_id = customer_identifier.customer_id;`
  );
  return rows;
};

// Get a customer by ID
const getCustomerById = async (id) => {
  const [rows] = await db.query(
    `SELECT customer_info.*, customer_identifier.* 
     FROM customer_info 
     INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id
     WHERE customer_info.customer_id = ?`,
    [id]
  );
  return rows[0]; // Return the first row if found
};

// Update customer information
const updateCustomer = async (id, customerData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(customerData)) {
    if (value) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }

  values.push(id);

  const query = `UPDATE customer_info SET ${fields.join(
    ", "
  )} WHERE customer_id = ?`;
  const [result] = await db.query(query, values);

  return result.affectedRows > 0;
};

module.exports = {findCustomerByEmail, createCustomer, getAllCustomers, getCustomerById, updateCustomer,};
