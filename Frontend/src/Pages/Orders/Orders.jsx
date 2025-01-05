import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import oredrService from "../../services/order.service";
import styles from "./Orders.module.css";
import Layout from "../../Layout/Layout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await oredrService.fetchOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout>
      <div className={`${styles.ordersContainer} row g-0`}>
        <div className="d-none d-lg-block col-2">
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
        <div className={`${styles.ordersList} col-12 col-lg-10`}>

          <h2>
            Orders <span>____</span>
          </h2>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Order Date</th>
                <th>Received by</th>
                <th>Order status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>
                    <div>
                      {order.customer_first_name + " " + order.customer_last_name}
                    </div>
                    <div>{order.customer_email}</div>
                    <div>{order.customer_phone_number}</div>
                  </td>
                  <td>
                    <div>{order.vehicle_make + " " + order.vehicle_model}</div>
                    <div>{order.vehicle_year}</div>
                    <div>{order.vehicle_tag}</div>
                  </td>
                  <td>{order.order_date.split("T")[0]}</td>
                  <td>
                    {order.employee_first_name + " " + order.employee_last_name}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        order.order_status
                      )}`}
                    >
                      {getStatusText(order.order_status)}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnViewEdit}>
                      <FaEdit />
                    </button>
                    <button className={styles.btnViewEdit} onClick={() => handleViewOrder(order.order_id)}>
                      <GrView />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
