import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import customerService from "../../services/customers.service";
import styles from "./AddCustomer.module.css";

const AddCustomer = () => {
    const [formData, setFormData] = useState({
        customer_first_name: "",
        customer_last_name: "",
        customer_email: "",
        customer_phone_number: "",
        active_customer_status: 0,
    });
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.customer_first_name.trim())
            errors.customer_first_name = "First name is required.";
        if (!formData.customer_last_name.trim())
            errors.customer_last_name = "Last name is required.";
        if (
            !formData.customer_email.trim() ||
            !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.customer_email)
        )
            errors.customer_email = "Valid email is required.";
        if (
            !formData.customer_phone_number.trim() ||
            !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.customer_phone_number)
        )
            errors.customer_phone_number =
                "Phone must be in the format (555) 555-5555.";

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    const generateCustomerHash = () => {
        const dataToHash =
            formData.customer_first_name +
            formData.customer_last_name +
            formData.customer_email;
        return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Generate the customer hash
        const customerHash = generateCustomerHash();

        const formDataWithHash = {
            ...formData,
            customer_hash: customerHash,
        };

        try {
            const response = await customerService.addCustomer(formDataWithHash);
            if (response.status === "success") {
                alert("Customer added successfully!");
                // navigate("/customer-list");
            } else {
                alert("Failed to add customer. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    };

    return (
        <Layout>
            <div className={`${styles.background} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className="col-8">
                    <div className={styles.container}>
                        <h2>Add a New Customer <span>____</span></h2>
                        <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroupContainer}>
                            <input
                                type="text"
                                name="customer_first_name"
                                placeholder="Customer first name"
                                value={formData.customer_first_name}
                                onChange={handleInputChange}
                                className={styles.formControl}
                            />
                            {error.customer_first_name && (
                                <p className={styles.error}>{error.customer_first_name}</p>
                            )}

                            <input
                                type="text"
                                name="customer_last_name"
                                placeholder="Customer last name"
                                value={formData.customer_last_name}
                                onChange={handleInputChange}
                                className={styles.formControl}
                            />
                            {error.customer_last_name && (
                                <p className={styles.error}>{error.customer_last_name}</p>
                            )}

                            <input
                                type="email"
                                name="customer_email"
                                placeholder="Customer email"
                                value={formData.customer_email}
                                onChange={handleInputChange}
                                className={styles.formControl}
                            />
                            {error.customer_email && (
                                <p className={styles.error}>{error.customer_email}</p>
                            )}

                            <input
                                type="text"
                                name="customer_phone_number"
                                placeholder="Customer phone (555) 555-5555"
                                value={formData.customer_phone_number}
                                onChange={handleInputChange}
                                className={styles.formControl}
                            />
                            {error.customer_phone_number && (
                                <p className={styles.error}>{error.customer_phone_number}</p>
                            )}

                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    name="active_customer_status"
                                    checked={formData.active_customer_status === 1}
                                    onChange={handleInputChange}
                                />
                                <div>Active Status</div>
                            </label>

                            <button type="submit" className={styles.submitButton}>
                                ADD CUSTOMER
                            </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddCustomer;

