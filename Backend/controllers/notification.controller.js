const notificationService = require('../services/notification.service');

// function to get all notifications for a specific customer by email
const getNotifications = async (req, res) => {
    console.log("req.query", req.query);
    const { customer_id } = req.query;

    if (!customer_id) {
        return res.status(400).json({ error: "Customer ID is required" });
    }

    try {
        const notifications = await notificationService.getNotificationsById(customer_id);
        res.json(notifications);
    } catch (err) {
        console.error("Error fetching notifications by email:", err.message);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// function to update notification as read
const updateNotification = async (req, res) => {
    console.log("req.body", req.body);
    const { notification_id } = req.body;

    if (!notification_id) {
        return res.status(400).json({ error: "Notification ID is required" });
    }

    try {
        const notification = await notificationService.markNotificationAsRead(notification_id);
        res.json(notification);
    } catch (err) {
        console.error("Error updating notification:", err.message);
        res.status(500).json({ error: "Failed to update notification" });
    }
};

// function to update all notifications as read
const updateAllNotifications = async (req, res) => {
    console.log("req.body", req.body);
    const { notification_ids } = req.body;

    if (!Array.isArray(notification_ids) || notification_ids.length === 0) {
        return res
            .status(400)
            .json({ error: "notification_ids array is required" });
    }

    try {
        const result = await notificationService.markAllNotificationsAsRead(
            notification_ids
        );
        res.json({ message: "Notifications marked as read", result });
    } catch (err) {
        console.error("Error updating notifications:", err.message);
        res.status(500).json({ error: "Failed to update notifications" });
    }
};

// function to delete notification
const deleteNotification = async (req, res) => {
    const { notification_id } = req.params;
    console.log("req.params", req.params);
    console.log("notification_id", notification_id);

    if (!notification_id) {
        return res.status(400).json({ error: "Notification ID is required" });
    }

    try {
        const notification = await notificationService.deleteNotificationById(
            notification_id
        );
        res.json(notification);
    } catch (err) {
        console.error("Error deleting notification:", err.message);
        res.status(500).json({ error: "Failed to delete notification" });
    }
};

// function to delete all notifications
const deleteAllNotifications = async (req, res) => {
    const { notification_ids } = req.body;

    // ✅ Validate input
    if (!Array.isArray(notification_ids) || notification_ids.length === 0) {
        return res
            .status(400)
            .json({ error: "notification_ids array is required" });
    }

    try {
        // ✅ Call the service
        const result = await notificationService.deleteAllNotifications(
            notification_ids
        );

        res.json({
            success: true,
            message: "Notifications deleted successfully",
            result,
        });
    } catch (err) {
        console.error("Error deleting notifications:", err.message);
        res.status(500).json({ error: "Failed to delete notifications" });
    }
};

module.exports = { getNotifications, updateNotification, updateAllNotifications, deleteNotification, deleteAllNotifications };