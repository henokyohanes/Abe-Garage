import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import serviceService from "../../services/service.service";
import styles from "./ProvideServices.module.css";

const ProvideServices = () => {

    const [newservice, setNewservice] = useState({ service_name: "", service_description: "" });
    const [services, setServices] = useState([]);
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

    const handleAddService = async () => {
        try {
            await serviceService.addService(newservice);
            alert("Service added successfully!");
        } catch (error) {
            console.error("Error adding service:", error);
            alert("Failed to add service");
        }
    };

    // Handle form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewservice({ ...newservice, [name]: value });
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
                setServices(customers.filter((service) => service.id !== id));
            } catch (err) {
                alert(err.message || "Failed to delete customer");
            }
        }
    };

    return (
        <div className={styles.container}>
        <div className={styles.serviceList}>
            {services.map((service) => (
                <div key={service.service_id} className={styles.service}>
                    <div className={styles.details}>
                        <h3>{service.service_name}</h3>
                        <p>{service.service_description}</p>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={() => handleEdit(service.service_id)}>Edit</button>
                        <button onClick={() => handleDelete(service.service_id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
        <div className={styles.form}>
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
        </div>
    </div>
    );
};

export default ProvideServices;
