import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FaHandPointUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import carMakersData from "../../assets/json/carMakers.json";
import vehicleTypes from "../../assets/json/vehicleTypes.json";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import customerservice from "../../services/customer.service";
import vehicleService from "../../services/vehicle.service";
import serviceService from "../../services/service.service";
import orderService from "../../services/order.service";
import employeeService from "../../services/employee.service";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import Layout from "../../Layout/Layout";
import styles from "./NewOrder.module.css";

const NewOrder = () => {

    const navigate = useNavigate();
    const { employeeId } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [customer, setCustomer] = useState({});
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [services, setServices] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showSearch, setShowSearch] = useState(true);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showVehicle, setShowVehicle] = useState(false);
    const [showVehicles, setShowVehicles] = useState(true);
    const [showform, setShowform] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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
    const [order, setOrder] = useState({
        additional_request: "",
        order_total_price: "",
        order_status: 0,
        pickup_status: 0,
        active_order: true,
        additional_requests_completed: false,
        service_completed: false,
        service_ids: [],
        customer_id: "",
        vehicle_id: "",
        employee_id: "",
        technician_id: ""
    });
    const itemsPerPage = 10;

    // Fetch customers function
    useEffect(() => {
        const fetchCustomers = async () => {

            setLoading(true);
            setError(false);

            try {
                const response = await customerservice.fetchCustomers();
                setCustomers(response.data);
                setFilteredCustomers(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Search customers function
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredCustomers(customers);
        } else {
            const results = customers.filter(
                (customer) =>
                    customer.customer_first_name?.toLowerCase().includes(term) ||
                    customer.customer_last_name?.toLowerCase().includes(term) ||
                    customer.customer_email?.toLowerCase().includes(term) ||
                    customer.customer_phone_number?.includes(term)
            );
            setFilteredCustomers(results);
        }
    };

    // Pagination
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handlePageChange = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    // Add customer function for redirect
    const handleAddCustomer = () => {
        navigate(`/add-customer?redirect=/new-order`);
    };

    // Fetch customer by id
    const fetchCustomerById = async (customerId) => {

        setLoading(true);
        setError(false);

        try {
            const response = await customerservice.fetchCustomerById(customerId);
            setCustomer(response.data);
            console.log("response", response.data);
            // setOrder({ ...order, customer_id: customerId });
            setOrder((prev) => ({ ...prev, customer_id: customerId }));
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles by customer id
    const fetchVehiclesByCustomerId = async (customerId) => {
        
        setLoading(true);
        setError(false);

        console.log("Fetching vehicles for customer ID:", customerId);

        try {
            const response = await vehicleService.fetchVehiclesByCustomerId(customerId);
            setVehicles(response.data);
        } catch (err) {
            console.error(err);
            if (err.response.status === 404) {
                setError(false);
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicles by customer id function 
    const handleSelectCustomer = (customerId) => {
        fetchCustomerById(customerId);
        fetchVehiclesByCustomerId(customerId);
        setShowSearch(false);
        setShowCustomer(true);
    };

    // Fetch vehicle by id
    const fetchVehicleById = async (vehicleId) => {

        setLoading(true);
        setError(false);

        try {
            const response = await vehicleService.fetchVehicleById(vehicleId);
            setVehicle(response.data);
            setOrder({ ...order, vehicle_id: vehicleId, employee_id: employeeId });
        } catch (err) {
            console.error(err);
            setError(true);
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
    const handleAddVehicle = async (customerId) => {
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError(false);

        try {
            await vehicleService.addVehicle(customerId, newVehicle);
            setShowform(false);
            fetchVehiclesByCustomerId(customerId);
            // setNewVehicle({
            //     vehicle_make: "",
            //     vehicle_model: "",
            //     vehicle_year: "",
            //     vehicle_type: "",
            //     vehicle_color: "",
            //     vehicle_mileage: "",
            //     vehicle_tag: "",
            //     vehicle_serial: "",
            // });
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
            // setVehicles((prevVehicles) => [
            //     ...prevVehicles,
            //     { ...newVehicle },
            // ]);
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

    // Fetch all services
    const fetchAllServices = async () => {

        setLoading(true);
        setError(false);

        try {
            const response = await serviceService.getAllServices();
            setServices(response);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVehicle = (vehicleId) => {
        fetchVehicleById(vehicleId);
        fetchAllServices();
    };

    // Generate order hash
    const generateorderHash = () => {
        const dataToHash =
            order.additional_request +
            order.order_total_price;
        return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
    };

    // function to Add data 
    const handleAddData = (e, service) => {
        const { checked } = e.target;
        const { service_id } = service;

        setOrder((prevOrder) => {
            const updatedServices = checked
                ? [...prevOrder.service_ids, service_id]
                : prevOrder.service_ids.filter((id) => id !== service_id);
            return { ...prevOrder, service_ids: updatedServices };
        });
    };

    // Fetch Techincians
    const fetchTechniciansData = async () => {

        setLoading(true);
        setError(false);

        try {
            const response = await employeeService.fetchEmployees();
            const technicians = response.data.filter((employee) => employee.company_role_id === 1);
            setTechnicians(technicians);
            console.log("response of technicians", technicians);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // function to Create a new order
    const handleCreateOrder = async () => {
        const orderHash = generateorderHash();
        const orderWithHash = {
            ...order,
            order_hash: orderHash,
        };

        console.log("orderWithHash", orderWithHash);

        setLoading(true);
        setError(false);

        try {
            const response = await orderService.addOrder(orderWithHash);
            setOrder(response.data);
            Swal.fire({
                title: "Success!",
                html: "Order created successfully",
                icon: "success",
                customClass: {
                    popup: styles.popup,
                    confirmButton: styles.confirmButton,
                    icon: styles.icon,
                    title: styles.successTitle,
                    htmlContainer: styles.text,
                },
            });
            // setTimeout(() => { navigate(`/order-details/${response.data.order_id}`)}, 1500);
            // setTimeout(() => { window.location.href = `/order-details/${response.data.order_id}` }, 1500);
        } catch (err) {
            console.error(err);
            if (err === "Failed") {
                setError(true);
            } else {
                Swal.fire({
                    title: "error!",
                    html: "Failed to create order. Please try again!",
                    icon: "error",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.errorTitle,
                        htmlContainer: styles.text
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className=" d-none d-xl-block col-3"><AdminMenu /></div>
                <div className="d-block d-xl-none"><AdminMenuMobile /></div>
                <div className="col-12 col-xl-9">
                    {!loading && !error ? (
                        <div className={styles.orderList}>
                            <div className={styles.header}>
                                <h2>Create a New Order <span>____</span></h2>
                                {showSearch && <div className={styles.searchBar}>
                                    <div className={styles.searchIcon}>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            placeholder="Search for a customer by name, email, or phone number"
                                        />
                                        <span><FaSearch /></span>
                                    </div>
                                    {searchTerm === "" && (
                                        <button onClick={handleAddCustomer} className={styles.addButton}>
                                            Add New Customer
                                        </button>
                                    )}
                                </div>}
                            </div>
                            {showSearch && <div className={styles.results}>
                                {searchTerm !== "" && Object.keys(filteredCustomers).length > 0 ? (
                                    <div>
                                        {/* customers table */}
                                        <div className={styles.tableContainer}>
                                            <table className={styles.customerTable}>
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedCustomers.map((customer) => (
                                                        <tr key={customer.customer_id}>
                                                            <td>{customer.customer_first_name}</td>
                                                            <td>{customer.customer_last_name}</td>
                                                            <td>{customer.customer_email}</td>
                                                            <td>{customer.customer_phone_number}</td>
                                                            <td>
                                                                <button
                                                                    className={styles.selectButton}
                                                                    onClick={() => {
                                                                        handleSelectCustomer(customer.customer_id);
                                                                        setShowVehicles(true);
                                                                    }}
                                                                >
                                                                    <FaHandPointUp />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* pagination */}
                                        <div className={styles.pagination}>
                                            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                                                Previous
                                            </button>
                                            <span>Page {currentPage} of {totalPages}</span>
                                            <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : searchTerm !== "" ? (
                                    <p className={styles.noResults}>No customers matched your search.</p>
                                ) : null}
                            </div>}
                            {showCustomer && <div>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setShowSearch(true);
                                        setShowCustomer(false);
                                        setServices(null);
                                        setShowVehicle(false);
                                        setShowVehicles(false);
                                        setVehicles([]);
                                    }}
                                >
                                    x
                                </button>
                                {/* customer info */}
                                <div className={styles.customerInfo}>
                                    <h3>{customer.customer_first_name} {customer.customer_last_name}</h3>
                                    <div className={styles.customerDetails}>
                                        <p><strong>Email:</strong> {customer.customer_email}</p>
                                        <p><strong>Phone Number:</strong> {customer.customer_phone_number}</p>
                                        <p><strong>Customer:</strong> {customer.active_customer_status ? "Yes" : "No"}</p>
                                        <p>
                                            <strong>Edit Customer Info:</strong>
                                            <span onClick={() => navigate(`/edit-customer/${customer.customer_id}`)}>
                                                <FaEdit />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {!showVehicle && <div>
                                    {/* vehicles table */}
                                    <h2>Choose a Vehicle <span>____</span></h2>
                                    {vehicles.length > 0 ? (<div className={styles.tableContainer}>
                                        <table className={styles.vehicleTable}>
                                            <thead>
                                                <tr>
                                                    <th>Year</th>
                                                    <th>Make</th>
                                                    <th>Model</th>
                                                    <th>Color</th>
                                                    <th>Mileage</th>
                                                    <th>Tag</th>
                                                    <th>Serial</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehicles.map((vehicle) => (
                                                    <tr key={vehicle.vehicle_id}>
                                                        <td>{vehicle.vehicle_year}</td>
                                                        <td>{vehicle.vehicle_make}</td>
                                                        <td>{vehicle.vehicle_model}</td>
                                                        <td>{vehicle.vehicle_color}</td>
                                                        <td>{vehicle.vehicle_mileage}</td>
                                                        <td>{vehicle.vehicle_tag}</td>
                                                        <td>{vehicle.vehicle_serial}</td>
                                                        <td>
                                                            <button
                                                                className={styles.selectButton}
                                                                onClick={() => {
                                                                    handleSelectVehicle(vehicle.vehicle_id);
                                                                    fetchTechniciansData();
                                                                    setShowVehicles(false);
                                                                    setShowVehicle(true);
                                                                }}
                                                            >
                                                                <FaHandPointUp />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>) : (<div className={styles.noResults}>
                                        <p>No vehicles found for this customer.</p>
                                    </div>)}
                                        {!showform && <button className={styles.vehicleContainer} onClick={() => setShowform(true)}>Add New Vehicle</button>}
                                </div>}
                            </div>}
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
                                        <button onClick={() => handleAddVehicle(customer.customer_id)}>Add Vehicle</button>
                                    </div>
                                </div>
                            )}
                            {showVehicle && <div>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setShowVehicle(false);
                                        setServices(null);
                                        fetchVehiclesByCustomerId(customer.customer_id);
                                        setShowVehicles(true);
                                    }}
                                >
                                    x
                                </button>
                                {/* vehicle info */}
                                <div className={styles.vehicleInfo}>
                                    <h3>{vehicle.vehicle_make} {vehicle.vehicle_model}</h3>
                                    <div className={styles.vehicleDetails}>
                                        <p><strong>Year:</strong> {vehicle.vehicle_year}</p>
                                        <p><strong>Color:</strong> {vehicle.vehicle_color}</p>
                                        <p><strong>Mileage:</strong> {vehicle.vehicle_mileage}</p>
                                        <p><strong>Tag:</strong> {vehicle.vehicle_tag}</p>
                                        <p><strong>Serial:</strong> {vehicle.vehicle_serial}</p>
                                        <p>
                                            <strong>Edit Vehicle Info:</strong>
                                            <span
                                                onClick={() =>
                                                    navigate(`/edit-vehicle/${customer.customer_id}/${vehicle.vehicle_id}`)
                                                }>
                                                <FaEdit />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>}
                            {services && <div>
                                {/* services section */}
                                <div className={styles.services}>
                                    <h2>Choose Services <span>____</span></h2>
                                    {services.map((service) => (
                                        <div key={service.service_id} className={styles.serviceInfo}>
                                            <div>
                                                <h3>{service.service_name}</h3>
                                                <p>{service.service_description}</p>
                                            </div>
                                            <input type="checkbox" onChange={(e) => handleAddData(e, service)} />
                                        </div>))}
                                </div>
                                <div className={styles.orderForm}>
                                    <div className={styles.orderInfo}>
                                        <h2>Additional requests <span>____</span></h2>
                                        <textarea
                                            type="text"
                                            value={order.additional_request || ""}
                                            placeholder="Service description"
                                            onChange={(e) => setOrder({ ...order, additional_request: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.orderForm}>
                                    <div className={styles.orderInfo}>
                                        <h3>Total Price</h3>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={order.order_total_price}
                                            placeholder="Price *"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                    setOrder({ ...order, order_total_price: value });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.orderForm}>
                                    <div className={styles.orderInfo}>
                                        <h3>Assigned Technician</h3>
                                        <select
                                            value={order.technician_id || ""}
                                            onChange={(e) => setOrder({ ...order, technician_id: Number(e.target.value) })}
                                        >
                                            <option value="">Select Technician</option>
                                            {technicians.map((technician) => (
                                                <option key={technician.employee_id} value={technician.employee_id}>
                                                    {technician.employee_first_name} {technician.employee_last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.submitOrder}>
                                    <button onClick={handleCreateOrder}>Submit Order</button>
                                </div>
                            </div>}
                        </div>
                    ) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default NewOrder; 