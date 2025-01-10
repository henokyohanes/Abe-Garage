import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderService from "../../services/order.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./OrderUpdate.module.css";

const OrderUpdate = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({
        service_name: "",
        service_description: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderData();
    }, []);

    const fetchOrderData = async () => {
        try {
            const response = await orderService.fetchOrderById(parseInt(id));
            if (!response) throw new Error("order not found.");
            console.log(response.data);
            setOrder(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch order data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setService((prevOrder) => ({
            ...prevOrder,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddOrder = async (e) => {
        e.preventDefault();

        try {
            await orderService.updateOrder(id, order);
            setSuccess(true);
            setTimeout(() => navigate("/admin/orders"), 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to update order. Please try again.");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 2:
                return styles.statusCompleted;
            case 1:
                return styles.statusInProgress;
            case 0:
                return styles.statusReceived;
            default:
                return "";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 2:
                return "Completed";
            case 1:
                return "In Progress";
            case 0:
                return "Received";
            default:
                return "Unknown";
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;



    return (
        <Layout>
            <div className={`${styles.updateOrderContainer} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.orderDetails} col-9`}>
                    <div className={styles.header}>
                        <h2>Update Order <span>____</span></h2>
                        <p className={`${styles.status} ${getStatusClass(order[0].order_status)}`}>
                            {getStatusText(order[0].order_status)}
                        </p>
                    </div>
                    <div className={styles.infoSection}>
                        <div>
                            <h6>CUSTOMER</h6>
                            <h3>{order[0].customer_first_name} {order[0].customer_last_name}</h3>
                            <p><strong>Email:</strong> {order[0].customer_email}</p>
                            <p><strong>Phone:</strong> {order[0].customer_phone_number}</p>
                            <p><strong>Active:</strong> {order[0].active_customer_status ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <h6>CAR IN SERVICE</h6>
                            <h3>{order[0].vehicle_make} {order[0].vehicle_model} ({order[0].vehicle_color})</h3>
                            <p><strong>Tag:</strong> {order[0].vehicle_model}</p>
                            <p><strong>Year:</strong> {order[0].vehicle_year}</p>
                            <p><strong>Mileage:</strong> {order[0].vehicle_mileage} km</p>
                        </div>
                    </div>
                    <div className={styles.servicesSection}>
                        <h6>{order[0].vehicle_make} {order[0].vehicle_model}</h6>
                        <h3>Edit: Requested Services</h3>
                        {order.map((order) => (
                            <div key={order.service_id} className={styles.service}>
                                <div>
                                    <h4>{order.service_name}</h4>
                                    <p>{order.service_description}</p>
                                </div>
                                <select className={`${styles.status} ${getStatusClass(order.additional_requests_completed)}`} value={getStatusText(order.additional_requests_completed)} onChange={handleChange}>
                                    <option>Received</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>Cancel</option>
                                </select>
                            </div>
                        ))}
                        <div className={styles.service}>
                            <div>
                                <h4>Additional Requests</h4>
                                <p>{order[0].additional_request}</p>
                            </div>
                            <p className={`${styles.status} ${getStatusClass(order[0].additional_requests_completed)}`}>{getStatusText(order[0].additional_requests_completed)}</p>
                        </div>
                    </div>
                    <div className={styles.updateSectio}>
                        <h3>Edit: Order</h3>
                        <form onSubmit={handleAddOrder}>
                            <div className={styles.formGrou}>
                                    <h6>Order Status</h6>
                                <select>
                                    <option>Received</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                                <h6>Active Order</h6>
                                <select>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                                <h6></h6>
                            </div>
                        </form>
                    </div>   
                </div>
            </div>
        </Layout>
    );
};

export default OrderUpdate;
