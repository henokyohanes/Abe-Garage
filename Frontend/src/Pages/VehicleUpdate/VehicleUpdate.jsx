import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import vehicleService from "../../services/vehicle.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./VehicleUpdate.module.css";

const VehicleUpdate = () => {
    
    const { customer_id, vehicle_id } = useParams();
    const [vehicle, setVehicle] = useState({vehicle_color: "", vehicle_mileage: "", vehicle_tag: ""});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchVehicleData = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await vehicleService.fetchVehicleById(parseInt(vehicle_id));
                setVehicle(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleData();
    }, []);


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

        setLoading(true);
        setError(false);

        //validate mileage
        if (vehicle.vehicle_mileage.length > 9) {
            return;
        }
        try {
            await vehicleService.updateVehicle(vehicle_id, vehicle);
            Swal.fire({
                title: "Success!",
                html: "Vehicle updated successfully",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            setTimeout(() => {
                window.location.href = "/customer-profile/" + customer_id;
            }, 1000);
        } catch (err) {
            console.error(err);
            if (err.response) {
                Swal.fire({
                    title: "error!",
                    html: "Failed to update vehicle. Please try again!",
                    icon: "error",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.errorTitle,
                        htmlContainer: styles.text,
                    },
                });
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <section className={`${styles.updateSection} row g-0`}>
                <div className="d-none d-md-block col-3">
                    <AdminMenu />
                </div>
                <div className="d-block d-md-none">
                    <AdminMenuMobile />
                </div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (<div className={styles.container}>
                        <h2>Edit: {`${vehicle.vehicle_make} ${vehicle.vehicle_model} ${vehicle.vehicle_year}`} <span>____</span></h2>
                        <div className={styles.formContainer}>
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
                    </div>) : error ? <NotFound /> : <Loader />}
                </div>
            </section>
        </Layout>
    );
};

export default VehicleUpdate;
