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

// Get a single order by ID
const getOrderById = async (id) => {
  try {
    // Query to fetch order details and associated services
    const [order] = await db.execute(
      `
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
      WHERE o.id = ?
      GROUP BY o.id
    `,
      [id]
    );

    // If no order is found, return null
    return order.length > 0 ? order[0] : null;
  } catch (error) {
    throw error;
  }
};

// Update order and its associated services
const updateOrder = async (
  id,
  order_description,
  estimated_completion_date,
  completion_date,
  order_completed,
  order_services
) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Update order details
    const [result] = await connection.execute(
      `
      UPDATE orders
      SET
        order_description = ?,
        estimated_completion_date = ?,
        completion_date = ?,
        order_completed = ?
      WHERE id = ?
    `,
      [
        order_description,
        estimated_completion_date,
        completion_date,
        order_completed,
        id,
      ]
    );

    // Handle case where no rows were updated
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    // Update order_services if provided
    if (order_services && Array.isArray(order_services)) {
      // Delete existing services
      await connection.execute(
        `
        DELETE FROM order_services WHERE order_id = ?
      `,
        [id]
      );

      // Insert new services
      for (const service of order_services) {
        const { service_id, service_description, service_cost } = service;
        await connection.execute(
          `
          INSERT INTO order_services (order_id, service_id, service_description, service_cost)
          VALUES (?, ?, ?, ?)
        `,
          [id, service_id, service_description, service_cost]
        );
      }
    }

    // Commit transaction
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {createOrder, getAllOrders, getOrderById, updateOrder};
