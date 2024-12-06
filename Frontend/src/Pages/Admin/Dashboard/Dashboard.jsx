import React from "react";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import AdminMenu from "../../../components/AdminMenu/AdminMenu";

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            {/* Sidebar Navigation */}
            <div className={styles.sidebar}>
                <AdminMenu />
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <h1>Admin Dashboard</h1>
                <p>
                    Bring to the table win-win survival strategies to ensure proactive
                    domination. At the end of the day, going forward, a new normal that
                    has evolved.
                </p>

                <div className={styles.cards}>
                    {/* Orders Section */}
                    <div className={styles.card}>
                        <h3>All Orders</h3>
                        <p>List of orders</p>
                        <Link to="/orders">READ MORE &gt;</Link>
                    </div>
                    <div className={styles.card}>
                        <h3>New Orders</h3>
                        <p>Add new order</p>
                        <Link to="/add-order">READ MORE &gt;</Link>
                    </div>

                    {/* Employees Section */}
                    <div className={styles.card}>
                        <h3>Employees</h3>
                        <p>List of employees</p>
                        <Link to="/employees">READ MORE &gt;</Link>
                    </div>
                    <div className={styles.card}>
                        <h3>Add Employee</h3>
                        <p>Add new employee</p>
                        <Link to="/add-employee">READ MORE &gt;</Link>
                    </div>

                    {/* Services Section */}
                    <div className={styles.card}>
                        <h3>Engine Service & Repair</h3>
                        <p>Details about engine services</p>
                        <Link to="/services">READ MORE &gt;</Link>
                    </div>
                    <div className={styles.card}>
                        <h3>Tyre & Wheels</h3>
                        <p>Details about tyre and wheel services</p>
                        <Link to="/services">READ MORE &gt;</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
