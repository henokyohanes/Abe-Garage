import React from 'react';
import Styles from "./AdminMenu.module.css"

function AdminMenu(props) {
  return (
    <div className={Styles.adminMenuContainer}>
      <div className={Styles.adminMenu}>
        <h2>Admin Menu</h2>
      </div>
      <div className={Styles.listGroup}>
        <a href="/admin" className={Styles.listGroupItem  }>Dashboard</a>
        <a href="/admin/orders" className={Styles.listGroupItem }>Orders</a>
        <a href="/admin/order" className={Styles.listGroupItem }>New order</a>
        <a href="/admin/add-employee" className={Styles.listGroupItem}>Add employee</a>
        <a href="/admin/employees" className={Styles.listGroupItem  }>Employees</a>
        <a href="/admin/add-customer" className={Styles.listGroupItem}>Add customer</a>
        <a href="/admin/customers" className={Styles.listGroupItem}>Customers</a>
        <a href="/admin/services" className={Styles.listGroupItem}>Services</a>
      </div>
    </div>
  );
}

export default AdminMenu;