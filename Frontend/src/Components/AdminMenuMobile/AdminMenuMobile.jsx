import React from 'react'
import { Link } from "react-router-dom";
import styles from "./AdminMenuMobile.module.css"

const AdminMenuMobile = () => {

    return (
        <div className={`${styles.adminMenuContainer} d-block d-lg-none`}>
            <div className={styles.adminMenuTitle}>
                <h2>Admin Menu</h2>
            </div>
            <div className={styles.listGroup}>
                <Link to="/admin/dashboard" className={styles.listGroupItem}>Dashboard</Link>
                <Link to="/admin/orders" className={styles.listGroupItem}>Orders</Link>
                <Link to="/admin/new-order" className={styles.listGroupItem}>New order</Link>
                <Link to="/admin/add-employee" className={styles.listGroupItem}>Add employee</Link>
                <Link to="/admin/employees" className={styles.listGroupItem}>Employees</Link>
                <Link to="/admin/add-customer" className={styles.listGroupItem}>Add customer</Link>
                <Link to="/admin/customers" className={styles.listGroupItem}>Customers</Link>
                <Link to="/admin/services" className={styles.listGroupItem}>Services</Link>
            </div>
        </div>
    )
}

export default AdminMenuMobile
