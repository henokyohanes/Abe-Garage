import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import vehicleService from "../../services/vehicle.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./VehicleUpdate.module.css";

const VehicleUpdate = () => {
    
    const { customer_id, vehicle_id } = useParams();
    const [vehicle, setVehicle] = useState({vehicle_color: "", vehicle_mileage: "", vehicle_tag: ""});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicleData();
    }, []);

    const fetchVehicleData = async () => {
        try {
            const response = await vehicleService.fetchVehicleById(parseInt(vehicle_id));
            if (!response) throw new Error("Vehicle not found.");
            setVehicle(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch vehicle data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        //validate mileage length on input
        if (name === "vehicle_mileage" && value.length > 9) return;

        setVehicle((prevVehicle) => ({
            ...prevVehicle,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //validate mileage
        if (vehicle.vehicle_mileage.length > 9) {
            setError("Vehicle mileage cannot exceed 9 characters.");
            return;
        }
        try {
            await vehicleService.updateVehicle(vehicle_id, vehicle);
            setSuccess(true);
            setTimeout(() => navigate(`/customer-profile/${customer_id}`), 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to update vehicle. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <section className={`${styles.updateSection} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.container} col-8`}>
                    <h2>Edit: {`${vehicle.vehicle_make} ${vehicle.vehicle_model} ${vehicle.vehicle_year}`} <span>____</span></h2>
                    <div className={styles.formContainer}>
                        {success && (<p className={styles.successMessage}>Vehicle updated successfully!</p>)}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <p>Vehicle Color:</p>
                                <input className={styles.formControl} type="text" name="vehicle_color" value={vehicle.vehicle_color} onChange={handleChange} placeholder="Color" required />
                            </div>
                            <div className={styles.formGroup}>
                                <p>Vehicle Mileage:</p>
                                <input className={styles.formControl} type="text" name="vehicle_mileage" value={vehicle.vehicle_mileage} onChange={handleChange} placeholder="Mileage" required />
                            </div>
                            <div className={styles.formGroup}>
                                <p>Vehicle Tag:</p>
                                <input className={styles.formControl} type="text" name="vehicle_tag" value={vehicle.vehicle_tag} onChange={handleChange} placeholder="Tag" required />
                            </div>
                            <div className={styles.formGroup}>
                                <button className={styles.updateButton} type="submit"> Update </button>
                            </div>
                        </form>
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>
            </section>
        </Layout>
    );
};

export default VehicleUpdate;
