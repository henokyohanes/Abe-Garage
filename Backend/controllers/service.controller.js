const serviceService = require("../services/service.service");

// Add a new service
const addService = async (req, res) => {
  try {
    const { service_name, service_description, service_cost } = req.body;

    // Validate required fields
    if (!service_name || !service_description || !service_cost) {
      return res.status(400).json({
        status: "fail",
        error: "Bad Request",
        message: "Missing or invalid fields in the request body.",
      });
    }

    // Insert the service into the database
    const newService = await serviceService.createService({
      service_name,
      service_description,
      service_cost,
    });

    if (!newService) {
      return res.status(500).json({
        status: "fail",
        error: "Internal Server Error",
        message: "Unable to create the service. Please try again later.",
      });
    }

    // Successful response
    return res.status(201).json({
      status: "success",
      message: "Service created successfully",
    });
  } catch (error) {
    console.error("Error creating service:", error.message);
    return res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Get all services
const getAllServices = async (req, res) => {
  try {
    // Fetch all services from the database
    const services = await serviceService.fetchAllServices();

    // Successful response
    return res.status(200).json({
      status: 'success',
      services,
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    return res.status(500).json({
      status: 'fail',
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while fetching services.',
    });
  }
};

module.exports = {addService, getAllServices};
