import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import styles from "./AdminMenuMobile.module.css"

const AdminMenuMobile = () => {

    // Access the authentication context
    const { isAdmin, isManager, isEmployee } = useAuth();

    // Function to get the role text
    const getRoleText = () => {
        if (isAdmin) return "Admin";
        if (isManager) return "Manager";
        if (isEmployee) return "Technician";
        return "User";
    };

    return (
        <div className={styles.adminMenuContainer}>
            <div className={styles.adminMenuTitle}>
                <h2>{getRoleText()} Menu</h2>
            </div>
            <div className={styles.listGroup}>
                <Link to="/dashboard" className={styles.listGroupItem}>Dashboard</Link>
                {isEmployee && <Link to="/my-profile" className={styles.listGroupItem}>My Profile</Link>}
                {isEmployee && <Link to="/my-tasks" className={styles.listGroupItem}>My Tasks</Link>}
                {(isAdmin || isManager || isEmployee) && <Link to="/orders" className={styles.listGroupItem}>Orders</Link>}
                {(isAdmin || isManager) && <Link to="/new-order" className={styles.listGroupItem}>New order</Link>}
                {isAdmin && <Link to="/add-employee" className={styles.listGroupItem}>Add employee</Link>}
                {(isAdmin || isManager) && <Link to="/employees" className={styles.listGroupItem}>Employees</Link>}
                {(isAdmin || isManager) && <Link to="/add-customer" className={styles.listGroupItem}>Add customer</Link>}
                {(isAdmin || isManager) && <Link to="/customers" className={styles.listGroupItem}>Customers</Link>}
                {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-appointments" className={styles.listGroupItem}>Appointments</Link>}
                {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-vehicles" className={styles.listGroupItem}>Vehicles</Link>}
                {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-orders" className={styles.listGroupItem}>Orders</Link>}
                {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-notifications" className={styles.listGroupItem}>Notifications</Link>}
                <Link to="/services" className={styles.listGroupItem}>Services</Link>
            </div>
        </div>
    )
}

export default AdminMenuMobile