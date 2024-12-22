import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PiHandPointingLight } from "react-icons/pi";
import customerservice from "../../../services/customers.service";
import Layout from "../../../Layout/Layout";
import Styles from "./NewOrder.module.css";

const NewOrder = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (!customers || Object.keys(customers).length === 0) {
            setFilteredCustomers({}); 
            return;
        }

        if (term === "") {
            setFilteredCustomers(customers);
        } else {
            const results = Object.fromEntries(
                Object.entries(customers).filter(([key, customer]) =>
                    customer.customer_first_name?.toLowerCase().includes(term) ||
                    customer.customer_last_name?.toLowerCase().includes(term) ||
                    customer.customer_email?.toLowerCase().includes(term) ||
                    customer.customer_phone_number?.includes(term)
                )
            );
            setFilteredCustomers(results);
        }
    };

    const handleAddCustomer = () => {
        navigate("/add-customer");
    };

    const handleSelectCustomer = (customerId) => {
        // navigate(`/customer/${customerId}/select-vehicle`);
    };

    if (loading) return <p>Loading customers...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Layout>
            <section className={Styles.newOrderPage}>
                <div className={Styles.header}>
                    <h2>Create a New Order</h2>
                    <div className={Styles.searchBar}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search for a customer by name, email, or phone number"
                        />
                        <button onClick={handleAddCustomer} className={Styles.addButton}>
                            Add New Customer
                        </button>
                    </div>
                </div>
                <div className={Styles.results}>
                    {Object.keys(filteredCustomers).length > 0 ? (
                        <table className={Styles.customerTable}>
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
                                                onClick={() => handleSelectCustomer(customer.id)}
                                                className={Styles.selectButton}
                                            >
                                                <PiHandPointingLight />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className={Styles.noResults}>No customers match your search.</p>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default NewOrder;
