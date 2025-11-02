import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import carMakersData from "../../assets/json/carMakers.json";
import vehicleTypes from "../../assets/json/vehicleTypes.json";
import vehicleService from "../../services/vehicle.service";
import customerService from "../../services/customer.service";
import orderService from "../../services/order.service";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./CustomerProfile.module.css";

const CustomerProfile = () => {

    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [vehicles, setVehicles] = useState({});
    const [orders, setOrders] = useState([]);
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
    
    useEffect(() => {
        if (!id) return;
        fetchCustomerData();
        fetchVehicles();
        fetchOrders();
    }, [id]);

    // Fetch customer data
    const fetchCustomerData = async () => {

        setLoading(true);
        setError(false);

        try {
            const customerData = await customerService.fetchCustomerById(parseInt(id, 10));
            setCustomer(customerData.data);
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles for the customer
    const fetchVehicles = async () => {

        setLoading(true);
        setError(false);

        try {
            const vehicleData = await vehicleService.fetchVehiclesByCustomerId(parseInt(id));
            setVehicles(vehicleData.data);
        } catch (error) {
            if (!error.response?.data?.message === "No vehicles found for this customer") {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const carMakers = Object.keys(carMakersData);
    const carModelsByMake = carMakersData;

    // Fetch orders for the customer
    const fetchOrders = async () => {

        setLoading(true);
        setError(false);

        try {
            const orderData = await orderService.fetchCustomerOrders(parseInt(id));
            setOrders(orderData.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

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

    // Handle form input changes for the modal
    const handleChange = (field, value) => {
        setNewVehicle((prev) => ({
            ...prev,
            [field]: value,
            ...(field === "make" ? { model: "" } : {}),
        }));

        // Clear the corresponding error when user types
        setFormErrors((prevFormErrors) => ({
            ...prevFormErrors,
            ...(field === "vehicle_make" && { make: "" }),
            ...(field === "vehicle_model" && { model: "" }),
            ...(field === "vehicle_year" && { year: "" }),
            ...(field === "vehicle_type" && { type: "" }),
            ...(field === "vehicle_color" && { color: "" }),
            ...(field === "vehicle_mileage" && { mileage: "" }),
            ...(field === "vehicle_tag" && { tag: "" }),
            ...(field === "vehicle_serial" && { serial: "" }),
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
            await vehicleService.addVehicle(parseInt(id), newVehicle);
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
                vehicle_serial: "",
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

            // Append the new vehicle to existing list
            setVehicles((prevVehicles) => [
                ...prevVehicles,
                { ...newVehicle }, // You can add an ID or timestamp if needed
            ]);
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
    const handleDeleteVehicle = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure you want to delete this vehicle?",
                html: "All related data associated with this vehicle will be deleted!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes!",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    cancelButton: styles.cancelButton,
                    icon: styles.icon,
                    title: styles.warningTitle,
                    htmlContainer: styles.text,
                },
            });
            if (!result.isConfirmed) return;
            setLoading(true);
            setError(false);

            await vehicleService.deleteVehicle(id);
            setVehicles(vehicles.filter((vehicle) => vehicle.vehicle_id !== id));
            setOrders(orders.filter((order) => order.vehicle_id !== id));

            await Swal.fire({
                title: "Deleted!",
                html: "Vehicle and related data have been deleted successfully.",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
        } catch (err) {
            console.error("Error deleting vehicle:", err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Failed to delete vehicle. Please try again.",
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

    // Delete an order of the customer
    const handleDeleteOrder = async (id) => {

        try {
            const result = await Swal.fire({
            title: "Are you sure you want to delete this order?",
            html: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes !",
            customClass: {
                popup: styles.popup,
                confirmButton: styles.confirmButton,
                cancelButton: styles.cancelButton,
                icon: styles.icon,
                title: styles.warningTitle,
                htmlContainer: styles.text,
            },
        });
            if (!result.isConfirmed) return;
                setLoading(true);
                setError(false);
                    await orderService.deleteOrder(id);
                    setOrders(orders.filter((order) => order.order_id !== id));

                    await Swal.fire({
                        title: "Deleted!",
                        html: "The order has been deleted.",
                        icon: "success",
                        customClass: {
                            popup: styles.popup,
                            confirmButton: styles.confirmButton,
                            icon: styles.icon,
                            title: styles.successTitle,
                            htmlContainer: styles.text,
                        },
                    });
                } catch (error) {
                    console.error("Error deleting order:", error);
                    if (error === "Failed") {
                        setError(true);
                    } else {             
                        Swal.fire({
                            title: "Error!",
                            html: "Failed to delete order. Please try again!",
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

    // Get the order status
    function getOrderStatus(status) {
        if (status === 0) return "Received";
        if (status === 1) return "In Progress";
        if (status === 2) return "Completed";
        return "Pending";
    };

    return (
        <Layout>
            <div className={`${styles.customerProfile} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (
                        <div className={styles.customerContainer}>

                            {/* customer Info Section */}
                            <div className={styles.container}>
                                <div className={styles.title}>Info</div>
                                <div className={styles.allInfo}>
                                    <h2>Customer: {customer?.customer_first_name} {customer?.customer_last_name}</h2>
                                    {customer ? (<div className={styles.customerInfo}>
                                        <p><strong>Email:</strong> {customer.customer_email}</p>
                                        <p><strong>Phone Number:</strong> {customer.customer_phone_number}</p>
                                        <p><strong>Active Customer:</strong> {customer.active_customer_status ? "Yes" : "No"}</p>
                                        <p>
                                            <strong>Edit Customer Info:</strong>
                                            <span onClick={() => navigate(`/edit-customer/${customer.customer_id}`)}>
                                                <FaEdit />
                                            </span>
                                        </p>
                                    </div>) : (<p>Loading customer data...</p>)}
                                </div>
                            </div>

                            {/* Vehicles Section */}
                            <div className={styles.container}>
                                <div className={styles.title}>Cars</div>
                                <div className={styles.allInfo}>
                                    <h2>Vehicles of {customer?.customer_first_name}</h2>
                                    <div className={styles.vehicleInfo}>
                                        {vehicles && Object.keys(vehicles).length > 0 ? (
                                            Object.values(vehicles).map((vehicle, index) => (
                                                <div key={index}>
                                                    <div className={styles.deleteIcon} onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}>
                                                        <MdDelete />
                                                    </div>
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
                                                            <span onClick={() => navigate(`/edit-vehicle/${customer.customer_id}/${vehicle.vehicle_id}`)}>
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
                                        <div className={`${formErrors.mileage ? styles.error : styles.hidden}`} role="alert">
                                            {formErrors.mileage}.
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

                            {/* Orders Section */}
                            <div className={styles.container}>
                                <div className={styles.title}>Orders</div>
                                <div className={styles.allInfo}>
                                    <h2>Orders of {customer?.customer_first_name}</h2>
                                    <div className={styles.orderInfo}>
                                        {orders && orders.length > 0 ? (
                                            orders.map((order, index) => (
                                                <div key={index}>
                                                    <div className={styles.deleteIcon} onClick={() => handleDeleteOrder(order.order_id)}>
                                                        <MdDelete />
                                                    </div>
                                                    <div className={styles.orderCard}>
                                                        <p><strong>Order #: </strong>{order.order_id}</p>
                                                        <p>
                                                            <strong>Vehicle: </strong>
                                                            {order.vehicle_year} {order.vehicle_make} {order.vehicle_model}
                                                        </p>
                                                        <p><strong>Date: </strong>{order.order_date.split("T")[0]}</p>
                                                        <p><strong>Status: </strong>{getOrderStatus(order.order_status)}</p>
                                                        <p><strong>Total: </strong>${order.order_total_price}</p>
                                                        <p>
                                                            <strong>Edit Order Info:</strong>
                                                            <span onClick={() => navigate(`/edit-order/${order.order_id}`)}>
                                                                <FaEdit />
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles.noMessage}>No orders found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default CustomerProfile;