import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import vehicleService from "../../services/vehicle.service";
import customerService from "../../services/customer.service";
import orderService from "../../services/order.service";
// import styles from "./CustomerProfile.module.css";

const CustomerProfile = () => {

    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showform, setShowform] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ make: "", model: "", year: "", licensePlate: "", vin: "" });

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
            setVehicles(vehicleData);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    // Fetch orders for the customer
    const fetchOrders = async () => {
        try {
            const orderData = await orderService.fetchCustomerOrders(parseInt(id));
            setOrders(orderData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Add a new vehicle using vehicleService
    const handleAddVehicle = async () => {
        try {
            await vehicleService.addVehicle(parseInt(id), newVehicle);
            setShowModal(false);
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
        <div className="customer-profile">

            {/* Info Section */}
            {customer ? (<div className="info">
                <div>Info</div>
                <div>
                    <h2>Customer: {customer.customer_first_name} {customer.customer_last_name}</h2>
                    <p>Email: {customer.customer_email}</p>
                    <p>Phone Number: {customer.customer_phone_number}</p>
                    <p>Active Customer: {customer.active_customer_status ? "Yes" : "No"}</p>
                    <p>Edit Customer Info <span>__</span></p>
                </div>
            </div>) : (<p>Loading customer data...</p>)}

            {/* Vehicles Section */}
            <div className="vehicles">
                <div>Cars</div>
                <div>
                    <h3>Vehicles of {customer?.name}</h3>
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle, index) => (
                            <div key={index} className="vehicle">
                                <p>
                                    {vehicle.make} {vehicle.model} ({vehicle.year})
                                </p>
                                <p>License Plate: {vehicle.licensePlate}</p>
                                <p>VIN: {vehicle.vin}</p>
                            </div>
                        ))
                    ) : (
                        <p>No vehicles found</p>
                    )}
                    <button onClick={() => setShowform(true)}>Add New Vehicle</button>

                    {/* vehicle form */}
                    {showform && (
                        <div className="modal">
                            <div className="modal-content">
                                <h3>Add New Vehicle</h3>
                                <input
                                    type="text"
                                    name="make"
                                    placeholder="Make"
                                    value={newVehicle.make}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="model"
                                    placeholder="Model"
                                    value={newVehicle.model}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="year"
                                    placeholder="Year"
                                    value={newVehicle.year}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="licensePlate"
                                    placeholder="License Plate"
                                    value={newVehicle.licensePlate}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="vin"
                                    placeholder="VIN"
                                    value={newVehicle.vin}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleAddVehicle}>Submit</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Orders Section */}
            <div className="orders">
                <div>Orders</div>
                <div>
                    <h3>Orders of {customer?.name}</h3>
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
    );
};

export default CustomerProfile;
