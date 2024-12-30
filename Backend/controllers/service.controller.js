const serviceService = require("../services/service.service");

// Add a new service
const addService = async (req, res) => {
  try {
    const {service_name, service_description} = req.body;

    // Validate required fields
    if (!service_name || !service_description) {
      return res.status(400).json({
        status: "fail",
        error: "Bad Request",
        message: "Missing or invalid fields in the request body.",
      });
    }

    // Insert the service into the database
    const newService = await serviceService.createService({
      service_name,
      service_description
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
    const services = await serviceService.fetchAllServices();

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

// Get a single service by ID
const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch service details by ID
    const service = await serviceService.fetchServiceById(id);

    // If service not found
    if (!service) {
      return res.status(404).json({
        status: "fail",
        error: "Not Found",
        message: `Service with ID ${id} not found.`,
      });
    }

    // Successful response
    return res.status(200).json({
      status: "success",
      service,
    });
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error.message);
    return res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching the service.",
    });
  }
};

// Update service by ID
const updateService = async (req, res) => {
  const { id } = req.params;
  const { service_name, service_description } = req.body;

  // Validate input
  if (!service_name || !service_description) {
    return res.status(400).json({
      status: "fail",
      error: "Bad Request",
      message: "Missing required fields: service_name, service_description.",
    });
  }

  try {
    // Check if the service exists
    const serviceExists = await serviceService.fetchServiceById(id);

    if (!serviceExists) {
      return res.status(404).json({
        status: "fail",
        error: "Not Found",
        message: `Service with ID ${id} not found.`,
      });
    }

    // Update the service
    await serviceService.updateServiceById(
      id,
      service_name,
      service_description
    );

    return res.status(200).json({
      status: "success",
      message: "Service updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error.message);
    return res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
      message: "An unexpected error occurred while updating the service.",
    });
  }
};

// Delete service by ID
const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the service exists
    const serviceExists = await serviceService.fetchServiceById(id);

    if (!serviceExists) {
      return res.status(404).json({
        status: "fail",
        error: "Not Found",
        message: `Service with ID ${id} not found.`,
      });
    }

    // Delete the service
    await serviceService.deleteServiceById(id);

    return res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error.message);
    return res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
      message: "An unexpected error occurred while deleting the service.",
    });
  }
};

module.exports = {addService, getAllServices, getServiceById, updateService, deleteService};
