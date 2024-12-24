import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import customerService from "../../../services/customers.service";
import Layout from "../../../Layout/Layout";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import styles from "./CustomerUpdate.module.css";

const CustomerUpdate = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState({customer_first_name: "", customer_last_name: "", customer_phone_number: "", active_customer_status: false});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const fetchCustomerData = async () => {
        try {
            const response = await customerService.fetchCustomerById(parseInt(id));
            if (!response) throw new Error("Customer not found.");
            console.log(response.data);
            setCustomer(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch employee data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await customerService.updateCustomer(id, {...customer,
                customer_first_name ,
                customer_last_name,
                customer_phone_number,
                active_customer_status
            });
            setSuccess(true);
            setTimeout(() => navigate("/admin/customers"), 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to update employee. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <section className={`${styles.updateSection} row g-0`}>
                <div className="col-3">
                    <AdminMenu />
                </div>
                <div className={`${styles.container} col-8`}>
                    <h2>Edit: {`${customer.customer_first_name} ${customer.customer_last_name}`} <span>____</span></h2>
                    <div className={styles.formContainer}>
                        <h6>Customer email: <strong>{customer.customer_email}</strong></h6>
                        {success && (<p className={styles.successMessage}>Employee updated successfully!</p>)}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="customer_first_name" value={customer.customer_first_name} onChange={handleChange} placeholder="First Name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="customer_last_name" value={customer.customer_last_name} onChange={handleChange} placeholder="Last Name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="customer_phone_number" value={customer.customer_phone_number} onChange={handleChange} placeholder="Phone Number" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <input type="checkbox" name="active_customer_status" checked={customer.active_customer_status} onChange={handleChange} />
                                    <div className={styles.checkmark}>Is active customer</div>
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <button className={styles.updateButton} type="submit"> Update </button>
                            </div>
                        </form>
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>
            </section>
        </Layout>
    );
};

export default CustomerUpdate;
