import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { FaHandPointUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import CryptoJS from "crypto-js";
import customerservice from "../../../services/customer.service";
import vehicleService from "../../../services/vehicle.service";
import serviceService from "../../../services/service.service";
import orderService from "../../../services/order.service";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import Layout from "../../../Layout/Layout";
import styles from "./NewOrder.module.css";

const NewOrder = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [customer, setCustomer] = useState({});
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState();
    const [services, setServices] = useState(); 
    const [order, setOrder] = useState({additional_request: "", order_total_price: "", order_status: 0, active_order: true, additional_requests_completed: false, service_completed: false, service_ids: [], customer_id: "", vehicle_id: "", employee_id: ""});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSearch, setShowSearch] = useState(true);
    const [showCustomer, setShowCustomer] = useState(false);
    const {employeeId} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerservice.fetchCustomers();
            setCustomers(response.data);
            setFilteredCustomers(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load customer data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerById = async (customerId) => {
        try {
            const response = await customerservice.fetchCustomerById(customerId);
            setCustomer(response.data);
            setOrder({...order, customer_id: customerId});
        } catch (err) {
            console.error(err);
            setError("Failed to load customer data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVehiclesByCustomerId = async (customerId) => {
        try {
            const response = await vehicleService.fetchVehiclesByCustomerId(
                customerId
            );
            setVehicles(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load vehicle data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVehiclesById = async (vehicleId) => {
        try {    
            const response = await vehicleService.fetchVehicleById(vehicleId);    
            setVehicle(response.data);
            setOrder({...order, vehicle_id: vehicleId, employee_id: employeeId});
        } catch (err) { 
            console.error(err);
            setError("Failed to load vehicle data.");    
        } finally {
            setLoading(false);  
        }
    };

    const fetchAllServices = async () => {
        try {
            const response = await serviceService.getAllServices();
            setServices(response);
        } catch (err) {
            console.error(err);
            setError("Failed to load service data.");
        } finally {
            setLoading(false);
        }
    };

    const generateorderHash = () => {
        const dataToHash =
            order.additional_request +
            order.order_total_price;
        return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
    };

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

    const handleAddCustomer = () => {
        navigate("/admin/add-customer");
    };

    const handleSelectCustomer = (customerId) => {
        // navigate(`/customer/${customerId}/select-vehicle`);
        fetchCustomerById(customerId);
        fetchVehiclesByCustomerId(customerId);
        setShowSearch(false);
        setShowCustomer(true);
    };

    const handleSelectVehicle = (vehicleId) => {        
        // navigate(`/admin/new-order/${vehicleId}`);
        fetchVehiclesById(vehicleId);
        fetchAllServices();
        setVehicles(null);
    };

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


    const handleCreateOrder = async () => {
        const orderHash = generateorderHash();

        const orderWithHash = {
            ...order,
            order_hash: orderHash,
        };

        try {
            const response = await orderService.addOrder(orderWithHash);
            setOrder(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to create order.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading customers...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className=" d-none d-lg-block col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.adminMenuContainer} d-block d-lg-none`}>
                    <div className={styles.adminMenuTitle}>
                        <h2>Admin Menu</h2>
                    </div>
                    <div className={styles.listGroup}>
                        <Link to="/admin/dashboard" className={styles.listGroupItem}>Dashboard</Link>
                        <Link to="/admin/orders" className={styles.listGroupItem}>Orders</Link>
                        <Link to="/admin/new-order" className={styles.listGroupItem}>New order</Link>
                        <Link to="/admin/add-employee" className={styles.listGroupItem}>Add employee</Link>
                        <Link to="/admin/employees" className={styles.listGroupItem}>Employees</Link>
                        <Link to="/admin/add-customer" className={styles.listGroupItem}>Add customer</Link>
                        <Link to="/admin/customers" className={styles.listGroupItem}>Customers</Link>
                        <Link to="/admin/services" className={styles.listGroupItem}>Services</Link>
                    </div>
                </div>
                <div className={`${styles.orderList} col-12 col-lg-9`}>
                    <div className={styles.header}>
                        <h2>
                            Create a New Order <span>____</span>
                        </h2>
                        {showSearch && <div className={styles.searchBar}>
                            <div className={styles.searchIcon}>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search for a customer by name, email, or phone number"
                                />
                                <span>
                                    <FaSearch />
                                </span>
                            </div>
                            {searchTerm === "" && (
                                <button
                                    onClick={handleAddCustomer}
                                    className={styles.addButton}
                                >
                                    Add New Customer
                                </button>
                            )}
                        </div>}
                    </div>
                    {showSearch && <div className={styles.results}>
                        {searchTerm !== "" && Object.keys(filteredCustomers).length > 0 ? (
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
                                    {Object.entries(filteredCustomers).map(([id, customer]) => (
                                        <tr key={id}>
                                            <td>{customer.customer_first_name}</td>
                                            <td>{customer.customer_last_name}</td>
                                            <td>{customer.customer_email}</td>
                                            <td>{customer.customer_phone_number}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleSelectCustomer(customer.customer_id)}
                                                    className={styles.selectButton}
                                                >
                                                    <FaHandPointUp />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : searchTerm !== "" ? (
                            <p className={styles.noResults}>
                                No customers matched your search.
                            </p>
                        ) : null}
                    </div>
                    }
                    {showCustomer && <div>
                        <div className={styles.customerInfo}>
                            <div>
                                <h3>{customer.customer_first_name} {customer.customer_last_name}</h3>
                                <div className={styles.customerDetails}>
                                    <p><strong>Email:</strong> {customer.customer_email}</p>
                                    <p><strong>Phone Number:</strong> {customer.customer_phone_number}</p>
                                    <p><strong>Customer:</strong> {customer.active_customer_status ? "Yes" : "No"}</p>
                                    <p><strong>Edit Customer Info:</strong> <span><FaEdit /></span></p>
                                </div>
                            </div>
                            <button onClick={() => { setShowSearch(true); setShowCustomer(false) }}>x</button>
                        </div>
                        {vehicles && <div>
                            <h2>Choose a Vehicle</h2>
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
                                                    onClick={() => handleSelectVehicle(vehicle.vehicle_id)}
                                                    className={styles.selectButton}
                                                >
                                                    <FaHandPointUp />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}
                    </div>
                    }
                    {vehicle && <div>
                        <div className={styles.vehicleInfo}>
                            <div>
                                <h3>{vehicle.vehicle_make} {vehicle.vehicle_model}</h3>
                                <div className={styles.vehicleDetails}>
                                    <p><strong>Year:</strong> {vehicle.vehicle_year}</p>
                                    <p><strong>Color:</strong> {vehicle.vehicle_color}</p>
                                    <p><strong>Mileage:</strong> {vehicle.vehicle_mileage}</p>
                                    <p><strong>Tag:</strong> {vehicle.vehicle_tag}</p>
                                    <p><strong>Serial:</strong> {vehicle.vehicle_serial}</p>
                                    <p><strong>Edit Vehicle Info:</strong> <span><FaEdit /></span></p>
                                </div>
                            </div>
                            <button onClick={() => { setShowSearch(true); setShowCustomer(false); setShowVehicle(false) }}>x</button>
                        </div>
                    </div>}
                    {services && <div>
                        <div className={styles.services}>
                            <h2>Choose Services</h2>
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
                            <h2>Additional requests <span>____</span></h2>
                            <textarea type="text" value={order.additional_request || ""} placeholder="Service description" onChange={(e) => setOrder({ ...order, additional_request: e.target.value })} />
                            <input type="number" value={order.order_total_price || ""} placeholder="Price" onChange={(e) => setOrder({ ...order, order_total_price: e.target.value })} />
                            <button onClick={handleCreateOrder}>Submit Order</button>
                        </div>
                    </div>}
                </div>
            </div>
        </Layout>
    );
};

export default NewOrder;
