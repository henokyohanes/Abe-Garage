import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import vehicleService from "../../services/vehicle.service";
import customerService from "../../services/customer.service";
import orderService from "../../services/order.service";
import styles from "./CustomerProfile.module.css";

const CustomerProfile = () => {

    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [vehicles, setVehicles] = useState({});
    const [orders, setOrders] = useState([]);
    const [showform, setShowform] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ vehicle_make: "", vehicle_model: "", vehicle_year: "", vehicle_type: "", vehicle_color: "", vehicle_mileage: "", vehicle_tag: "", vehicle_serial: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomerData();
        fetchVehicles();
        fetchOrders();
    }, []);

    // Fetch customer data
    const fetchCustomerData = async () => {
        try {
            const customerData = await customerService.fetchCustomerById(parseInt(id));
            if (!customerData) throw new Error("Customer not found.");
            setCustomer(customerData.data);
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    // Fetch vehicles for the customer
    const fetchVehicles = async () => {
        try {
            const vehicleData = await vehicleService.fetchVehiclesByCustomerId(parseInt(id));
            setVehicles(vehicleData.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    // Fetch orders for the customer
    const fetchOrders = async () => {
        try {
            const orderData = await orderService.fetchCustomerOrders(parseInt(id));
            console.log("orderData", orderData);
            setOrders(orderData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Add a new vehicle using vehicleService
    const handleAddVehicle = async () => {
        try {
            await vehicleService.addVehicle(parseInt(id), newVehicle);
            setShowform(false);
            fetchVehicles();
            alert("Vehicle added successfully!");
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert(error || "Failed to add vehicle");
        }
    };

    // Handle form input changes for the modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Layout>
            <div className={`${styles.customerProfile} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.customerContainer} col-9`}>

                    {/* Info Section */}
                    <div className={styles.container}>
                        <div className={styles.title}>Info</div>
                        <div>
                            <h2>Customer: {customer?.customer_first_name} {customer?.customer_last_name}</h2>
                            {customer ? (<div className={styles.customerInfo}>
                                <p><strong>Email:</strong> {customer.customer_email}</p>
                                <p><strong>Phone Number:</strong> {customer.customer_phone_number}</p>
                                <p><strong>Active Customer:</strong> {customer.active_customer_status ? "Yes" : "No"}</p>
                                <p><strong>Edit Customer Info:</strong> <span onClick={() => navigate(`/edit-customer/${customer.customer_id}`)}><FaEdit /></span></p>
                            </div>) : (<p>Loading customer data...</p>)}
                        </div>
                    </div>

                    {/* Vehicles Section */}
                    <div className={styles.container}>
                        <div className={styles.title}>Cars</div>
                        <div>
                            <h2>Vehicles of {customer?.customer_first_name}</h2>
                            {vehicles && Object.keys(vehicles).length > 0 ? (
                                Object.values(vehicles).map((vehicle, index) => (
                                    <div key={index} className={styles.vehicleInfo}>
                                        <p>
                                            <strong>Vehicle:</strong> {vehicle.vehicle_make} {vehicle.vehicle_model} ({vehicle.vehicle_year})
                                        </p>
                                        <p><strong>Color:</strong> {vehicle.vehicle_color}</p>
                                        <p><strong>License Plate:</strong> {vehicle.vehicle_tag}</p>
                                        <p><strong>VIN:</strong> {vehicle.vehicle_serial}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No vehicles found</p>
                            )}
                            <button onClick={() => setShowform(true)}>Add New Vehicle</button>
                        </div>
                    </div>

                    {/* vehicle form */}
                    {showform && (
                        <div className="">
                            <div className="modal-content">
                                <h2>Add New Vehicle</h2>
                                <input
                                    type="text"
                                    name="vehicle_year"
                                    placeholder="Vehicle year"
                                    value={newVehicle.vehicle_year}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_make"
                                    placeholder="Vehicle make"
                                    value={newVehicle.vehicle_make}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_model"
                                    placeholder="Vehicle model"
                                    value={newVehicle.vehicle_model}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_type"
                                    placeholder="Vehicle type"
                                    value={newVehicle.vehicle_type}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_color"
                                    placeholder="Vehicle color"
                                    value={newVehicle.vehicle_color}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_mileage"
                                    placeholder="Vehicle mileage"
                                    value={newVehicle.vehicle_mileage}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_tag"
                                    placeholder="Vehicle tag"
                                    value={newVehicle.vehicle_tag}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vehicle_serial"
                                    placeholder="VIN Number"
                                    value={newVehicle.vehicle_serial}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleAddVehicle}>Submit</button>
                                <button onClick={() => setShowform(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* Orders Section */}
                    <div className={styles.container}>
                        <div className={styles.title}>Orders</div>
                        <div>
                            <h2>Orders of {customer?.customer_first_name}</h2>
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <div key={index} className="order">
                                        <p>Order #{order.orderNumber}</p>
                                        <p>Date: {order.date}</p>
                                        <p>Status: {order.status}</p>
                                        <p>Total: ${order.totalAmount}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No orders found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CustomerProfile;
