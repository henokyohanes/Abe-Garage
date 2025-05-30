import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import vehicleService from "../../services/vehicle.service";
import customerService from "../../services/customer.service";
import orderService from "../../services/order.service";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./MyOrders.module.css";

const MyOrders = () => {

    const { isLogged, setIsLogged, user, isAdmin, isManager, isEmployee } = useAuth();
    
    const id = user?.customer_id;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get("redirect");

    // Fetch customer data, vehicles, and orders when id changes
    useEffect(() => {
        if (!id) return;
        fetchOrders();
    }, [id]);

    // Fetch orders for the customer
    const fetchOrders = async () => {

        setLoading(true);
        setError(false);

        try {
            const orderData = await orderService.fetchCustomerOrders(id);
            setOrders(orderData.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Delete an order of the customer
    const handleDeleteOrder = async (id) => {

        try {
            const result = await Swal.fire({
            title: "Are you sure you want to delete this order?",
            html: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes !",
            customClass: {
                popup: styles.popup,
                confirmButton: styles.confirmButton,
                cancelButton: styles.cancelButton,
                icon: styles.icon,
                title: styles.warningTitle,
                htmlContainer: styles.text,
            },
        });
            if (!result.isConfirmed) return;
                setLoading(true);
                setError(false);
                    await orderService.deleteOrder(id);
                    setOrders(orders.filter((order) => order.order_id !== id));

                    await Swal.fire({
                        title: "Deleted!",
                        html: "The order has been deleted.",
                        icon: "success",
                        customClass: {
                            popup: styles.popup,
                            confirmButton: styles.confirmButton,
                            icon: styles.icon,
                            title: styles.successTitle,
                            htmlContainer: styles.text,
                        },
                    });
                } catch (error) {
                    console.error("Error deleting order:", error);
                    if (error === "Failed") {
                        setError(true);
                    } else {             
                        Swal.fire({
                            title: "Error!",
                            html: "Failed to delete order. Please try again!",
                            icon: "error",
                            customClass: {
                                popup: styles.popup,
                                confirmButton: styles.confirmButton,
                                icon: styles.icon,
                                title: styles.errorTitle,
                                htmlContainer: styles.text,
                            },
                        });
                    }
                } finally {
                    setLoading(false);
                }
    };

    // Get the order status
    function getOrderStatus(status) {
        if (status === 0) return "Received";
        if (status === 1) return "In Progress";
        if (status === 2) return "Completed";
        return "Pending";
    };

    return (
        <Layout>
            <div className={`${styles.customerOrders} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                            <div className={styles.container}>
                                <div className={styles.allInfo}>
                                    <h2>Orders of {user?.customer_first_name}</h2>
                                    <div className={styles.orderInfo}>
                                        {orders && orders.length > 0 ? (
                                            orders.map((order, index) => (
                                                <div key={index}>
                                                    <div className={styles.deleteIcon} onClick={() => handleDeleteOrder(order.order_id)}>
                                                        <MdDelete />
                                                    </div>
                                                    <div className={styles.orderCard}>
                                                        <p><strong>Order #: </strong>{order.order_id}</p>
                                                        <p>
                                                            <strong>Vehicle: </strong>
                                                            {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
                                                        </p>
                                                        <p><strong>Date: </strong>{order.order_date.split("T")[0]}</p>
                                                        <p><strong>Status: </strong>{getOrderStatus(order.order_status)}</p>
                                                        <p><strong>Total: </strong>${order.order_total_price}</p>
                                                        <p>
                                                            <strong>Edit Order Info:</strong>
                                                            <span onClick={() => navigate(`/edit-order/${order.order_id}`)}>
                                                                <FaEdit />
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.noMessage}>No orders found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default MyOrders;