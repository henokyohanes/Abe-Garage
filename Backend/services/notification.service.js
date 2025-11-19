const db = require("../config/db.config");

// function to get notifications by customer email
const getNotificationsById = async (customer_id) => {
    if (!customer_id) {
        throw new Error("customer_id is required");
    }

    // Get all notifications by customer email
    const notifications = await db.query(
        `
    SELECT
      n.*,
      ns.notification_status,
      vci.vehicle_year,
      vci.vehicle_make,
      vci.vehicle_model
    FROM notifications n
    JOIN notification_status ns ON n.notification_id = ns.notification_id   
    JOIN orders o ON n.order_id = o.order_id
    JOIN customer_vehicle_info vci ON o.vehicle_id = vci.vehicle_id
    WHERE o.customer_id = ?
    ORDER BY notification_date DESC
    `,
        [customer_id]
    );

    return notifications;
};

// function to mark notification as read
const markNotificationAsRead = async (notification_id) => {
    if (!notification_id) {
        throw new Error("notification_id is required");
    }

    // Mark notification as read
    const result = await db.query(
        `
    UPDATE notification_status
    SET notification_status = 1
    WHERE notification_id = ?
    `,
        [notification_id]
    );

    return result;
};

// function to mark all notifications as read
const markAllNotificationsAsRead = async (notification_ids) => {
    if (!Array.isArray(notification_ids) || notification_ids.length === 0) {
        throw new Error("notification_ids array is required");
    }

    // Create placeholders like "?, ?, ?"
    const placeholders = notification_ids.map(() => "?").join(",");

    // Batch update all notifications in a single query
    const result = await db.query(
        `
        UPDATE notification_status
        SET notification_status = 1
        WHERE notification_id IN (${placeholders})
        `,
        notification_ids
    );

    return result;
};

// function to delete a notification by ID
const deleteNotificationById = async (notification_id) => {
    if (!notification_id) {
        throw new Error("notification_id is required");
    }

    // Start a transaction for safety
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Delete related entries in notification_status first
        await connection.query(
            `
            DELETE FROM notification_status
            WHERE notification_id = ?
            `,
            [notification_id]
        );

        // 2. Delete the notification itself
        const [result] = await connection.query(
            `
            DELETE FROM notifications
            WHERE notification_id = ?
            `,
            [notification_id]
        );

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting notification:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// function to delete all notifications by Ids
const deleteAllNotifications = async (notification_ids) => {
    if (!Array.isArray(notification_ids) || notification_ids.length === 0) {
        throw new Error("notification_ids must be a non-empty array");
    }

    // Create placeholders like ?,?,?
    const placeholders = notification_ids.map(() => "?").join(",");

    try {
        // ✅ First delete from child table if FK exists
        await db.query(
            `DELETE FROM notification_status WHERE notification_id IN (${placeholders})`,
            notification_ids
        );

        // ✅ Then delete from main notifications table
        const result = await db.query(
            `DELETE FROM notifications WHERE notification_id IN (${placeholders})`,
            notification_ids
        );

        return result;
    } catch (err) {
        console.error("Error deleting notifications in service:", err);

        throw err;
    }
};

module.exports = {
    getNotificationsById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    deleteAllNotifications
};
