const db = require("../config/db.config");

// Create a new order
const createOrder = async (orderData) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    service_ids,
    active_order,
    order_hash,
    order_total_price,
    additional_request,
    additional_requests_completed,
    service_completed,
    order_status,
  } = orderData;

  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert the order into the orders table
    const [orderResult] = await connection.query(
      `INSERT INTO orders (employee_id, customer_id, vehicle_id, order_hash, active_order) 
       VALUES (?, ?, ?, ?, ?)`,
      [employee_id, customer_id, vehicle_id, order_hash, active_order]
    );

    const order_id = orderResult.insertId;

    // Insert associated order_services into the order_services table
    await connection.query(
      `INSERT INTO order_info (order_id, order_total_price, additional_request, additional_requests_completed)
       VALUES (?, ?, ?, ?)`,
      [
        order_id,
        order_total_price,
        additional_request,
        additional_requests_completed,
      ]
    );

    const placeholders = service_ids.map(() => "(?, ?, ?)").join(", ");
    const values = service_ids.flatMap((service_id) => [
      order_id,
      service_id,
      service_completed,
    ]);

    // Execute the query
    await connection.query(
      `INSERT INTO order_services (order_id, service_id, service_completed)
     VALUES ${placeholders}`,
      values
    );

    // Insert order status into the `order_status` table
    await connection.query(
      `INSERT INTO order_status (order_id, order_status)
       VALUES (?, ?)`,
      [order_id, order_status]
    );

    // Commit the transaction
    await connection.commit();

    // Release the connection back to the pool
    connection.release();

    // Return the newly created order ID
    return { order_id };
  } catch (error) {
    // Rollback the transaction on error
    await connection.rollback();
    connection.release(); // Ensure connection is released in case of an error
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

// Get all orders for a specific customer
const getOrdersByCustomerId = async (customer_id) => {
  try {
    const [orders] = await db.query(
      `
      SELECT 
    o.order_id,
    MAX(o.employee_id) AS employee_id,
    MAX(o.customer_id) AS customer_id,
    MAX(o.vehicle_id) AS vehicle_id,
    MAX(COALESCE(oi.additional_request, '')) AS order_description,
    MAX(o.order_date) AS order_date,
    MAX(COALESCE(oi.estimated_completion_date, '')) AS estimated_completion_date,
    MAX(COALESCE(oi.completion_date, '')) AS completion_date,
    MAX(COALESCE(os.order_status, 0)) AS order_completed,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'service_id', COALESCE(osv.service_id, 0),
            'service_description', COALESCE(cs.service_description, '')
        )
    ) AS order_services
FROM orders o
LEFT JOIN order_info oi ON o.order_id = oi.order_id
LEFT JOIN order_status os ON o.order_id = os.order_id
LEFT JOIN order_services osv ON o.order_id = osv.order_id
LEFT JOIN common_services cs ON osv.service_id = cs.service_id
WHERE o.customer_id = ?
GROUP BY o.order_id
ORDER BY o.order_date DESC;

      `,
      [customer_id]
    );

    return orders; // Return the list of orders
  } catch (error) {
    console.error("Error retrieving orders for customer:", error);
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

// Delete an order by ID
const deleteOrder = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Delete associated services first
    await connection.execute(
      `
      DELETE FROM order_services WHERE order_id = ?
    `,
      [id]
    );

    // Delete the order
    const [result] = await connection.execute(
      `
      DELETE FROM orders WHERE id = ?
    `,
      [id]
    );

    // Handle case where no rows were deleted
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null; // Indicates no order with the given ID
    }

    // Commit transaction
    await connection.commit();
    return true; // Indicates successful deletion
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getOrdersByCustomerId};
