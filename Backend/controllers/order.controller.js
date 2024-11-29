const orderService = require("../services/order.service");

// Create a new order
const createOrder = async (req, res) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    order_description,
    estimated_completion_date,
    completion_date,
    order_completed,
    order_services,
  } = req.body;

  // Validate required fields
  if (
    !employee_id ||
    !customer_id ||
    !vehicle_id ||
    !order_description ||
    !order_services ||
    !Array.isArray(order_services)
  ) {
    return res.status(400).json({
      status: "fail",
      error: "Bad Request",
      message: "Missing or invalid required fields",
    });
  }

  try {
    // Create order in the database
    const newOrder = await orderService.createOrder({
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      estimated_completion_date,
      completion_date,
      order_completed,
      order_services,
    });

    // Return success response
    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(500).json({
      status: "fail",
      error: "Internal Server Error",
      message: "There was an issue creating the order. Please try again later.",
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and their details
    const orders = await orderService.getAllOrders();

    // Return successful response
    return res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    console.error('Error retrieving orders:', error.message);
    return res.status(500).json({
      status: 'fail',
      error: 'Internal Server Error',
      message: 'There was an issue retrieving the orders. Please try again later.',
    });
  }
};

module.exports = {createOrder, getAllOrders};
