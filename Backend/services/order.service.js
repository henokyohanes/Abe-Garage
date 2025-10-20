const db = require("../config/db.config");
const nodemailer = require("nodemailer");

// Email transporter setup (Gmail example)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Notification types
const NOTIFICATION_TYPES = {
  ORDER_CREATED: 0,
  READY_FOR_PICKUP: 1,
  PICKED_UP: 2,
};

// function to Create a new order
// const createOrder = async (orderData) => {
//   const {
//     employee_id,
//     customer_id,
//     vehicle_id,
//     technician_id,
//     service_ids,
//     active_order,
//     order_hash,
//     order_total_price,
//     additional_request,
//     additional_requests_completed,
//     service_completed,
//     order_status,
//     pickup_status,
//   } = orderData;

//   // Get a connection from the pool
//   const connection = await db.getConnection();

//   try {
//     // Start a transaction
//     await connection.beginTransaction();

//     // Insert the order into the orders table
//     const [orderResult] = await connection.query(
//       `INSERT INTO orders (employee_id, customer_id, vehicle_id, technician_id, order_hash, active_order) 
//       VALUES (?, ?, ?, ?, ?, ?)`,
//       [
//         employee_id,
//         customer_id,
//         vehicle_id,
//         technician_id,
//         order_hash,
//         active_order,
//       ]
//     );

//     // Get the inserted order ID
//     const order_id = orderResult.insertId;

//     // Insert associated order_services into the order_services table
//     await connection.query(
//       `INSERT INTO order_info (order_id, order_total_price, additional_request, additional_requests_completed)
//       VALUES (?, ?, ?, ?)`,
//       [
//         order_id,
//         order_total_price,
//         additional_request,
//         additional_requests_completed,
//       ]
//     );

//     // Insert associated order_services into the order_services table
//     const placeholders = service_ids.map(() => "(?, ?, ?)").join(", ");
//     const values = service_ids.flatMap((service_id) => [
//       order_id,
//       service_id,
//       service_completed,
//     ]);

//     // Execute the query
//     await connection.query(
//       `INSERT INTO order_services (order_id, service_id, service_completed)
//       VALUES ${placeholders}`,
//       values
//     );

//     // Insert order status into the `order_status` table
//     await connection.query(
//       `INSERT INTO order_status (order_id, order_status)
//       VALUES (?, ?)`,
//       [order_id, order_status]
//     );

//     // Insert pickup status into the `pickup_status` table
//     await connection.query(
//       `INSERT INTO pickup_status (order_id, pickup_status)
//       VALUES (?, ?)`,
//       [order_id, pickup_status]
//     );

//     // Insert notification into the `notification` table
//     await connection.query(
//       `INSERT INTO notification (order_id, employee_id, customer_id)
//       VALUES (?, ?, ?)`,
//       [order_id, employee_id, customer_id]
//     );

//     // Commit the transaction
//     await connection.commit();

//     // Release the connection back to the pool
//     connection.release();

//     // Return the newly created order ID
//     return { order_id };
//   } catch (error) {
//     // Rollback the transaction on error
//     await connection.rollback();
//     connection.release();
//     throw error;
//   }

//   // Function to create notification
//   const [customerRows] = await connection.query(
//     `SELECT cid.customer_id, cid.customer_email, ci.customer_first_name, ci.customer_last_name, cvi.vehicle_make, cvi.vehicle_model, cvi.vehicle_year
//        FROM customer_identifier cid
//        JOIN customer_info ci ON ci.customer_id = cid.customer_id
//        JOIN customer_vehicle_info cvi ON cid.vehicle_id = o.vehicle_id
//        JOIN orders o ON o.customer_id = cid.customer_id
//        WHERE o.order_id = ?`,
//     [order_id]
//   );

//   const customer = customerRows[0];

//   const createNotification = async (order_id) => {
//     // Insert notification into the `notifications` table
//     await db.query(
//       `INSERT INTO notifications (order_id, notification_type)
//       VALUES (?, 0)`,
//       [order_id]
//     );
//   };

//   // 3. Send confirmation email
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: customer.email,
//     subject: "Your Order has Been Created",
//     html: `
//       <h3>Hello ${customer.first_name} ${customer.last_name},</h3>
//       <p>Your order on ${customer.vehicle_year} ${customer.vehicle_make} ${customer.vehicle_model} is now created and our technicians working on it.</p>
//       <p>Thank you for choosing Abe Garage!</p>
//     `,
//   });
// };

const createOrder = async (orderData) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    technician_id,
    service_ids,
    active_order,
    order_hash,
    order_total_price,
    additional_request,
    additional_requests_completed,
    service_completed,
    order_status,
    pickup_status,
  } = orderData;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert into orders
    const [orderResult] = await connection.query(
      `INSERT INTO orders (employee_id, customer_id, vehicle_id, technician_id, order_hash, active_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        customer_id,
        vehicle_id,
        technician_id,
        order_hash,
        active_order,
      ]
    );
    const order_id = orderResult.insertId;

    // 2. Insert order_info
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

    // 3. Insert order_services
    if (service_ids && service_ids.length > 0) {
      const placeholders = service_ids.map(() => "(?, ?, ?)").join(", ");
      const values = service_ids.flatMap((service_id) => [
        order_id,
        service_id,
        service_completed,
      ]);
      await connection.query(
        `INSERT INTO order_services (order_id, service_id, service_completed)
         VALUES ${placeholders}`,
        values
      );
    }

    // 4. Insert statuses
    await connection.query(
      `INSERT INTO order_status (order_id, order_status) VALUES (?, ?)`,
      [order_id, order_status]
    );
    await connection.query(
      `INSERT INTO pickup_status (order_id, pickup_status) VALUES (?, ?)`,
      [order_id, pickup_status]
    );

    // 5. Insert notification (order created)
    const [notificationResult] = await connection.query(
      `INSERT INTO notifications (order_id, notification_type) VALUES (?, ?)`,
      [order_id, NOTIFICATION_TYPES.ORDER_CREATED]
    );

    const notification_id = notificationResult.insertId;
    console.log("notification_id", notification_id);

    // 6. Insert notification status
    await connection.query(
      `INSERT INTO notification_status (notification_id, notification_status) VALUES (?, 0)`,
      [notification_id]
    );

    await connection.commit();

    // 🔹 Fetch customer info after commit
    const customerRows = await db.query(
      `SELECT ci.customer_first_name, ci.customer_last_name, cid.customer_email,
              cvi.vehicle_make, cvi.vehicle_model, cvi.vehicle_year
       FROM orders o
       JOIN customer_info ci ON o.customer_id = ci.customer_id
       JOIN customer_identifier cid ON ci.customer_id = cid.customer_id
       JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
       WHERE o.order_id = ?`,
      [order_id]
    );

    if (customerRows.length > 0) {
      const customer = customerRows[0];
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customer.customer_email,
        subject: "Your Order has Been Created",
        html: `
          <h3>Hello ${customer.customer_first_name} ${customer.customer_last_name},</h3>
          <p>Your order on ${customer.vehicle_year} ${customer.vehicle_make} ${customer.vehicle_model} has been created. Our technicians are working on it.</p>
          <p>Thank you for choosing Abe Garage!</p>
        `,
      });
    }

    return { order_id };
  } catch (error) {
    if (connection) await connection.rollback();
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// function to Get all orders
const getAllOrders = async () => {
  try {
    // Get all orders
    // const orders = await db.query(
    //   `SELECT
    //     o.order_id,
    //     o.customer_id,
    //     o.vehicle_id,
    //     o.employee_id,
    //     o.order_date,
    //     ci.customer_first_name,
    //     ci.customer_last_name,
    //     cid.customer_email,
    //     cid.customer_phone_number,
    //     cvi.vehicle_make,
    //     cvi.vehicle_model,
    //     cvi.vehicle_year,
    //     cvi.vehicle_tag,
    //     ei.employee_first_name,
    //     ei.employee_last_name,
    //     os.order_status
    //   FROM 
    //     orders o
    //   LEFT JOIN 
    //     customer_info ci ON o.customer_id = ci.customer_id
    //   LEFT JOIN 
    //     customer_identifier cid ON o.customer_id = cid.customer_id
    //   LEFT JOIN 
    //     customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    //   LEFT JOIN 
    //     employee_info ei ON o.employee_id = ei.employee_id
    //   LEFT JOIN 
    //     order_status os ON o.order_id = os.order_id
    //   ORDER BY 
    //     o.order_date DESC;`
    // );

    const orders = await db.query(
      `SELECT
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.employee_id,
        o.technician_id,
        o.order_date,
        ci.customer_first_name,
        ci.customer_last_name,
        cid.customer_email,
        cid.customer_phone_number,
        cvi.vehicle_make,
        cvi.vehicle_model,
        cvi.vehicle_year,
        cvi.vehicle_tag,
        ei.employee_first_name AS employee_first_name,
        ei.employee_last_name  AS employee_last_name,
        ti.employee_first_name AS technician_first_name,
        ti.employee_last_name  AS technician_last_name,
        os.order_status,
        ps.pickup_status
      FROM 
        orders o
      LEFT JOIN 
        customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN 
        customer_identifier cid ON o.customer_id = cid.customer_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      LEFT JOIN 
        employee_info ei ON o.employee_id = ei.employee_id
      LEFT JOIN 
        employee_info ti ON o.technician_id = ti.employee_id
      LEFT JOIN 
        order_status os ON o.order_id = os.order_id
      LEFT JOIN 
        pickup_status ps ON o.order_id = ps.order_id
      ORDER BY 
        o.order_date DESC;`
    );

    return orders;
  } catch (error) {
    throw error;
  }
};

// function to get all orders for a specific customer
const getOrdersByCustomerId = async (customer_id) => {
  try {
    // Get all orders
    const orders = await db.query(
      `SELECT 
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        os.order_status,
        ps.pickup_status,
        oi.order_total_price,
        cvi.vehicle_year,
        cvi.vehicle_make,
        cvi.vehicle_model
      FROM 
        orders o
      LEFT JOIN
        order_status os ON o.order_id = os.order_id
      LEFT JOIN 
        pickup_status ps ON o.order_id = ps.order_id
      LEFT JOIN 
        order_info oi ON o.order_id = oi.order_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      WHERE 
        o.customer_id = ?
      ORDER BY 
        o.order_date DESC;`,
      [customer_id]
    );

    return orders;
  } catch (error) {
    console.error("Error retrieving orders for customer:", error);
    throw error;
  }
};

// function to Get a single order by ID
const getOrderById = async (id) => {
  try {
    // Get a single order
    // const order = await db.query(
    //   `SELECT 
    //     o.active_order,
    //     ci.customer_first_name,
    //     ci.customer_last_name,
    //     ci.active_customer_status,
    //     cid.customer_email,
    //     cid.customer_phone_number,
    //     cvi.vehicle_make,
    //     cvi.vehicle_model,
    //     cvi.vehicle_year,
    //     cvi.vehicle_tag,
    //     cvi.vehicle_mileage,
    //     cvi.vehicle_color,
    //     os.order_status,
    //     oi.additional_request,
    //     oi.additional_requests_completed,
    //     oi.order_total_price,
    //     DATE_FORMAT(oi.completion_date, '%Y-%m-%d') AS completion_date,
    //     oi.notes_for_internal_use,
    //     oi.notes_for_customer,
    //     (
    //       SELECT 
    //         JSON_ARRAYAGG(
    //             JSON_OBJECT(
    //                 'service_id', cs.service_id,
    //                 'service_name', cs.service_name,
    //                 'service_description', cs.service_description,
    //                 'service_completed', osrv.service_completed
    //             )
    //         )
    //       FROM 
    //         order_services osrv
    //       LEFT JOIN 
    //         common_services cs ON cs.service_id = osrv.service_id
    //       WHERE 
    //         osrv.order_id = o.order_id
    //     ) AS services
    //   FROM 
    //     orders o
    //   LEFT JOIN 
    //     customer_info ci ON o.customer_id = ci.customer_id
    //   LEFT JOIN 
    //     customer_identifier cid ON o.customer_id = cid.customer_id
    //   LEFT JOIN 
    //     customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    //   LEFT JOIN 
    //     employee_info ei ON o.employee_id = ei.employee_id
    //   LEFT JOIN 
    //     order_status os ON o.order_id = os.order_id
    //   LEFT JOIN 
    //     order_info oi ON o.order_id = oi.order_id
    //   WHERE 
    //     o.order_id = ?;`,
    //   [id]
    // );


    // const order = await db.query(
    //   `SELECT 
    //   o.active_order,
    //   ci.customer_first_name,
    //   ci.customer_last_name,
    //   ci.active_customer_status,
    //   cid.customer_email,
    //   cid.customer_phone_number,
    //   cvi.vehicle_make,
    //   cvi.vehicle_model,
    //   cvi.vehicle_year,
    //   cvi.vehicle_tag,
    //   cvi.vehicle_mileage,
    //   cvi.vehicle_color,
    //   os.order_status,
    //   ps.pickup_status,
    //   oi.additional_request,
    //   oi.additional_requests_completed,
    //   oi.order_total_price,
    //   DATE_FORMAT(oi.completion_date, '%Y-%m-%d') AS completion_date,
    //   oi.notes_for_internal_use,
    //   oi.notes_for_customer,
    //   (
    //     SELECT 
    //       JSON_ARRAYAGG(
    //         JSON_OBJECT(
    //           'service_id', cs.service_id,
    //           'service_name', cs.service_name,
    //           'service_description', cs.service_description,
    //           'service_completed', osrv.service_completed
    //         )
    //       )
    //     FROM order_services osrv
    //     LEFT JOIN common_services cs 
    //       ON cs.service_id = osrv.service_id
    //     WHERE osrv.order_id = o.order_id
    //   ) AS services,
    //   (
    //     SELECT 
    //       JSON_ARRAYAGG(
    //         JSON_OBJECT(
    //           'employee_id', ei.employee_id,
    //           'employee_first_name', ei.employee_first_name,
    //           'employee_last_name', ei.employee_last_name
    //         )
    //       )
    //     FROM employee_info ei
    //     INNER JOIN employee_role er 
    //       ON ei.employee_id = er.employee_id
    //     WHERE er.company_role_id = 1
    //   ) AS employees
    // FROM orders o
    // LEFT JOIN customer_info ci 
    //   ON o.customer_id = ci.customer_id
    // LEFT JOIN customer_identifier cid 
    //   ON o.customer_id = cid.customer_id
    // LEFT JOIN customer_vehicle_info cvi 
    //   ON o.vehicle_id = cvi.vehicle_id
    // LEFT JOIN order_status os 
    //   ON o.order_id = os.order_id
    // LEFT JOIN pickup_status ps 
    //   ON o.order_id = ps.order_id
    // LEFT JOIN order_info oi 
    //   ON o.order_id = oi.order_id
    // WHERE o.order_id = ?;`,
    //   [id]
    // );



    const order = await db.query(
      `SELECT 
      o.active_order,
      ci.customer_first_name,
      ci.customer_last_name,
      ci.active_customer_status,
      cid.customer_email,
      cid.customer_phone_number,
      cvi.vehicle_make,
      cvi.vehicle_model,
      cvi.vehicle_year,
      cvi.vehicle_tag,
      cvi.vehicle_mileage,
      cvi.vehicle_color,
      os.order_status,
      ps.pickup_status,
      oi.additional_request,
      oi.additional_requests_completed,
      oi.order_total_price,
      DATE_FORMAT(oi.completion_date, '%Y-%m-%d') AS completion_date,
      oi.notes_for_internal_use,
      oi.notes_for_customer,

      -- 👇 Technician name directly from technician_id
      tei.employee_id,
      tei.employee_first_name,
      tei.employee_last_name,

      (
        SELECT 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'service_id', cs.service_id,
              'service_name', cs.service_name,
              'service_description', cs.service_description,
              'service_completed', osrv.service_completed
            )
          )
        FROM order_services osrv
        LEFT JOIN common_services cs 
          ON cs.service_id = osrv.service_id
        WHERE osrv.order_id = o.order_id
      ) AS services,

      (
        SELECT 
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'employee_id', ei.employee_id,
              'employee_first_name', ei.employee_first_name,
              'employee_last_name', ei.employee_last_name
            )
          )
        FROM employee_info ei
        INNER JOIN employee_role er 
          ON ei.employee_id = er.employee_id
        WHERE er.company_role_id = 1
      ) AS employees

    FROM orders o
    LEFT JOIN customer_info ci 
      ON o.customer_id = ci.customer_id
    LEFT JOIN customer_identifier cid 
      ON o.customer_id = cid.customer_id
    LEFT JOIN customer_vehicle_info cvi 
      ON o.vehicle_id = cvi.vehicle_id
    LEFT JOIN order_status os 
      ON o.order_id = os.order_id
    LEFT JOIN pickup_status ps 
      ON o.order_id = ps.order_id
    LEFT JOIN order_info oi 
      ON o.order_id = oi.order_id

    -- 👇 Join technician info from orders.technician_id
    LEFT JOIN employee_info tei
      ON tei.employee_id = o.technician_id

    WHERE o.order_id = ?;`,
      [id]
    );




    return order
  } catch (error) {
    throw error;
  }
};

//function to get all orders for a specific employee
const getOrdersByEmployeeId = async (employee_id) => {
  try {
    // Get all orders
    const orders = await db.query(
      `SELECT 
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        os.order_status,
        oi.order_total_price,
        cvi.vehicle_year,
        cvi.vehicle_make,
        cvi.vehicle_model
      FROM 
        orders o
      LEFT JOIN 
        order_status os ON o.order_id = os.order_id
      LEFT JOIN 
        order_info oi ON o.order_id = oi.order_id
      LEFT JOIN 
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      WHERE 
        o.employee_id = ? 
      ORDER BY 
        o.order_date DESC;`,
      [employee_id]
    );

    return orders;
  } catch (error) {
    console.error("Error retrieving orders for employee:", error);
    throw error;
  }
};

//function to get all orders for a specific employee
const getTasksByEmployeeId = async (employee_id) => {
  try {
    // Get all orders
    const orders = await db.query(
      `SELECT 
        o.order_id,
        o.customer_id,
        o.vehicle_id,
        o.order_date,
        ts.task_status,
        oi.order_total_price,
        ci.customer_first_name,
        ci.customer_last_name,
        cid.customer_email,
        cid.customer_phone_number,
        cvi.vehicle_tag,
        cvi.vehicle_year,
        cvi.vehicle_make,
        cvi.vehicle_model,
        ei.employee_first_name,
        ei.employee_last_name
      FROM 
        orders o
      LEFT JOIN 
        tasks_status ts ON o.order_id = ts.order_id
      LEFT JOIN 
        order_info oi ON o.order_id = oi.order_id
      LEFT JOIN 
        customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN 
        customer_identifier cid ON o.customer_id = cid.customer_id
      LEFT JOIN
        customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
      LEFT JOIN
        employee_info ei ON o.employee_id = ei.employee_id
      WHERE 
        o.technician_id = ?
        AND (ts.task_status IS NULL OR ts.task_status <> 2) -- exclude status = 2
      ORDER BY 
        o.order_date DESC;`,
      [employee_id]
    );

    return orders;
  } catch (error) {
    console.error("Error retrieving orders for employee:", error);
    throw error;
  }
};

// function to Update order and its associated services
// const updateOrder = async (updatedData) => {
//   console.log("updatedData", updatedData);

//   const {
//     id,
//     technician_id,
//     additional_request,
//     additional_requests_completed,
//     order_status,
//     pickup_status,
//     active_order,
//     completion_date,
//     order_total_price,
//     notes_for_internal_use,
//     notes_for_customer,
//     services
//   } = updatedData;

//   const order_id = id;
//   let connection;

//   try {
//     // Get a connection from the pool
//     connection = await db.getConnection();

//     // Start a transaction
//     await connection.beginTransaction();

//     // Update `order_service` table for multiple `service_completed` fields
//     if (services && services.length > 0) {
//       const serviceUpdateCases = services
//         .map(
//           (service) =>
//             `WHEN service_id = ${service.service_id} THEN "${service.service_completed}"`
//         )
//         .join(" ");

//       // Generate a comma-separated list of service IDs
//       const serviceIds = services
//         .map((service) => service.service_id)
//         .join(", ");
//       await connection.query(
//         `UPDATE order_services
//         SET service_completed = CASE ${serviceUpdateCases} END
//         WHERE service_id IN (${serviceIds}) AND order_id = ?`,
//         [order_id]
//       );
//     }

//     // Update `order_info` table
//     await connection.query(
//       `UPDATE order_info SET 
//         additional_request = ?,
//         additional_requests_completed = ?,
//         completion_date = ?,
//         order_total_price = ?,
//         notes_for_internal_use = ?,
//         notes_for_customer = ?
//       WHERE order_id = ?`,
//       [
//         additional_request,
//         additional_requests_completed,
//         completion_date,
//         order_total_price,
//         notes_for_internal_use,
//         notes_for_customer,
//         order_id,
//       ]
//     );

//     // Update `order_status` table
//     await connection.query(
//       `UPDATE order_status SET order_status = ? WHERE order_id = ?`,
//       [order_status, order_id]
//     );

//     // Update `tasks_status` table
//     await connection.query(
//       `UPDATE tasks_status SET task_status = ? WHERE order_id = ?`,
//       [order_status, order_id]
//     );

//     // Update `pickup_status` table
//     await connection.query(
//       `UPDATE pickup_status SET pickup_status = ? WHERE order_id = ?`,
//       [pickup_status, order_id]
//     );

//     // Update `orders` table
//     await connection.query(
//       `UPDATE orders SET active_order = ?, technician_id = ? WHERE order_id = ?`,
//       [active_order, technician_id, order_id]
//     );

//     // 📌 If pickup is ready → Insert into notifications + Send email
//     const [customerRows] = await connection.query(
//       `SELECT cid.customer_id, cid.customer_email, ci.customer_first_name, ci.customer_last_name, cvi.vehicle_make, cvi.vehicle_model, cvi.vehicle_year
//        FROM customer_identifier cid
//        JOIN customer_info ci ON ci.customer_id = cid.customer_id
//        JOIN customer_vehicle_info cvi ON cid.vehicle_id = o.vehicle_id
//        JOIN orders o ON o.customer_id = cid.customer_id
//        WHERE o.order_id = ?`,
//       [order_id]
//     );

//     if (pickup_status === 1) {

//       if (customerRows.length > 0) {
//         const customer = customerRows[0];

//         // 2. Insert notification into `notifications` table
//         await connection.query(
//           `INSERT INTO notifications (order_id, notification_type)
//            VALUES (?, 1)`,
//           [order_id]
//         );

//         // 3. Send confirmation email
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: customer.email,
//           subject: "Your Vehicle is Ready for Pickup",
//           html: `
//       <h3>Hello ${customer.first_name} ${customer.last_name},</h3>
//       <p>Your order on ${customer.vehicle_year} ${customer.vehicle_make} ${customer.vehicle_model} is now completed and your vehicle is ready for pickup.</p>
//       <p>Thank you for choosing Abe Garage!</p>
//     `,
//         });
//       }
//     }

//     if (pickup_status === 2) {

//       if (customerRows.length > 0) {
//         const customer = customerRows[0];

//       // 2. Insert notification into `notifications` table
//       await connection.query(
//         `INSERT INTO notifications (order_id, notification_type)
//          VALUES (?, 2)`,
//         [order_id]
//       );

//       // 3. Send confirmation email
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: customer.email,
//         subject: "Your Vehicle picked up successfully",
//         html: `
//         <h3>Hello ${customer.first_name} ${customer.last_name},</h3>
//         <p>Your Vehicle ${customer.vehicle_year} ${customer.vehicle_make} ${customer.vehicle_model} has been picked up successfully on ${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}.</p>
//         <p>Thank you for choosing Abe Garage!</p>
//       `,
//       });
//       }
//     }

//     // Commit the transaction
//     await connection.commit();

//     return { success: true, message: "Order updated successfully" };
//   } catch (error) {
//     // Rollback on error
//     if (connection) await connection.rollback();
//     console.error("Error updating order:", error.message);
//     throw new Error("Failed to update the order");
//   } finally {
//     // Release the connection back to the pool
//     if (connection) await connection.release();
//   }
// };

const updateOrder = async (updatedData) => {
  const {
    id,
    technician_id,
    additional_request,
    additional_requests_completed,
    order_status,
    pickup_status,
    active_order,
    completion_date,
    order_total_price,
    notes_for_internal_use,
    notes_for_customer,
    services,
  } = updatedData;

  const order_id = id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Update services
    if (services && services.length > 0) {
      const serviceUpdateCases = services
        .map(
          (s) =>
            `WHEN service_id = ${s.service_id} THEN "${s.service_completed}"`
        )
        .join(" ");
      const serviceIds = services.map((s) => s.service_id).join(", ");

      await connection.query(
        `UPDATE order_services
         SET service_completed = CASE ${serviceUpdateCases} END
         WHERE service_id IN (${serviceIds}) AND order_id = ?`,
        [order_id]
      );
    }

    // 2. Update order_info
    await connection.query(
      `UPDATE order_info SET 
        additional_request = ?,
        additional_requests_completed = ?,
        completion_date = ?,
        order_total_price = ?,
        notes_for_internal_use = ?,
        notes_for_customer = ?
      WHERE order_id = ?`,
      [
        additional_request,
        additional_requests_completed,
        completion_date,
        order_total_price,
        notes_for_internal_use,
        notes_for_customer,
        order_id,
      ]
    );

    // 3. Update statuses
    await connection.query(
      `UPDATE order_status SET order_status = ? WHERE order_id = ?`,
      [order_status, order_id]
    );
    await connection.query(
      `UPDATE tasks_status SET task_status = ? WHERE order_id = ?`,
      [order_status, order_id]
    );
    await connection.query(
      `UPDATE pickup_status SET pickup_status = ? WHERE order_id = ?`,
      [pickup_status, order_id]
    );

    // 4. Update orders
    await connection.query(
      `UPDATE orders SET active_order = ?, technician_id = ? WHERE order_id = ?`,
      [active_order, technician_id, order_id]
    );

    // // 5. Notifications (ready/picked up)
    // if (pickup_status === 1) {
    //   await connection.query(
    //     `INSERT INTO notifications (order_id, notification_type) VALUES (?, ?)`,
    //     [order_id, NOTIFICATION_TYPES.READY_FOR_PICKUP]
    //   );
    // } else if (pickup_status === 2) {
    //   await connection.query(
    //     `INSERT INTO notifications (order_id, notification_type) VALUES (?, ?)`,
    //     [order_id, NOTIFICATION_TYPES.PICKED_UP]
    //   );
    // }

    // 5. Notifications (ready/picked up)
    let notification_id = null;

    if (pickup_status === 1) {
      // Ready for pickup
      const [notificationResult] = await connection.query(
        `INSERT INTO notifications (order_id, notification_type)
     VALUES (?, ?)`,
        [order_id, NOTIFICATION_TYPES.READY_FOR_PICKUP]
      );
      notification_id = notificationResult.insertId;

      // Insert into notification_status
      await connection.query(
        `INSERT INTO notification_status (notification_id, notification_status)
     VALUES (?, 0)`,
        [notification_id] // or your default status value
      );
    } else if (pickup_status === 2) {
      // Picked up
      const [notificationResult] = await connection.query(
        `INSERT INTO notifications (order_id, notification_type)
     VALUES (?, ?)`,
        [order_id, NOTIFICATION_TYPES.PICKED_UP]
      );
      notification_id = notificationResult.insertId;

      // Insert into notification_status
      await connection.query(
        `INSERT INTO notification_status (notification_id, notification_status)
     VALUES (?, 0)`,
        [notification_id]
      );
    }

    await connection.commit();

    // 🔹 Fetch customer info & send emails after commit
    if (pickup_status === 1 || pickup_status === 2) {
      const customerRows = await db.query(
        `SELECT ci.customer_first_name, ci.customer_last_name, cid.customer_email,
                cvi.vehicle_make, cvi.vehicle_model, cvi.vehicle_year
         FROM orders o
         JOIN customer_info ci ON o.customer_id = ci.customer_id
         JOIN customer_identifier cid ON ci.customer_id = cid.customer_id
         JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
         WHERE o.order_id = ?`,
        [order_id]
      );

      console.log("customerRows", customerRows);

      if (customerRows.length > 0) {
        const customer = customerRows[0];
        console.log("Customer info mail:", customer);

        if (pickup_status === 1) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.customer_email,
            subject: "Your Vehicle is Ready for Pickup",
            html: `
              <h3>Hello ${customer.customer_first_name} ${customer.customer_last_name},</h3>
              <p>Your order on ${customer.vehicle_year} ${customer.vehicle_make} ${customer.vehicle_model} is now completed and your vehicle is ready for pickup.</p>
              <p>Thank you for choosing Abe Garage!</p>
            `,
          });
        } else if (pickup_status === 2) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.customer_email,
            subject: "Your Vehicle Picked Up Successfully",
            html: `
              <h3>Hello ${customer.customer_first_name} ${customer.customer_last_name
              },</h3>
              <p>Your ${customer.vehicle_year} ${customer.vehicle_make} ${customer.vehicle_model
              } has been picked up successfully on 
              ${new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}.</p>
              <p>Thank you for choosing Abe Garage!</p>
            `,
          });
        }
      }
    }

    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error("Failed to update the order: " + error.message);
  } finally {
    if (connection) connection.release();
  }
};

// function to Delete an order by ID
const deleteOrder = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Delete associated services first
    await connection.query(`DELETE FROM order_services WHERE order_id = ?`, [id]);

    // Delete from order_status
    await connection.query(`DELETE FROM order_status WHERE order_id = ?`, [id]);

    // Delete from order_info
    await connection.query(`DELETE FROM order_info WHERE order_id = ?`, [id]);

    // Delete the order
    const [result] = await connection.query(`DELETE FROM orders WHERE order_id = ?`, [id]);

    // Handle case where no rows were deleted
    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
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

// function to delete a service from an order
const deleteService = async (orderId, serviceId) => {
  // Get a connection from the pool
  const connection = await db.getConnection();

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Delete service from the services table
    const [result] = await connection.query(
      'DELETE FROM order_services WHERE order_id = ? AND service_id = ?',
      [orderId, serviceId]
    );

    // If no service was deleted
    if (result.affectedRows === 0) {
      await connection.rollback();
      throw new Error("Service not found.");
    }

    // Commit transaction
    await connection.commit();
    return { success: true, message: "Service deleted successfully." };
  } catch (error) {
    console.error("Error deleting service:", error);
    await connection.rollback();
    throw new Error("Failed to delete service.");
  } finally {
    connection.release();
  }
};

// Service to cancel additional request for an order
const cancelAdditionalRequest = async (orderId, additionalRequest, additionalRequestsCompleted) => {
  const connection = await db.getConnection();

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Update the additional request and status
    const [result] = await connection.query(
      'UPDATE order_info SET additional_request = ?, additional_requests_completed = ? WHERE order_id = ?',
      [additionalRequest, additionalRequestsCompleted, orderId]
    );

    // If the order doesn't exist
    if (result.affectedRows === 0) {
      await connection.rollback();
      throw new Error("Order not found.");
    }

    // Commit transaction
    await connection.commit();
    return { success: true, message: "Additional request canceled successfully." };
  } catch (error) {
    console.error("Error canceling additional request:", error);
    await connection.rollback();
    throw new Error("Failed to cancel additional request.");
  } finally {
    connection.release();
  }
};

// function to update task status
const updateTaskStatus = async (orderId) => {

  try {
    const result = await db.query(
      'UPDATE tasks_status SET task_status = 1 WHERE order_id = ?',
      [orderId]
    );
    return { success: true, message: "Task status updated successfully." };
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new Error("Failed to update task status.");
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, getOrdersByEmployeeId, getTasksByEmployeeId, updateOrder, deleteOrder, getOrdersByCustomerId, deleteService, cancelAdditionalRequest, updateTaskStatus };