import React, { useState, useEffect, act } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import orderService from "../../services/order.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./OrderUpdate.module.css";

const OrderUpdate = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({});
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
            setOrder(response.data[0]);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch order data.");
        } finally {
            setLoading(false);
        }
    };

    // const handleChange = (e) => {
    //     const { name, value, type, checked, dataset } = e.target;
    //     const index = dataset.index ? parseInt(dataset.index, 10) : null;

    //     setOrder((prevOrder) => {
    //         if (index !== null) {
    //             // Update the specific service in the services array
    //             const updatedServices = [...prevOrder.services];
    //             updatedServices[index] = {
    //                 ...updatedServices[index],
    //                 [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    //             };
    //             console.log(
    //               "Name:",
    //               name,
    //               "Value:",
    //               type === "checkbox" ? checked : value
    //             );
    //             return {
    //                 ...prevOrder,
    //                 services: updatedServices,
    //             };
    //         } else {
    //             // Update top-level fields
    //             console.log(
    //               "Name:",
    //               name,
    //               "Value:",
    //               type === "checkbox" ? checked : value
    //             );
    //             return {
    //                 ...prevOrder,
    //                 [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    //             };
    //         }

    //     });
    // };

    const handleChange = async (e) => {
        const { name, value, type, checked, dataset } = e.target;
        const index = dataset.index ? parseInt(dataset.index, 10) : null;

        if (value === "3" && name === "service_completed" && index !== null) {
            // Confirmation step
            const confirmDelete = window.confirm(
                "Are you sure you want to cancel this service? This action cannot be undone."
            );
            if (!confirmDelete) {
                return; // Exit if the user cancels the confirmation
            }

            try {
            const serviceId = order.services[index].service_id; // Assume each service has a unique `id`
            const orderId = id;
            await orderService.deleteService(orderId, serviceId);
            // Remove the service if confirmed
            setOrder((prevOrder) => {
                const updatedServices = [...prevOrder.services];
                updatedServices.splice(index, 1); // Remove the service at the selected index
                return {
                    ...prevOrder,
                    services: updatedServices,
                };
            });
            } catch (error) {
            console.error("Error deleting service:", error);
        }
    } else if (value === "3" && name === "additional_requests_completed") {
            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this additional request? This action cannot be undone."
            );
            if (!confirmCancel) {
                return; // Exit if user cancels confirmation
            }

            try {
                const orderId = id;
                const additionalRequest = {additional_request: null, additional_requests_completed: 0};
                await orderService.deleteAdditionalRequest(orderId, additionalRequest);
                // Remove the additional request if confirmed
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    additional_request: null,
                    additional_requests_completed: null,
                }));
            } catch (error) {
                console.error("Error deleting additional request:", error);
            }
        } else {
            setOrder((prevOrder) => {
                if (index !== null) {
                    const updatedServices = [...prevOrder.services];
                    updatedServices[index] = {
                        ...updatedServices[index],
                        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
                    };
                    return {
                        ...prevOrder,
                        services: updatedServices,
                    };
                } else {
                    return {
                        ...prevOrder,
                        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
                    };
                }
            });
        }
    };



    const handleAddOrder = async (e) => {
        e.preventDefault();

        try {
            await orderService.updateOrder(id, order);
            setSuccess(true);
            // setTimeout(() => navigate("/admin/orders"), 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to update order. Please try again.");
        }
    };

    const getStatusClass = (status) => {
        switch (parseInt(status)) {
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
        switch (parseInt(status)) {
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

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
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
                        <p className={`${styles.status} ${getStatusClass(order.order_status)}`}>
                            {getStatusText(order.order_status)}
                        </p>
                    </div>
                    <div className={styles.infoSection}>
                        <div>
                            <h6>CUSTOMER</h6>
                            <h3>{order.customer_first_name} {order.customer_last_name}</h3>
                            <p><strong>Email:</strong> {order.customer_email}</p>
                            <p><strong>Phone:</strong> {order.customer_phone_number}</p>
                            <p><strong>Active:</strong> {order.active_customer_status ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <h6>CAR IN SERVICE</h6>
                            <h3>{order.vehicle_make} {order.vehicle_model} ({order.vehicle_color})</h3>
                            <p><strong>Tag:</strong> {order.vehicle_model}</p>
                            <p><strong>Year:</strong> {order.vehicle_year}</p>
                            <p><strong>Mileage:</strong> {order.vehicle_mileage}</p>
                        </div>
                    </div>
                    <div className={styles.servicesSection}>
                        <h6>{order.vehicle_make} {order.vehicle_model}</h6>
                        <h3>Edit: Requested Services <span>____</span></h3>
                        {order.services.map((order, index) => (
                            <div key={order.service_id} className={styles.service}>
                                <div>
                                    <h4>{order.service_name}</h4>
                                    <p>{order.service_description}</p>
                                </div>
                                <select name="service_completed" className={`${styles.status} ${getStatusClass(order.service_completed)}`} value={order.service_completed} onChange={handleChange} data-index={index}>
                                    <option className={styles.statusReceived} value={0}>Received</option>
                                    <option className={styles.statusInProgress} value={1}>In Progress</option>
                                    <option className={styles.statusCompleted} value={2}>Completed</option>
                                    <option className={styles.statusCancelled} value={3}>Cancel</option>
                                </select>
                            </div>
                        ))}
                        {order.additional_request !== null && (<div className={styles.service}>
                            <div>
                                <h4>Additional Requests</h4>
                                <textarea type="text" name="additional_request" placeholder="Additional Requests" value={order.additional_request} onChange={handleChange} />
                            </div>
                            <select name="additional_requests_completed" className={`${styles.status} ${getStatusClass(order.additional_requests_completed)}`} value={order.additional_requests_completed} onChange={handleChange}>
                                <option className={styles.statusReceived} value={0}>Received</option>
                                <option className={styles.statusInProgress} value={1}>In Progress</option>
                                <option className={styles.statusCompleted} value={2}>Completed</option>
                                <option className={styles.statusCancelled} value={3}>Cancel</option>
                            </select>
                        </div>)}
                    </div>
                    <div className={styles.updateSection}>
                        <h3>Edit: Order Details <span>____</span></h3>
                        <form onSubmit={handleAddOrder}>
                            <div className={styles.formGroup}>
                                <div className={styles.orderFlexContainer}>
                                    <div>
                                        <div className={styles.orderFlex}>
                                            <h4>Order Status:</h4>
                                            <select name="order_status" className={`${styles.status} ${getStatusClass(order.order_status)}`} value={order.order_status} onChange={handleChange} >
                                                <option className={styles.statusReceived} value={0}>Received</option>
                                                <option className={styles.statusInProgress} value={1}>In Progress</option>
                                                <option className={styles.statusCompleted} value={2}>Completed</option>
                                                <option className={styles.statusCancelled}>Cancel</option>
                                            </select>
                                        </div>
                                        <div className={styles.orderFlex}>
                                            <h4>completion date:</h4>
                                            <input className={styles.date} name="completion_date" type="date" placeholder="mm/dd/yyyy" onChange={handleChange} value={order.completion_date ? formatDate(order.completion_date) : ""} />
                                        </div>
                                        <div>
                                            <h4>Notes for customer</h4>
                                            <textarea name="notes_for_customer" type="text" placeholder="Notes for customer" onChange={handleChange} value={order.notes_for_customer || ""} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.orderFlex}>
                                            <h4>Active Order:</h4>
                                            <input
                                                className={styles.checkbox}
                                                type="checkbox"
                                                name="active_order"
                                                checked={order.active_order}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className={styles.orderFlex}>
                                            <h4>Total Price:</h4>
                                            <input className={styles.price} name="order_total_price" placeholder="Total Price" type="number" onChange={handleChange} value={order.order_total_price} />
                                        </div>
                                        <div>
                                            <h4>Notes for provider</h4>
                                            <textarea name="notes_for_internal_use" type="text" placeholder="Notes for provider" onChange={handleChange} value={order.notes_for_internal_use || ""} />
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
