import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import Layout from "../../Layout/Layout";
import styles from "./Dashboard.module.css";

const Dashboard = () => {

    // Access the authentication context
    const { isAdmin, isManager, isEmployee } = useAuth();
    const navigate = useNavigate();

    // List of services
    const services = [
        (isAdmin || isManager || isEmployee) && { icon: "📦", title: "All Orders", sub: "Open For Employees", path: "/orders"},
        (isAdmin || isManager) && { icon: "🆕", title: "New Orders", sub: "Open For Managers", path: "/new-order" },
        isAdmin && { icon: "➕👤", title: "Add Employee", sub: "Open For Admins", path: "/add-employee" },
        (isAdmin || isManager) && { icon: "👥", title: "Employees", sub: "Open For Managers", path: "/employees" },
        (isAdmin || isManager) && { icon: "➕👤", title: "Add Customer", sub: "Open for Managers", path: "/add-customer" },
        (isAdmin || isManager) && { icon: "👥", title: "Customers", sub: "Open for Managers", path: "/customers" },
        (!isAdmin && !isManager && !isEmployee) && { icon: "📅", title: "My Appointments", sub: "Open For Customers", path: "/my-appointments" },
        (!isAdmin && !isManager && !isEmployee) && { icon: "🚗", title: "My Vehicles", sub: "Open For Customers", path: "/my-vehicles" }, 
        (!isAdmin && ! isManager || isEmployee) && { icon: "📦", title: "My Orders", sub: "Open For Customers", path: "/my-orders" },
        { icon: "🛠️", title: "Services", sub: "Service and Repairs", path: "/services" },
        { icon: "🛞", title: "Tire & Wheels", sub: "Service And Repairs" },
    ].filter(Boolean);

    return (
        <Layout>
            <div className={`${styles.dashboard} row g-0`}>
                {/* Sidebar Navigation */}
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className={`${styles.main} col-12 col-md-9`}>
                    <h1>Dashboard <span>____</span></h1>
                    <p>
                        Delivering reliable, win-win solutions to keep your vehicle running smoothly.
                        At the end of the day, our proactive approach ensures optimal performance and customer satisfaction.
                        Moving forward, the next generation of automotive care is here, with advanced diagnostics
                        and streamlined repair solutions to get you back on the road quickly and safely.
                    </p>
                    <div className="row g-3 g-lg-4">
                        {services.map((service, index) => (
                            <div key={index} className="col-6 col-lg-4">
                                <div className={styles.dashboardCard} onClick={() => navigate(service.path)}>
                                    <p>{service.sub}</p>
                                    <h3>{service.title}</h3>
                                    <div className={styles.dashboardIcon}>{service.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;