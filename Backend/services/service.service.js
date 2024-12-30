const db = require("../config/db.config");

// Create a new service
const createService = async ({
  service_name,
  service_description
}) => {
  try {
    const result = await db.query(
      `
      INSERT INTO common_services (service_name, service_description)
      VALUES (?, ?)
    `,
      [service_name, service_description]
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
    const rows = await db.query(
      `
      SELECT
        service_id,
        service_name,
        service_description
      FROM
        common_services
      `
    );
    console.log(rows);
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
        service_id,
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

// Delete a service by ID
const deleteServiceById = async (id) => {
  try {
    const [result] = await db.execute('DELETE FROM services WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting service by ID:', error.message);
    throw error;
  }
};

module.exports = {createService, fetchAllServices, fetchServiceById, updateServiceById, deleteServiceById};
