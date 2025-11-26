import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

// Helper function to retrieve authentication headers
const getAuthHeaders = () => {
    const storedToken = JSON.parse(localStorage.getItem("user"));
    const token = storedToken?.user_token;
    console.log("token", token);
    return {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
};

// function to get notification for a specific customer by id
export const getNotificationsByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(`${api_url}/api/notifications/by-Id`, {
            params: { customer_id: customerId },
            ...getAuthHeaders(),
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error.response?.data?.message || "Failed to fetch notifications";
    }
};

// function to mark notification as read
export const markNotificationAsRead = async (notification_id) => {
    try {
        const response = await axios.put(`${api_url}/api/notifications/mark-read`, { notification_id }, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error.response?.data?.message || "Failed to mark notification as read";
    }
};

//function to mark all notifications as read
export const markAllNotificationsAsRead = async (notification_ids) => {
    try {
        const response = await axios.put(
            `${api_url}/api/notifications/mark-all-read`,
            { notification_ids },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw (
            error.response?.data?.message ||
            "Failed to mark all notifications as read"
        );
    }
};

// function to delete notification by id
export const deleteNotificationById = async (notification_id) => {
    try {
        const response = await axios.delete(`${api_url}/api/notifications/delete/${notification_id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error.response?.data?.message || "Failed to delete notification";
    }
};

// function to delete all notifications
export const deleteAllNotifications = async (notificationIds) => {
    try {
        const response = await axios.delete(`${api_url}/api/notifications/delete-all`, {
            data: { notification_ids: notificationIds }, // <— must use `data` in DELETE body
            ...getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting notifications:", error);
        throw error.response?.data?.message || "Failed to delete notifications";
    }
};


const notificationService = {
    getNotificationsByCustomerId,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    deleteAllNotifications
};

export default notificationService;