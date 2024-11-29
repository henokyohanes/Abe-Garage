const db = require("../config/db.config");

// Create a new order
const createOrder = async (orderData) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    order_description,
    estimated_completion_date,
    completion_date,
    order_completed,
    order_services,
  } = orderData;

  try {
    // Start a transaction
    await db.beginTransaction();

    // Insert the order into the orders table
    const [orderResult] = await db.execute(
      `INSERT INTO orders (employee_id, customer_id, vehicle_id, order_description, 
        estimated_completion_date, completion_date, order_completed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        customer_id,
        vehicle_id,
        order_description,
        estimated_completion_date,
        completion_date,
        order_completed,
      ]
    );

    const order_id = orderResult.insertId;

    // Insert associated order_services into the order_services table
    for (const service of order_services) {
      await db.execute(
        `INSERT INTO order_services (order_id, service_id, service_description, service_cost)
         VALUES (?, ?, ?, ?)`,
        [
          order_id,
          service.service_id,
          service.service_description,
          service.service_cost,
        ]
      );
    }

    // Commit the transaction
    await db.commit();

    // Return the newly created order ID
    return { order_id };
  } catch (error) {
    // Rollback the transaction on error
    await db.rollback();
    throw error;
  }
};

// Get all orders
const getAllOrders = async () => {
  try {
    // Query to fetch all orders along with associated order services
    const [orders] = await db.execute(`
      SELECT 
        o.id AS order_id,
        o.employee_id,
        o.customer_id,
        o.vehicle_id,
        o.order_description,
        o.order_date,
        o.estimated_completion_date,
        o.completion_date,
        o.order_completed,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'service_id', os.service_id,
            'service_description', os.service_description,
            'service_cost', os.service_cost
          )
        ) AS order_services
      FROM orders o
      LEFT JOIN order_services os ON o.id = os.order_id
      GROUP BY o.id
      ORDER BY o.order_date DESC
    `);

    return orders;
  } catch (error) {
    throw error;
  }
};

module.exports = {createOrder, getAllOrders};
