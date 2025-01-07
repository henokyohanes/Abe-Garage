import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderService from "../../services/order.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {

    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await orderService.fetchOrderById(parseInt(id));
                console.log(response.data);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

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

    if (loading) return <div>Loading...</div>;

    return (
        <Layout>
            <div className={`${styles.orderDetailsContainer} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.orderDetails} col-9`}>
                    <div className={styles.header}>
                        <h2>{order[0].customer_first_name} {order[0].customer_last_name} <span>____</span></h2>
                        <p className={`${styles.status} ${getStatusClass(order[0].order_status)}`}>
                            {getStatusText(order[0].order_status)}
                        </p>
                    </div>
                    <p>You can track the progress of your order using this page. we will constantly update this page to let you know how we are progressing.As soon as we are done with the order, the status will turn green. That means, your car is ready for pick up.</p>
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
                        <h3>Requested Services</h3>
                        {order.map((order) => (
                            <div key={order.service_id} className={styles.service}>
                                <div>
                                    <h4>{order.service_name}</h4>
                                    <p>{order.service_description}</p>
                                </div>
                                <p className={`${styles.status} ${getStatusClass(order.additional_requests_completed)}`}>
                                    {getStatusText(order.additional_requests_completed)}
                                </p>
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
                </div>
            </div>
        </Layout>
    );
};

export default OrderDetails;
