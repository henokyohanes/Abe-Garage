import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import customerService from "../../services/customer.service";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import styles from "./AddCustomer.module.css";

const AddCustomer = () => {

    const [formData, setFormData] = useState({
        customer_first_name: "",
        customer_last_name: "",
        customer_email: "",
        customer_phone_number: "",
        active_customer_status: 0,
    });
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get("redirect") || "/customers";

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        });
    };

    // Validate form
    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.customer_email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.customer_email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        // Name validation
        const nameRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
        if (!formData.customer_first_name) {
            newErrors.first_name = "First name is required";
            isValid = false;
        } else if (!nameRegex.test(formData.customer_first_name)) {
            newErrors.first_name = "Invalid first name format";
            isValid = false;
        }

        if (!formData.customer_last_name) {
            newErrors.last_name = "Last name is required";
            isValid = false;
        } else if (!nameRegex.test(formData.customer_last_name)) {
            newErrors.last_name = "Invalid last name format";
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
        if (!formData.customer_phone_number) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.customer_phone_number)) {
            newErrors.phone = "Phone number must be 10 digits";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Generate the customer hash
    const generateCustomerHash = () => {
        const dataToHash =
            formData.customer_first_name +
            formData.customer_last_name +
            formData.customer_email;
        return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        // Generate the customer hash
        const customerHash = generateCustomerHash();
        
        const formDataWithHash = {
            ...formData,
            customer_hash: customerHash,
        };
        
        setLoading(true);
        setError(false);

        // Add the customer
        try {
            const response = await customerService.addCustomer(formDataWithHash);
                Swal.fire({
                    title: "Success!",
                    html: "Customer added successfully!",
                    icon: "success",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.successTitle,
                        htmlContainer: styles.text,
                    },
                });
                setTimeout(() => {window.location.href = redirectUrl}, 1000);
        } catch (error) {
            console.error("Error:", error);
            if (error === "Customer already exists") {
                Swal.fire({
                    title: "Error!",
                    html: "Customer already exists with this email!",
                    icon: "error",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.errorTitle,
                        htmlContainer: styles.text,
                    },
                });
            } else if (error === "Failed to create customer") {
                Swal.fire({
                    title: "Error!",
                    html: "Failed to add customer. Please try again!",
                    icon: "error",
                    customClass: {
                        popup: styles.popup,
                        confirmButton: styles.confirmButton,
                        icon: styles.icon,
                        title: styles.errorTitle,
                        htmlContainer: styles.text,
                    },
                });
            } else {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={`${styles.background} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className="col-12 col-md-9">
                    {!loading && !error ? (<div>
                        <div className={styles.container}>
                            <h2>Add a New Customer <span>____</span></h2>
                            <div className={styles.formContainer}>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.formGroupContainer}>
                                        <div>
                                            {errors.first_name && (
                                                <div className={styles.error}>{errors.first_name}</div>
                                            )}
                                            <input
                                                type="text"
                                                name="customer_first_name"
                                                placeholder="Customer first name *"
                                                value={formData.customer_first_name}
                                                onChange={handleInputChange}
                                                className={styles.formControl}
                                            />
                                        </div>
                                        <div>
                                            {errors.last_name && (
                                                <div className={styles.error}>{errors.last_name}</div>
                                            )}
                                            <input
                                                type="text"
                                                name="customer_last_name"
                                                placeholder="Customer last name *"
                                                value={formData.customer_last_name}
                                                onChange={handleInputChange}
                                                className={styles.formControl}
                                            />
                                        </div>
                                        <div>
                                            {errors.email && (
                                                <div className={styles.error}>{errors.email}</div>
                                            )}
                                            <input
                                                type="email"
                                                name="customer_email"
                                                placeholder="Customer email *"
                                                value={formData.customer_email}
                                                onChange={handleInputChange}
                                                className={styles.formControl}
                                            />
                                        </div>
                                        <div>
                                            {errors.phone && (
                                                <div className={styles.error}>{errors.phone}</div>
                                            )}
                                            <input
                                                type="text"
                                                name="customer_phone_number"
                                                placeholder="Customer phone (555) 555-5555 *"
                                                value={formData.customer_phone_number}
                                                onChange={handleInputChange}
                                                className={styles.formControl}
                                            />
                                        </div>
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
                    </div>) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default AddCustomer;

