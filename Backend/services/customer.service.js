const db = require("../config/db.config");

// Find customer by email
const findCustomerByEmail = async (email) => {
  try {
    const rows = await db.query(
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
    ON customer_info.customer_id = customer_identifier.customer_id ORDER BY customer_info.customer_id DESC;`
  );
  return rows;
};

// Get a customer by ID
const getCustomerById = async (id) => {
  const rows = await db.query(
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

  // Destructure the required fields from customerData
  const {
    customer_first_name,
    customer_last_name,
    customer_phone_number,
    active_customer_status,
  } = customerData;

  const fieldsInfo = [];
  const fieldsIdentifier = [];
  const values = [];

  // Map fields to their respective tables
  if (customer_first_name) {
    fieldsInfo.push("customer_info.customer_first_name = ?");
    values.push(customer_first_name);
  }
  if (customer_last_name) {
    fieldsInfo.push("customer_info.customer_last_name = ?");
    values.push(customer_last_name);
  }
  if (active_customer_status !== undefined && active_customer_status !== null) {
    fieldsInfo.push("customer_info.active_customer_status = ?");
    values.push(active_customer_status);
  }
  if (customer_phone_number) {
    fieldsIdentifier.push("customer_identifier.customer_phone_number = ?");
    values.push(customer_phone_number);
  }

  if (fieldsInfo.length === 0 && fieldsIdentifier.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Construct the SQL query
  const query = `
    UPDATE customer_info, customer_identifier
    SET ${fieldsInfo.join(", ")}${
    fieldsInfo.length > 0 && fieldsIdentifier.length > 0 ? "," : ""
  }
        ${fieldsIdentifier.join(", ")}
    WHERE customer_info.customer_id = ?
      AND customer_identifier.customer_id = ?
  `;

  // Add the customer_id to the values array
  values.push(id, id);

  try {
    const result = await db.query(query, values);

    if (result.affectedRows === 0) {
      console.log("No rows were updated.");
      return false;
    }

    console.log("Customer updated successfully.");
    return true;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Failed to update customer information");
  }
};



module.exports = {findCustomerByEmail, createCustomer, getAllCustomers, getCustomerById, updateCustomer,};
