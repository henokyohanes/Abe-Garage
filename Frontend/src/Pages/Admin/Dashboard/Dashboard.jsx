import React from "react";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import Layout from "../../../Layout/Layout";
import styles from "./Dashboard.module.css";

const Dashboard = () => {

    return (
        <Layout>
            <div className={`${styles.dashboard} row g-0`}>
                {/* Sidebar Navigation */}
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.main} col-9`}>
                    <h1>Admin Dashboard <span>____</span></h1>
                    <p>
                        Delivering reliable, win-win solutions to keep your vehicle running smoothly. At the end of the day, our proactive approach ensures optimal performance and customer satisfaction. Moving forward, the next generation of automotive care is here, with advanced diagnostics and streamlined repair solutions to get you back on the road quickly and safely.
                    </p>
                    <div className="row g-3 g-lg-4">
                        {[
                            { icon: "📦", title: "All Orders", sub:"Open For All" },
                            { icon: "🆕", title: "New Orders", sub:"Open For Leads" },
                            { icon: "👥", title: "Employees", sub:"Open For Admins" },
                            { icon: "➕👤", title: "Add Employee", sub:"Open For Admins" },
                            { icon: "🛠️", title: "Engine Service", sub:"Service And Repairs" },
                            { icon: "🎨", title: "Denting & Painting", sub:"Service And Repairs" },
                            { icon: "🚗💨", title: "Break Service", sub:"Service And Repairs" },
                            { icon: "🛞", title: "Tire & Wheels", sub:"Service And Repairs" },
                        ].map((service, index) => (
                            <div key={index} className="col-6 col-lg-4">
                                <div key={index} className={`${styles.dashboardCard} `}>
                                    <p>{service.sub}</p>
                                    <h3>{service.title}</h3>
                                    <div className={styles.dashboardIcon}>{service.icon}</div>
                                    <a href="#" className={styles.readMore}>
                                        Read More
                                    </a>
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
