const db = require("../config/db.config");

// Create a new vehicle for a customer
const createVehicle = async (vehicleData) => {
    const {customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color} = vehicleData;

    try {
        const query = `INSERT INTO customer_vehicle_info 
        (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color];

        const result = await db.query(query, values);
        return result;
    } catch (error) {
        console.error("Error creating vehicle:", error.message);
        throw new Error("Failed to create vehicle");
    }
};

// Find a vehicle by its license plate
const findVehicleByTag = async (vehicle_tag) => {
    try {
        const query = "SELECT * FROM customer_vehicle_info WHERE vehicle_tag = ?";
        const vehicle = await db.query(query, [vehicle_tag]);
        return vehicle[0];
    } catch (error) {
        console.error("Error finding vehicle by tag:", error.message);
        throw new Error("Failed to find vehicle");
    }
};

// Get all vehicles of a specific customer
const getVehiclesByCustomerId = async (customerId) => {
    try {
        const query = "SELECT * FROM customer_vehicle_info WHERE customer_id = ?";
        const vehicles = await db.query(query, [customerId]);
        return vehicles;
    } catch (error) {
        console.error("Error retrieving vehicles by customer ID:", error.message);
        throw new Error("Failed to retrieve vehicles");
    }
};

// Get a single vehicle by its ID
const getVehicleById = async (vehicleId) => {
    try {
        const query = "SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?";
        const vehicle = await db.query(query, [vehicleId]);
        return vehicle[0];
    } catch (error) {
        console.error("Error retrieving vehicle by ID:", error.message);
        throw new Error("Failed to retrieve vehicle");
    }
};

// Update vehicle details
const updateVehicle = async (vehicle_id, vehicleData) => {
    const {vehicle_mileage, vehicle_tag, vehicle_color} = vehicleData;

    try {
        const query = `
      UPDATE customer_vehicle_info 
      SET vehicle_mileage = ?, vehicle_tag = ?, vehicle_color = ?
      WHERE vehicle_id = ?
    `;
        const values = [vehicle_mileage, vehicle_tag, vehicle_color, vehicle_id];

        const result = await db.query(query, values);
        return result;
    } catch (error) {
        console.error("Error updating vehicle:", error.message);
        throw new Error("Failed to update vehicle");
    }
};

// Delete a vehicle by its ID
const deleteVehicle = async (vehicleId) => {

    try {
        const query = "DELETE FROM customer_vehicle_info WHERE vehicle_id = ?";
        const result = await db.query(query, [vehicleId]);
        return result; // Return the result from the deletion
    } catch (error) {
        console.error("Error deleting vehicle:", error.message);
        throw new Error("Failed to delete vehicle");
    }
};

module.exports = {createVehicle, findVehicleByTag, getVehiclesByCustomerId, getVehicleById, updateVehicle, deleteVehicle};
