import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import serviceService from "../../services/service.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./ServiceUpdate.module.css";


const ServiceUpdate = () => {

    const { id } = useParams();
    const [service, setService] = useState({service_name: "", service_description: ""});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchServiceData();
    }, []);

    const fetchServiceData = async () => {
        try {
            const response = await serviceService.getServiceById(parseInt(id));
            if (!response) throw new Error("Service not found.");
            setService(response);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch service data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setService((prevService) => ({
            ...prevService, 
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddService = async (e) => {
        e.preventDefault();

        try {
            await serviceService.updateService(id, service);
            setSuccess(true);
            setTimeout(() => navigate("/admin/services"), 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to update employee. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.content} col-9`}>
                    <h1>Update Service <span>___</span></h1>
                        {success && (<p className={styles.successMessage}>Employee updated successfully!</p>)}
                    <form onSubmit={handleAddService}>
                        <input
                            type="text"
                            name="service_name"
                            placeholder="Service Name"
                        value={service.service_name}
                        onChange={handleChange}
                        />
                        <textarea
                            name="service_description"
                            placeholder="Service Description"
                        value={service.service_description}
                        onChange={handleChange}
                        />
                        <button type="submit" className={styles.addButton}>
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ServiceUpdate;
