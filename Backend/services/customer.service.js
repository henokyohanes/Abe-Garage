const db = require("../config/db.config");
const bcrypt = require("bcrypt");

// function to find customer by email
const findCustomerByEmail = async (email) => {
  console.log("email", email);
  try {
    // select customer by email
    const rows = await db.query(
      `SELECT * FROM customer_info 
      INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id
      WHERE customer_identifier.customer_email = ?`,
      [email]
    );
    console.log("rows", rows);

    return rows ? rows : null;

  } catch (error) {
    console.error("Error in findCustomerByEmail:", error.message);
    throw new Error("Database query failed");
  }
};

// Helper function to sanitize undefined values to null
const sanitize = (value) => value === undefined ? null : value;

// Function to create a new customer
const createCustomer = async (customerData) => {
  // Sanitize all incoming fields
  const customer_email = sanitize(customerData.customer_email);
  const customer_phone_number = sanitize(customerData.customer_phone_number);
  const customer_first_name = sanitize(customerData.customer_first_name);
  const customer_last_name = sanitize(customerData.customer_last_name);
  const active_customer_status = sanitize(customerData.active_customer_status);
  const customer_hash = sanitize(customerData.customer_hash);
  const customer_username = sanitize(customerData.customer_username);
  const customer_password = sanitize(customerData.customer_password);

  let result = null;

  // Generate a salt and hash the password
  let hashedPassword = null;

  if (customer_password !== null) {
    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(customer_password, salt);
    } catch (err) {
      console.error("Password hashing failed:", err.message);
      throw new Error("Failed to hash password");
    }
  }



  try {
    // Dynamic insert into customer_identifier
    const identifierQuery =
      customer_password === null
        ? `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash)
         VALUES (?, ?, ?)`
        : `INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash, customer_password_hashed)
         VALUES (?, ?, ?, ?)`;

    const identifierValues =
      customer_password === null
        ? [customer_email, customer_phone_number, customer_hash]
        : [
            customer_email,
            customer_phone_number,
            customer_hash,
            hashedPassword,
          ];

    result = await db.query(identifierQuery, identifierValues);

    const insertId = result.insertId ?? result[0]?.insertId;

    if (!insertId) {
      throw new Error(
        "Failed to retrieve insertId from customer_identifier insert."
      );
    }

    // Insert into customer_info
    const infoQuery = customer_username
      ? `INSERT INTO customer_info (customer_id, customer_username, customer_first_name, customer_last_name, active_customer_status)
         VALUES (?, ?, ?, ?, ?)`
      : `INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status)
         VALUES (?, ?, ?, ?)`;

    const infoValues = customer_username
      ? [
          insertId,
          customer_username,
          customer_first_name,
          customer_last_name,
          active_customer_status,
        ]
      : [
          insertId,
          customer_first_name,
          customer_last_name,
          active_customer_status,
        ];

    await db.query(infoQuery, infoValues);
    return {
      customer_id: insertId,
      customer_email,
      customer_first_name,
      customer_last_name,
    };
  } catch (error) {
    console.error("Error creating customer:", error.message);
    throw new Error("Failed to create customer");
  }
};


//function to get all customers
const getAllCustomers = async () => {
  // Fetch all customers
  const rows = await db.query(
    `SELECT customer_info.customer_id, customer_info.customer_first_name, customer_info.customer_last_name, 
    customer_info.active_customer_status, customer_identifier.customer_email, 
    customer_identifier.customer_phone_number, customer_identifier.customer_added_date 
    FROM customer_info 
    INNER JOIN customer_identifier 
    ON customer_info.customer_id = customer_identifier.customer_id
    ORDER BY customer_info.customer_id DESC;`
  );

  return rows;
};

// function to Get a customer by ID
const getCustomerById = async (id) => {
  const rows = await db.query(
    `SELECT customer_info.*, customer_identifier.*, customer_vehicle_info.vehicle_id, orders.order_id
    FROM customer_info 
    INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id
    LEFT JOIN customer_vehicle_info ON customer_info.customer_id = customer_vehicle_info.customer_id
    LEFT JOIN orders ON customer_info.customer_id = orders.customer_id
    WHERE customer_info.customer_id = ?`,
    [id]
  );

  return rows[0]; // Return the first row if found
};

// Function to update a customer
const updateCustomer = async (id, customerData) => {
  const {
    customer_first_name,
    customer_last_name,
    customer_username,
    customer_phone_number,
    customer_email,
    customer_password,
    active_customer_status,
    two_factor_enabled
  } = customerData;

  // Generate a salt and hash the password
  let hashedPassword = null;

  try {
    if (customer_password && customer_password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(customer_password, salt);
    }
  } catch (err) {
    console.error("Password hashing failed:", err.message);
    throw new Error("Failed to hash password");
  }


  const fieldsInfo = [];
  const valuesInfo = [];

  const fieldsIdentifier = [];
  const valuesIdentifier = [];

  if (customer_first_name) {
    fieldsInfo.push("customer_info.customer_first_name = ?");
    valuesInfo.push(customer_first_name);
  }

  if (customer_last_name) {
    fieldsInfo.push("customer_info.customer_last_name = ?");
    valuesInfo.push(customer_last_name);
  }

  if (customer_username) {
    fieldsInfo.push("customer_info.customer_username = ?");
    valuesInfo.push(customer_username);
  }

  if (active_customer_status !== undefined && active_customer_status !== null) {
    fieldsInfo.push("customer_info.active_customer_status = ?");
    valuesInfo.push(active_customer_status);
  }

  if (two_factor_enabled !== undefined && two_factor_enabled !== null) {
    fieldsInfo.push("customer_identifier.two_factor_enabled = ?");
    valuesInfo.push(two_factor_enabled);
  }

  if (customer_email) {
    fieldsIdentifier.push("customer_identifier.customer_email = ?");
    valuesIdentifier.push(customer_email);
  }

  if (customer_password) {
    fieldsIdentifier.push("customer_identifier.customer_password_hashed = ?");
    valuesIdentifier.push(hashedPassword);
  }

  if (customer_phone_number) {
    fieldsIdentifier.push("customer_identifier.customer_phone_number = ?");
    valuesIdentifier.push(customer_phone_number);
  }

  if (fieldsInfo.length === 0 && fieldsIdentifier.length === 0) {
    throw new Error("No fields provided for update");
  }

  const query = `
    UPDATE customer_info, customer_identifier
    SET ${fieldsInfo.join(", ")}
        ${fieldsInfo.length && fieldsIdentifier.length ? "," : ""}
        ${fieldsIdentifier.join(", ")}
    WHERE customer_info.customer_id = ?
    AND customer_identifier.customer_id = ?`;

  const values = [...valuesInfo, ...valuesIdentifier, id, id];

  try {
    const result = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Failed to update customer information");
  }
};

// function to delete a customer
const deleteCustomer = async (id) => {
  try {
    const result = await db.query(
      `DELETE customer_info, customer_identifier 
      FROM customer_info 
      INNER JOIN customer_identifier ON customer_info.customer_id = customer_identifier.customer_id 
      WHERE customer_info.customer_id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Failed to delete customer");
  }
};

module.exports = { findCustomerByEmail, createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };