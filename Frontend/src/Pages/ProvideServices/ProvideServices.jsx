import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import serviceService from "../../services/service.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./ProvideServices.module.css";

const ProvideServices = () => {

    const [newservice, setNewservice] = useState({ service_name: "", service_description: "" });
    const [services, setServices] = useState([]);
    const { isAdmin, isManager } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllServices();
    }, []);

    const fetchAllServices = async () => {
        try {
            const services = await serviceService.getAllServices();
            setServices(services);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };
    
    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewservice({ ...newservice, [name]: value });
    };

    const handleAddService = async () => {
        try {
            await serviceService.addService(newservice);
            alert("Service added successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error adding service:", error);
            alert("Failed to add service");
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-service/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );
        if (confirmDelete) {
            try {
                await serviceService.deleteService(id);
                setServices(services.filter((service) => service.service_id !== id));
            } catch (err) {
                alert(err.message || "Failed to delete customer");
            }
        }
    };

    return (
        <Layout>
            <div className={`${styles.provideServices} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.container} col-9`}>
                    <h1>Service We Provide <span>____</span></h1>
                    <p> Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal has evolved from generation experiences.</p>
                    <div className={styles.serviceList}>
                        {services.map((service) => (
                            <div key={service.service_id} className={styles.service}>
                                <div className={styles.details}>
                                    <h2>{service.service_name}</h2>
                                    <p>{service.service_description}</p>
                                </div>
                                {isAdmin && <div className={styles.actions}>
                                    <button onClick={() => handleEdit(service.service_id)}><FaEdit /></button>
                                    <button onClick={() => handleDelete(service.service_id)}><MdDelete /></button>
                                </div>}
                            </div>
                        ))}
                    </div>
                    {isAdmin && <div className={styles.form}>
                        <h1>Add a new Service <span>____</span></h1>
                        <input
                            type="text"
                            name="service_name"
                            placeholder="Service Name"
                            value={newservice.service_name}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="service_description"
                            placeholder="Service Description"
                            value={newservice.service_description}
                            onChange={handleInputChange}
                        />
                        <button className={styles.addButton} onClick={handleAddService}>
                            Add Service
                        </button>
                    </div>}
                </div>
            </div>
        </Layout>
    );
};

export default ProvideServices;
