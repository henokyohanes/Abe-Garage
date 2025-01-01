const { validationResult, checkSchema } = require("express-validator");
const vehicleService = require("../services/vehicle.service");
const e = require("express");

// Validation schema for vehicle creation
const vehicleValidationSchema = checkSchema({
    vehicle_tag: {
        notEmpty: {
            errorMessage: "vehicle tag is required",
        },
        isLength: {
            options: { min: 6 },
            errorMessage: "vehicle tag must be at least 6 characters long",
        },
    },
    vehicle_make: {
        notEmpty: {
            errorMessage: "Make is required",
        },
    },
    vehicle_model: {
        notEmpty: {
            errorMessage: "Model is required",
        },
    },
    vehicle_year: {
        isInt: {
            options: { min: 1900, max: new Date().getFullYear() },
            errorMessage: "Year must be a valid year",
        },
        notEmpty: {
            errorMessage: "Year is required",
        },
    },
});

// Middleware for validation
const validateVehicle = async (req, res, next) => {
    await Promise.all(
        vehicleValidationSchema.map((validation) => validation.run(req))
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());  
        return res.status(400).json({ status: "fail", errors: errors.array() });
    }
    next();
};

// Create vehicle
const createVehicle = async (req, res) => {
    const {vehicle_make, vehicle_model, vehicle_year, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color} = req.body;
    const { customer_id } = req.params;

    try {
        // Check for duplicate license plate
        const existingVehicle = await vehicleService.findVehicleByTag(
            vehicle_tag
        );
        if (existingVehicle) {
            return res.status(409).json({
                status: "fail",
                message: "Vehicle with this license plate already exists",
            });
        }

        // Create new vehicle
        await vehicleService.createVehicle({customer_id, vehicle_make, vehicle_model, vehicle_year, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color});

        return res
            .status(201)
            .json({ status: "success", message: "Vehicle created successfully" });
    } catch (err) {
        console.error("Error creating vehicle:", err.message);
        return res.status(500).json({
            status: "fail",
            message: "Failed to create vehicle",
            error: err.message,
        });
    }
};

// Get all vehicles of a single customer
const getVehiclesByCustomerId = async (req, res) => {
    const { customer_id } = req.params;

    // Validate customer ID
    if (!customer_id || isNaN(customer_id)) {
        return res.status(400).json({
            status: "fail",
            error: "Bad Request",
            message: "The customer ID provided is invalid or missing",
        });
    }

    try {
        // Fetch all vehicles for the given customer
        const vehicles = await vehicleService.getVehiclesByCustomerId(customer_id);

        // If no vehicles are found
        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No vehicles found for this customer",
            });
        }

        // Return the list of vehicles
        return res.status(200).json({
            status: "success",
            data: vehicles,
        });
    } catch (err) {
        // Log the error and return an internal server error response
        console.error("Error retrieving vehicles:", err.message);
        return res.status(500).json({
            status: "fail",
            message: "Failed to retrieve vehicles",
            error: err.message,
        });
    }
};

// Get a single vehicle by ID
const getVehicleById = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: "fail",
            error: "Bad Request",
            message: "The vehicle ID provided is invalid or missing",
        });
    }

    try {
        // Fetch the vehicle by ID
        const vehicle = await vehicleService.getVehicleById(id);
        // If no vehicle is found
        if (!vehicle) {
            return res.status(404).json({
                status: "fail",
                error: "Vehicle not found",
                message: "The vehicle ID provided does not exist",
            });
        }

        // Return the vehicle data
        return res.status(200).json({
            status: "success",
            data: vehicle,
        });
    } catch (err) {
        // Log the error and return an internal server error response
        console.error("Error retrieving vehicle:", err.message);
        return res.status(500).json({
            status: "fail",
            message: "Failed to retrieve vehicle",
            error: err.message,
        });
    }
};

// Update vehicle information
const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { vehicle_license_plate, vehicle_make, vehicle_model, vehicle_year } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: "fail",
            error: "Bad Request",
            message: "The vehicle ID provided is invalid or missing",
        });
    }

    try {
        // Check if vehicle exists
        const existingVehicle = await vehicleService.getVehicleById(id);
        if (!existingVehicle) {
            return res.status(404).json({
                status: "fail",
                error: "Vehicle Not Found",
                message: "The vehicle ID provided does not exist.",
            });
        }

        // Update vehicle information
        const updatedVehicle = await vehicleService.updateVehicle(id, {vehicle_license_plate, vehicle_make, vehicle_model, vehicle_year});

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "Vehicle updated successfully",
            data: updatedVehicle,
        });
    } catch (err) {
        // Log the error and return an internal server error response
        console.error("Error updating vehicle:", err.message);
        return res.status(500).json({
            status: "fail",
            error: "Internal Server Error",
            message:
                "There was an issue updating the vehicle details. Please try again later.",
        });
    }
};

// Delete vehicle by ID
const deleteVehicle = async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
        return res.status(400).json({
            status: "fail",
            error: "Bad Request",
            message: "The vehicle ID provided is invalid or missing",
        });
    }

    try {
        // Check if vehicle exists
        const existingVehicle = await vehicleService.getVehicleById(id);
        if (!existingVehicle) {
            return res.status(404).json({
                status: "fail",
                error: "Vehicle Not Found",
                message: "The vehicle ID provided does not exist.",
            });
        }

        // Delete the vehicle
        await vehicleService.deleteVehicle(id);

        // Send success response
        return res.status(200).json({
            status: "success",
            message: "Vehicle deleted successfully",
        });
    } catch (err) {
        // Log the error and return an internal server error response
        console.error("Error deleting vehicle:", err.message);
        return res.status(500).json({
            status: "fail",
            error: "Internal Server Error",
            message: "There was an issue deleting the vehicle. Please try again later.",
        });
    }
};

module.exports = {validateVehicle, createVehicle: [validateVehicle, createVehicle], getVehiclesByCustomerId, getVehicleById, updateVehicle, deleteVehicle};
