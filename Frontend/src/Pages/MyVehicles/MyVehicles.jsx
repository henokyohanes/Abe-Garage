import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import vehicleService from "../../services/vehicle.service";
import carMakersData from "../../assets/json/carMakers.json";
import vehicleTypes from "../../assets/json/vehicleTypes.json";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./MyVehicles.module.css";

const MyVehicles = () => {

    const { isLogged, setIsLogged, user, isAdmin, isManager, isEmployee } = useAuth();

    const id = user?.customer_id;
    const [vehicles, setVehicles] = useState({});
    const [showform, setShowform] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        vehicle_type: "",
        vehicle_color: "",
        vehicle_mileage: "",
        vehicle_tag: "",
        vehicle_serial: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get("redirect");

    // Fetch customer data, vehicles, and orders when id changes
    useEffect(() => {
        if (!id) return;
        fetchVehicles();
    }, [id]);

    // Fetch vehicles for the customer
    const fetchVehicles = async () => {

        setLoading(true);
        setError(false);

        try {
            const vehicleData = await vehicleService.fetchVehiclesByCustomerId(id);
            setVehicles(vehicleData.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            if (error !== "No vehicles found for this customer") {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const carMakers = Object.keys(carMakersData);
    const carModelsByMake = carMakersData;

    // Regular expressions for validation
    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // make validation
        if (!newVehicle.vehicle_make) { 
            errors.make = "make is required";
            isValid = false;
        }

        // model validation
        if (!newVehicle.vehicle_model) {
            errors.model = "Model is required";
            isValid = false;
        }

        // year validation
        if (!newVehicle.vehicle_year) { 
            errors.year = "year is required";
            isValid = false;
        }

        // type validation
        if (!newVehicle.vehicle_type) {
            errors.type = "Type is required";
            isValid = false;
        }

        // color validation
        const colorRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
        if (!newVehicle.vehicle_color) {
            errors.color = "Color is required";
            isValid = false;
        } else if (!colorRegex.test(newVehicle.vehicle_color)) {
            errors.color = "Invalid color format";
            isValid = false;
        }

        // mileage validation
        const mileageRegex = /^\d{1,10}$/;
        if (!newVehicle.vehicle_mileage) {
            errors.mileage = "Mileage is required";
            isValid = false;
        } else if (!mileageRegex.test(newVehicle.vehicle_mileage)) {
            errors.mileage = "Mileage must be a number with up to 10 digits only";
            isValid = false;
        }

        // tag validation
        if (!newVehicle.vehicle_tag) {
            errors.tag = "License plate is required";
            isValid = false;
        } else if (newVehicle.vehicle_tag.length < 6) {
            errors.tag = "License plate must be at least 6 characters long";
            isValid = false;
        }

        // serial validation
        if (!newVehicle.vehicle_serial) {
            errors.serial = "Vin number is required";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (field, value) => {
        setNewVehicle((prev) => ({
            ...prev,
            [field]: value,
            ...(field === "make" ? { model: "" } : {}),
        }));
    };

    // Add a new vehicle using vehicleService
    const handleAddVehicle = async () => {

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(false);

        try {
            await vehicleService.addVehicle(id, newVehicle);
            setShowform(false);
            fetchVehicles();
            setNewVehicle({
                vehicle_make: "",
                vehicle_model: "",
                vehicle_year: "",
                vehicle_type: "",
                vehicle_color: "",
                vehicle_mileage: "",
                vehicle_tag: "",
                vehicle_serial: ""
            });
            Swal.fire({
                title: "Success!",
                html: "Vehicle added successfully.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            if (redirectUrl) {
                setTimeout(() => { navigate(redirectUrl) }, 1500);
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
            if (error === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "Error!",
                    html: `${error}. Please try again.`,
                    icon: "error",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.errorTitle,
                        htmlContainer: styles.text,
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Delete a vehicle of the customer
    // const handleDeleteVehicle = async (id) => {
    //     try {
    //         const result = await Swal.fire({
    //             title: "Are you sure you want to delete this vehicle?",
    //             html: "All related data associated with this vehicle will be deleted!",
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonText: "Yes!",
    //             customClass: {
    //                 popup: styles.popup,
    //                 confirmButton: styles.confirmButton,
    //                 cancelButton: styles.cancelButton,
    //                 icon: styles.icon,
    //                 title: styles.warningTitle,
    //                 htmlContainer: styles.text,
    //             },
    //         });
    //         if (!result.isConfirmed) return;
    //         setLoading(true);
    //         setError(false);

    //         await vehicleService.deleteVehicle(id);
    //         setVehicles(vehicles.filter((vehicle) => vehicle.vehicle_id !== id));
    //         setOrders(orders.filter((order) => order.vehicle_id !== id));

    //         await Swal.fire({
    //             title: "Deleted!",
    //             html: "Vehicle and related data have been deleted successfully.",
    //             icon: "success",
    //             customClass: {
    //                 popup: styles.popup,
    //                 confirmButton: styles.confirmButton,
    //                 icon: styles.icon,
    //                 title: styles.successTitle,
    //                 htmlContainer: styles.text,
    //             },
    //         });
    //     } catch (err) {
    //         console.error("Error deleting vehicle:", err);
    //         if (err === "Failed") {
    //             setError(true);
    //         } else {
    //             Swal.fire({
    //                 title: "Error!",
    //                 html: "Failed to delete vehicle. Please try again.",
    //                 icon: "error",
    //                 customClass: {
    //                     popup: styles.popup,
    //                     confirmButton: styles.confirmButton,
    //                     icon: styles.icon,
    //                     title: styles.errorTitle,
    //                     htmlContainer: styles.text,
    //                 },
    //             });
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <Layout>
            <div className={`${styles.customerVehicles} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                        <div className={styles.customerContainer}>

                            {/* Vehicles Section */}
                            <div className={styles.container}>
                                <div className={styles.allInfo}>
                                    <h2>My Vehicles <span>_____</span></h2>
                                    <div className={styles.vehicleInfo}>
                                        {vehicles && Object.keys(vehicles).length > 0 ? (
                                            Object.values(vehicles).map((vehicle, index) => (
                                                <div key={index}>
                                                    {/* <div className={styles.deleteIcon} onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}>
                                                        <MdDelete />
                                                    </div> */}
                                                    <div className={styles.vehicleCard}>
                                                        <p>
                                                            <strong>Vehicle:</strong>
                                                            {vehicle.vehicle_make} {vehicle.vehicle_model} ({vehicle.vehicle_year})
                                                        </p>
                                                        <p><strong>Color:</strong> {vehicle.vehicle_color}</p>
                                                        <p><strong>Mileage:</strong> {vehicle.vehicle_mileage}</p>
                                                        <p><strong>License Plate:</strong> {vehicle.vehicle_tag}</p>
                                                        <p><strong>VIN:</strong> {vehicle.vehicle_serial}</p>
                                                        <p>
                                                            <strong>Edit Vehicle Info:</strong>
                                                            <span onClick={() => navigate(`/edit-vehicle/${user?.customer_id}/${vehicle.vehicle_id}`)}>
                                                                <FaEdit />
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.noMessage}>No vehicles found</p>
                                        )}
                                        {!showform && <button onClick={() => setShowform(true)}>Add New Vehicle</button>}
                                    </div>
                                </div>
                            </div>

                            {/* vehicle form */}
                            {showform && (
                                <div className={styles.vehicleForm}>
                                    <div className={styles.closeBtn} onClick={() => setShowform(false)}>X</div>
                                    <div className={styles.vehicleFormContainer}>
                                        <h2>Add a New Vehicle <span>____</span></h2>
                                        <div>
                                            <div className={`${formErrors.year ? styles.error : styles.hidden}`} role="alert">
                                                {formErrors.year}.
                                            </div>
                                            <select
                                                className={styles.input}
                                                value={newVehicle.vehicle_year || ""}
                                                onChange={(e) => handleChange("vehicle_year", e.target.value)}
                                            >
                                                <option value="">* Year</option>
                                                {Array.from({ length: 40 }, (_, i) => {
                                                    const year = new Date().getFullYear() + 1 - i;
                                                    return (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div>
                                            <div className={`${formErrors.make ? styles.error : styles.hidden}`} role="alert">
                                                {formErrors.make}.
                                            </div>
                                            <select
                                                className={styles.input}
                                                value={newVehicle.vehicle_make || ""}
                                                onChange={(e) => handleChange("vehicle_make", e.target.value)}
                                            >
                                                <option value="">* Make</option>
                                                {carMakers.map((maker, i) => (
                                                    <option key={i} value={maker}>
                                                        {maker}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <div className={`${formErrors.model ? styles.error : styles.hidden}`} role="alert">
                                                {formErrors.model}.
                                            </div>
                                            <select
                                                // className={style.input}
                                                value={newVehicle.vehicle_model || ""}
                                                onChange={(e) => handleChange("vehicle_model", e.target.value)}
                                                disabled={!newVehicle.vehicle_make}
                                            >
                                                <option value="">* Model</option>
                                                {newVehicle.vehicle_make &&
                                                    carModelsByMake[newVehicle.vehicle_make].map((model, i) => (
                                                        <option key={i} value={model}>
                                                            {model}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <div className={`${formErrors.type ? styles.error : styles.hidden}`} role="alert">
                                                {formErrors.type}.
                                            </div>
                                            <select
                                                className={styles.input}
                                                value={newVehicle.vehicle_type || ""}
                                                onChange={(e) => handleChange("vehicle_type", e.target.value)}
                                            >
                                                <option value="">* Type</option>
                                                {vehicleTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                        <div className={`${formErrors.color ? styles.error : styles.hidden}`} role="alert">
                                            {formErrors.color}.
                                        </div>
                                        <input
                                            type="text"
                                            name="vehicle_color"
                                            placeholder="* Color"
                                            value={newVehicle.vehicle_color}
                                            onChange={(e) => handleChange("vehicle_color", e.target.value)}
                                        />
                                        </div>
                                        <div>
                                        <div className={`${formErrors.year ? styles.error : styles.hidden}`} role="alert">
                                            {formErrors.year}.
                                        </div>
                                        <input
                                            type="text"
                                            name="vehicle_mileage"
                                            placeholder="* Mileage"
                                            value={newVehicle.vehicle_mileage}
                                            onChange={(e) => handleChange("vehicle_mileage", e.target.value)}
                                        />
                                        </div>
                                        <div>
                                        <div className={`${formErrors.tag ? styles.error : styles.hidden}`} role="alert">
                                            {formErrors.tag}.
                                        </div>
                                        <input
                                            type="text"
                                            name="vehicle_tag"
                                            placeholder="* License Plate"
                                            value={newVehicle.vehicle_tag}
                                            onChange={(e) => handleChange("vehicle_tag", e.target.value)}
                                        />
                                        </div>
                                        <div>
                                        <div className={`${formErrors.serial ? styles.error : styles.hidden}`} role="alert">
                                            {formErrors.serial}.
                                        </div>
                                        <input
                                            type="text"
                                            name="vehicle_serial"
                                            placeholder="* VIN Number"
                                            value={newVehicle.vehicle_serial}
                                            onChange={(e) => handleChange("vehicle_serial", e.target.value)}
                                        />
                                        </div>
                                        <button onClick={handleAddVehicle}>Add Vehicle</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default MyVehicles;