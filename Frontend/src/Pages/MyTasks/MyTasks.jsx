import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
// import { useAuth } from "../../Contexts/AuthContext";
// import { FaEdit } from "react-icons/fa";
// import { GrView } from "react-icons/gr";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import orderService from "../../services/order.service";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import Layout from "../../Layout/Layout";
import styles from "./MyTasks.module.css";

const MyTasks = () => {
    const {user} = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // const { isAdmin, isManager } = useAuth();
    const itemsPerPage = 6;
    const navigate = useNavigate();

    const employeeId = user?.employee_id;

    // Fetch orders when the component mounts
    useEffect(() => {

        if (!employeeId) {
            setLoading(false);
            return;
        }

        const fetchTasks = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await orderService.fetchEmployeeTasks(employeeId);
                console.log("response", user.employee_id, response);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [ employeeId ]);

    // Helper functions to get status class
    const getStatusClass = (status) => {
        switch (status) {
            case 2:
                return styles.statusCompleted;
            case 1:
                return styles.statusContinue;
            case 0:
                return styles.statusStart;
            default:
                return "";
        }
    };

    // Helper function to get status text
    const getStatusText = (status) => {
        switch (status) {
            case 2:
                return "Completed";
            case 1:
                return "Continue";
            case 0:
                return "Start";
            default:
                return "Unknown";
        }
    };

    // Pagination
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const displayedOrders = orders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // navigate to order details
    const handleViewOrder = async (orderId) => {

        console.log("orderId", orderId);
        
        const order = orders.find((order) => order.order_id === orderId);
        if (!order) return;
        
        console.log("orderStatus", order.task_status);

        if (order.task_status === 0) {
            setLoading(true);
            setError(false);
            
            try {
                const response = await orderService.updateAction(orderId);
                console.log("response", response);
            } catch (error) {
                console.error("Error fetching order:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        navigate(`/edit-order/${orderId}`);
    };

    return (
        <Layout>
            <div className={`${styles.tasksContainer} row g-0`}>
                <div className="d-none d-xxl-block col-3"><AdminMenu /></div>
                <div className="d-block d-xxl-none"><AdminMenuMobile /></div>
                <div className="col-12 col-xxl-9">
                    {!loading && !error ? (
                        <div className={styles.tasksList}>
                            <h2>Tasks <span>____</span></h2>
                            {orders.length > 0 ? (<div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.tasksTable}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Customer</th>
                                                <th>Vehicle</th>
                                                <th>Order Date</th>
                                                <th>Received by</th>
                                                {/* <th>Assigned to</th> */}
                                                {/* <th>Order status</th> */}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedOrders.map((order) => (
                                                <tr key={order.order_id}>
                                                    <td>{order.order_id}</td>
                                                    <td>
                                                        <div>{order.customer_first_name + " " + order.customer_last_name}</div>
                                                        <div>{order.customer_email}</div>
                                                        <div>{order.customer_phone_number}</div>
                                                    </td>
                                                    <td>
                                                        <div>{order.vehicle_make + " " + order.vehicle_model}</div>
                                                        <div>{order.vehicle_year}</div>
                                                        <div>{order.vehicle_tag}</div>
                                                    </td>
                                                    <td>{order.order_date.split("T")[0]}</td>
                                                    <td>{order.employee_first_name + " " + order.employee_last_name}</td>
                                                    {/* <td>{order.technician_first_name + " " + order.technician_last_name}</td> */}
                                                    {/* <td>
                                                        <span className={`${styles.statusBadge} ${getStatusClass(order.order_status)}`}>
                                                            {getStatusText(order.order_status)}
                                                        </span>
                                                    </td> */}
                                                    <td>
                                                        {/* {(isAdmin || isManager) && (
                                                            <button className={styles.btnViewEdit} onClick={() => handleEditOrder(order.order_id)}>
                                                                <FaEdit />
                                                            </button>
                                                        )} */}
                                                        <button className={styles.btnViewEdit} onClick={() => handleViewOrder(order.order_id)}>
                                                            {/* <GrView /> */}
                                                            <span className={`${styles.statusBadge} ${getStatusClass(order.task_status)}`}>
                                                            {getStatusText(order.task_status)}
                                                        </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.pagination}>
                                    <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                                        Previous
                                    </button>
                                    <span>Page {currentPage} of {totalPages}</span>
                                    <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
                                        Next
                                    </button>
                                </div>
                            </div>) : <div className={styles.noOrders}>No orders found.</div>}
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default MyTasks;