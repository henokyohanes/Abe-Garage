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

module.exports = {createService};
