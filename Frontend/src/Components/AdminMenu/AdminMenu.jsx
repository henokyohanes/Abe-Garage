import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import Styles from "./AdminMenu.module.css"

function AdminMenu() {

  // Access the authentication context
  const { isAdmin, isManager, isEmployee } = useAuth();

  // Function to get the role text
  const getRoleText = () => {
    if (isAdmin) return "Admin";
    if (isManager) return "Manager";
    if (isEmployee) return "Mechanic";
    return "User";
  };

  return (   
    <div className={Styles.adminMenuContainer}>
      <div className={Styles.adminMenuTitle}>
        <h2>{getRoleText()} Menu</h2>
      </div>
      <div className={Styles.listGroup}>
        <Link to="/dashboard" className={Styles.listGroupItem}>Dashboard</Link>
        {(isAdmin || isManager || isEmployee) && <Link to="/orders" className={Styles.listGroupItem}>Orders</Link>}
        {(isAdmin || isManager) && <Link to="/new-order" className={Styles.listGroupItem}>New order</Link>}
        {isAdmin && <Link to="/add-employee" className={Styles.listGroupItem}>Add employee</Link>}
        {(isAdmin || isManager) && <Link to="/employees" className={Styles.listGroupItem}>Employees</Link>}
        {(isAdmin || isManager) && <Link to="/add-customer" className={Styles.listGroupItem}>Add customer</Link>}
        {(isAdmin || isManager) && <Link to="/customers" className={Styles.listGroupItem}>Customers</Link>}
        {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-appointments" className={Styles.listGroupItem}>My Appointments</Link>}
        {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-vehicles" className={Styles.listGroupItem}>My Vehicles</Link>}
        {(!isAdmin && !isManager && !isEmployee) && <Link to="/my-orders" className={Styles.listGroupItem}>My Orders</Link>}
        <Link to="/services" className={Styles.listGroupItem}>Services</Link>
      </div>
    </div>
  );
}

export default AdminMenu;