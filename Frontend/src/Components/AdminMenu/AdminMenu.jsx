import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import Styles from "./AdminMenu.module.css"

function AdminMenu() {

  // Access the authentication context
  const { employee } = useAuth();
  return (
    <div className={Styles.adminMenuContainer}>
      <div className={Styles.adminMenuTitle}>
        <h2>Admin Menu</h2>
      </div>
      <div className={Styles.listGroup}>
        <Link to="/dashboard" className={Styles.listGroupItem}>Dashboard</Link>
        <Link to="/admin/orders" className={Styles.listGroupItem}>Orders</Link>
        <Link to="/admin/new-order" className={Styles.listGroupItem}>New order</Link>
        <Link to="/admin/add-employee" className={Styles.listGroupItem}>Add employee</Link>
        <Link to="/admin/employees" className={Styles.listGroupItem}>Employees</Link>
        <Link to="/admin/add-customer" className={Styles.listGroupItem}>Add customer</Link>
        <Link to="/admin/customers" className={Styles.listGroupItem}>Customers</Link>
        <Link to="/admin/services" className={Styles.listGroupItem}>Services</Link>
      </div>
    </div>
  );
}

export default AdminMenu;