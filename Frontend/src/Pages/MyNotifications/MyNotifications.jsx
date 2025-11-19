import React, { useEffect, useState } from "react";
import { Card, Button, Dropdown, Badge } from "react-bootstrap";
import { useAuth } from "../../Contexts/AuthContext";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import Layout from "../../Layout/Layout";
import styles from "./MyNotifications.module.css";
import notificationService from "../../services/notification.service";

const MyNotifications = () => {
    const { user, loading: authLoading } = useAuth();
    const [filter, setFilter] = useState("All");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Fetch notifications
    useEffect(() => {
        if (!user?.customer_id) return;
        
        fetchNotifications();
    }, [user?.customer_id]);
    
    const fetchNotifications = async () => {

        setLoading(true);
        setError(false);

        try {
            const response = await notificationService.getNotificationsByCustomerId(user.customer_id);
            console.log("response", response);

            // Add read=false if missing
            const processed = response.map((n) => ({
                ...n,
                read: n.notification_status ?? 0,
            }));

            // Sort newest first
            processed.sort(
                (a, b) => new Date(b.notification_date) - new Date(a.notification_date)
            );

            setNotifications(processed);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    
    // Single actions
    const handleMarkRead = async (notification_id) => {
        try {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === notification_id ? { ...n, read: 1 } : n
                )
            );
            await notificationService.markNotificationAsRead(notification_id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (notification_id) => {
        try {
            setNotifications((prev) =>
                prev.filter((n) => n.notification_id !== notification_id)
            );
            await notificationService.deleteNotificationById(notification_id);  
        } catch (err) {
            console.error(err);
        }
    };

    // Bulk actions
    // const handleMarkAllRead = async () => {
    //     try {
    //         setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
    //         await notificationService.markAllNotificationsAsRead(user?.customer_id);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };
    const handleMarkAllRead = async () => {
        try {
            const unreadIds = notifications
                .filter((n) => !n.read)
                .map((n) => n.notification_id);

            if (unreadIds.length === 0) return;

            // Optimistic UI update
            setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));

            // Send all IDs to the backend
            await notificationService.markAllNotificationsAsRead(unreadIds);
        } catch (err) {
            console.error(err);
        }
    };


    const handleDeleteAll = async () => {
        try {
            // Collect all notification IDs
            const allIds = notifications.map((n) => n.notification_id);

            if (allIds.length === 0) return;

            // Optimistic UI update
            const previous = notifications;
            setNotifications([]);

            // Send IDs to backend
            await notificationService.deleteAllNotifications(allIds);
        } catch (err) {
            console.error("Failed to delete notifications:", err);
            // Rollback UI if API fails
            setNotifications(previous);
        }
    };

            
            const getNotificationMessage = (notification) => {
                switch (notification.notification_type) {
                    case 0:
                return (
                    <p>
                        Your order on {notification.vehicle_year}{" "}
                        {notification.vehicle_make}{" "}{notification.vehicle_model}{" "}
                        has been created. Our technicians are working on it.
                    </p>
                );
                case 1:
                    return (
                        <p>
                        Your order on {notification.vehicle_year}{" "}
                        {notification.vehicle_make}{" "}{notification.vehicle_model}{" "}
                        is now completed and your vehicle is ready for pickup.
                    </p>
                );
                case 2:
                    return (
                        <p>
                        Your {notification.vehicle_year}{" "}{notification.vehicle_make}{" "}
                        {notification.vehicle_model}{" "}
                        has been picked up successfully.
                    </p>
                );
                default:
                    return <p>You have a new notification.</p>;
                }
            };
            
            // Function to handle page change
            const handlePageChange = (direction) => {
                if (direction === "next" && currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                } else if (direction === "prev" && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            };
            
            // Calculate total pages
            const totalPages = Math.ceil(notifications.length / itemsPerPage);
            const displayedNotifications = notifications.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            );

            // Group notifications by date (yyyy-mm-dd)
            const groupedByDate = displayedNotifications.reduce((acc, n) => {
                const dateKey = new Date(n.notification_date).toLocaleDateString();
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(n);
                return acc;
            }, {});
        
            // Notification type labels
            const typeLabels = {
                0: "New Order",
                1: "Ready for Pickup",
                2: "Picked Up",
            };

    return (
        <Layout>
            <div className={`${styles.notificationsContainer} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                        <div>
                                <h2>Notifications <span>_____</span></h2>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary">
                                        {filter}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilter("Unread")}>Unread</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilter("Read")}>Read</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilter("All")}>All</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            {notifications.length > 0 && (
                                <div className="mt-3 d-flex gap-2">
                                    <Button variant="outline-primary" onClick={handleMarkAllRead}>
                                        Mark all as read
                                    </Button>
                                    <Button variant="outline-danger" onClick={handleDeleteAll}>
                                        Delete all
                                    </Button>
                                </div>
                            )}
                            </div>

                            {notifications.length === 0 && (
                                <div className="text-center text-muted mt-4">
                                    You have no notifications.
                                </div>
                            )}

                            {Object.entries(groupedByDate).map(([date, items]) => {
                                // Apply filter
                                const visibleItems = items.filter((n) =>
                                    filter === "All"
                                        ? true
                                        : filter === "Unread"
                                            ? !n.read
                                            : n.read
                                );

                                if (visibleItems.length === 0) return null;

                                return (
                                    <div key={date} className="mb-3">
                                        <h5 className="text-muted">{date}</h5>
                                        {visibleItems.map((n) => (
                                            <Card
                                                key={n.notification_id}
                                                className={`mb-2 shadow-sm border-start border-4 ${n.notification_type === 0
                                                    ? "border-info"
                                                    : n.notification_type === 1
                                                        ? "border-warning"
                                                        : "border-danger"
                                                    }`}
                                            >
                                                <Card.Body className="d-flex justify-content-between">
                                                    <div>
                                                        <Card.Title className={!n.read ? "fw-bold" : ""}>
                                                            {/* Notification #{n.notification_id}{" "} */}
                                                            <Badge
                                                                bg={
                                                                    n.notification_type === 0
                                                                        ? "info"
                                                                        : n.notification_type === 1
                                                                            ? "warning"
                                                                            : "danger"
                                                                }
                                                                pill
                                                                className="ms-1"
                                                            >
                                                                {typeLabels[n.notification_type] || "Other"}
                                                            </Badge>
                                                            {n.read === 0 && (
                                                                <Badge bg="primary" pill className="ms-2">
                                                                    New
                                                                </Badge>
                                                            )}
                                                        </Card.Title>
                                                        <Card.Text as="div" className="mb-1">
                                                            {/* {getNotificationMessage(n.notification_type)} */}
                                                            {getNotificationMessage(n)}
                                                            <p>Thank you for choosing Abe Garage!</p>
                                                        </Card.Text>
                                                        <small className="text-muted">
                                                            {new Date(n.notification_date).toLocaleTimeString()}
                                                        </small>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {!n.read && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-success"
                                                                onClick={() => handleMarkRead(n.notification_id)}
                                                            >
                                                                Mark Read
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(n.notification_id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                );
                            })}

                            {/* Pagination */}
                            {notifications.length > 0 && <div className={styles.pagination}>
                                <button
                                    onClick={() => handlePageChange("prev")}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => handlePageChange("next")}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>}

                        </div>
                    ) : error ? (
                        <NotFound />
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MyNotifications;