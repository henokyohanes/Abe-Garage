import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHandPointUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import customerservice from "../../../services/customers.service";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import Layout from "../../../Layout/Layout";
import styles from "./NewOrder.module.css";

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
            console.log(response.data);
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
            const results = Object.fromEntries(
                Object.entries(customers).filter(
                    ([key, customer]) =>
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
        navigate("/admin/add-customer");
    };

    const handleSelectCustomer = (customerId) => {
        // navigate(`/customer/${customerId}/select-vehicle`);
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
                        <div className={styles.searchBar}>
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
                        </div>
                    </div>
                    <div className={styles.results}>
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
                                                    onClick={() => handleSelectCustomer(customer.id)}
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
                                No customers match your search.
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NewOrder;
