import React, { useState, useEffect, act } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import orderService from "../../services/order.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./OrderUpdate.module.css";

const OrderUpdate = () => {
    const { id } = useParams();
    const [order, setOrder] = useState([]);
    const [updateOrder, setUpdateOrder] = useState({
        service_completed: [], additional_requests_completed: "", order_status: "", active_order: "", completion_date: "", order_total_price: "",
        notes_for_internal_use: "", notes_for_customer: "", 
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
        setUpdateOrder((prevupdateOrder) => ({
            ...prevupdateOrder,
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
                <div className="col-2 d-none d-lg-block">
                    <AdminMenu />
                </div>
                <div className={`${styles.adminMenuContainer} d-block d-lg-none`}>
                    <div className={styles.adminMenuTitle}>
                        <h2>Admin Menu</h2>
                    </div>
                    <div className={styles.listGroup}>
                        <Link to="/admin/dashboard" className={styles.listGroupItem}>
                            Dashboard
                        </Link>
                        <Link to="/admin/orders" className={styles.listGroupItem}>
                            Orders
                        </Link>
                        <Link to="/admin/new-order" className={styles.listGroupItem}>
                            New order
                        </Link>
                        <Link to="/admin/add-employee" className={styles.listGroupItem}>
                            Add employee
                        </Link>
                        <Link to="/admin/employees" className={styles.listGroupItem}>
                            Employees
                        </Link>
                        <Link to="/admin/add-customer" className={styles.listGroupItem}>
                            Add customer
                        </Link>
                        <Link to="/admin/customers" className={styles.listGroupItem}>
                            Customers
                        </Link>
                        <Link to="/admin/services" className={styles.listGroupItem}>
                            Services
                        </Link>
                    </div>
                </div>
                <div className={`${styles.orderDetails} col-12 col-lg-10`}>
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
                            <p><strong>Mileage:</strong> {order[0].vehicle_mileage}</p>
                        </div>
                    </div>
                    <div className={styles.servicesSection}>
                        <h6>{order[0].vehicle_make} {order[0].vehicle_model}</h6>
                        <h3>Edit: Requested Services <span>____</span></h3>
                        {order.map((order) => (
                            <div key={order.service_id} className={styles.service}>
                                <div>
                                    <h4>{order.service_name}</h4>
                                    <p>{order.service_description}</p>
                                </div>
                                <select name="service_completed" className={`${styles.status} ${getStatusClass(order.service_completed)}`} value={getStatusText(order.service_completed)} onChange={handleChange}>
                                    <option value="0">Received</option>
                                    <option value="1">In Progress</option>
                                    <option value="2">Completed</option>
                                    {/* <option>Cancel</option> */}
                                </select>
                            </div>
                        ))}
                        <div className={styles.service}>
                            <div>
                                <h4>Additional Requests</h4>
                                <p>{order[0].additional_request}</p>
                            </div>
                            <select name="additional_requests_completed" className={`${styles.status} ${getStatusClass(order[0].additional_requests_completed)}`} value={getStatusText(order[0].additional_requests_completed)} onChange={handleChange}>
                                <option value="0">Received</option>
                                <option value="1">In Progress</option>
                                <option value="2">Completed</option>
                                {/* <option>Cancel</option> */}
                            </select>
                        </div>
                    </div>
                    <div className={styles.updateSection}>
                        <h3>Edit: Order Details <span>____</span></h3>
                        <form onSubmit={handleAddOrder}>
                            <div className={styles.formGroup}>
                                <div className={styles.orderFlexContainer}>
                                    <div>
                                        <div className={styles.orderFlex}>
                                            <h4>Order Status:</h4>
                                            <select name="order_status" className={`${styles.status} ${getStatusClass(order[0].order_status)}`} value={getStatusText(order[0].order_status)} onChange={handleChange} >
                                                <option value="0">Received</option>
                                                <option value="1">In Progress</option>
                                                <option value="2">Completed</option>
                                                {/* <option>Cancel</option> */}
                                            </select>
                                        </div>
                                        <div className={styles.orderFlex}>
                                            <h4>completion date:</h4>
                                            <input className={styles.date} name="completion_date" type="date" placeholder="dd/mm/yyyy" onChange={handleChange} value={order[0].completion_date || ""} />
                                        </div>
                                        <div>
                                            <h4>Notes for customer</h4>
                                            <textarea name="notes_for_customer" type="text" placeholder="Notes for customer" onChange={handleChange} value={order[0].notes_for_customer || ""} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.orderFlex}>
                                            <h4>Active Order:</h4>
                                            {/* <label className={styles.checkbox}> */}
                                            <input
                                                className={styles.checkbox}
                                                type="checkbox"
                                                name="active_customer_status"
                                                checked={order[0].active_customer_status === 1}
                                                onChange={handleChange}
                                            />
                                            {/* </label> */}
                                        </div>
                                        <div className={styles.orderFlex}>
                                            <h4>Total Price:</h4>
                                            <input className={styles.price} name="order_total_price" placeholder="Total Price" type="number" onChange={handleChange} value={order[0].order_total_price} />
                                        </div>
                                        <div>
                                            <h4>Notes for provider</h4>
                                            <textarea name="notes_for_internal_use" type="text" placeholder="Notes for provider" onChange={handleChange} value={order[0].notes_for_internal_use || ""} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit">Update Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OrderUpdate;
