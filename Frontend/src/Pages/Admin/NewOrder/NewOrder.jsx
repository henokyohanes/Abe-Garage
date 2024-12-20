import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customerservice from "../../../services/customers.service";
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
            const response = customerservice.fetchCustomers();
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

        if (term === "") {
            setFilteredCustomers(customers);
        } else {
            const results = customers.filter(
                (customer) =>
                    customer.firstName.toLowerCase().includes(term) ||
                    customer.lastName.toLowerCase().includes(term) ||
                    customer.email.toLowerCase().includes(term) ||
                    customer.phone.includes(term)
            );
            setFilteredCustomers(results);
        }
    };

    const handleAddCustomer = () => {
        navigate("/add-customer");
    };

    const handleSelectCustomer = (customerId) => {
        navigate(`/customer/${customerId}/select-vehicle`);
    };

    if (loading) return <p>Loading customers...</p>;
    if (error) return <p>{error}</p>;

    return (
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
                {filteredCustomers?.length > 0 ? (
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
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.firstName}</td>
                                    <td>{customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>
                                        <button
                                            onClick={() => handleSelectCustomer(customer.id)}
                                            className={Styles.selectButton}
                                        >
                                            Select
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
    );
};

export default NewOrder;
