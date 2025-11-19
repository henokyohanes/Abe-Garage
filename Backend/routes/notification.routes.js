const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Route to get notifications endpoint for specific customer
router.get('/api/notifications/by-Id', authMiddleware.verifyToken, notificationController.getNotifications);

// Route to make notification as read endpoint
router.put('/api/notifications/mark-read', authMiddleware.verifyToken, notificationController.updateNotification);

// Route to make all notifications as read endpoint
router.put('/api/notifications/mark-all-read', authMiddleware.verifyToken, notificationController.updateAllNotifications);

// Route to delete notification endpoint
router.delete('/api/notifications/delete/:notification_id', authMiddleware.verifyToken, notificationController.deleteNotification);

// Route to delete all notifications endpoint
router.delete('/api/notifications/delete-all', authMiddleware.verifyToken, notificationController.deleteAllNotifications);

module.exports = router;