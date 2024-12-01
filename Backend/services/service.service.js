const db = require("../config/db.config");

// Create a new service
const createService = async ({
  service_name,
  service_description,
  service_cost,
}) => {
  try {
    const [result] = await db.execute(
      `
      INSERT INTO services (service_name, service_description, service_cost)
      VALUES (?, ?, ?)
    `,
      [service_name, service_description, service_cost]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error creating service:", error.message);
    throw error;
  }
};

// Fetch all services
const fetchAllServices = async () => {
  try {
    const [rows] = await db.execute(
      `
      SELECT
        id AS service_id,
        service_name,
        service_description
      FROM
        services
      `
    );
    return rows;
  } catch (error) {
    console.error('Error fetching all services:', error.message);
    throw error;
  }
};

// Fetch a single service by ID
const fetchServiceById = async (id) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT
        id AS service_id,
        service_name,
        service_description
      FROM
        services
      WHERE
        id = ?
      `,
      [id]
    );

    // Return the service if found, or null otherwise
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching service by ID:', error.message);
    throw error;
  }
};

// Update a service by ID
const updateServiceById = async (id, service_name, service_description) => {
  try {
    const [result] = await db.execute(
      `
      UPDATE services
      SET service_name = ?, service_description = ?
      WHERE id = ?
      `,
      [service_name, service_description, id]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating service by ID:', error.message);
    throw error;
  }
};

module.exports = {createService, fetchAllServices, fetchServiceById, updateServiceById};
