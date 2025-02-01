import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import employeeService from "../../../services/employee.service";
import Layout from "../../../Layout/Layout";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../../Components/AdminMenuMobile/AdminMenuMobile";
import styles from "./EmployeeUpdate.module.css";

const EmployeeUpdate = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({ employee_first_name: "", employee_last_name: "", employee_email: "", employee_phone: "", employee_role_name: "Employee", active_employee: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const response = await employeeService.fetchEmployeeById(parseInt(id));
            if (!response) throw new Error("Employee not found.");
            setEmployee(response.data);
            console.log(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch employee data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state before submission
        console.log(employee);
        try {
            const {
                employee_first_name,
                employee_last_name,
                employee_email,
                employee_phone,
                company_role_id,
                active_employee,
            } = employee;
            await employeeService.updateEmployee(id, {
                employee_first_name,
                employee_last_name,
                employee_email,
                employee_phone,
                company_role_id,
                active_employee,
            });
            setSuccess(true);
            setTimeout(() => navigate("/employees"), 1000);
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
                <div className="d-none d-md-block col-3">
                    <AdminMenu />
                </div>
                <div className="d-block d-md-none">
                    <AdminMenuMobile />
                </div>
                <div className={`${styles.container} col-12 col-md-9`}>
                    <h2>Edit: {`${employee.employee_first_name} ${employee.employee_last_name}`} <span>____</span></h2>
                    <div className={styles.formContainer}>
                        <h6>Employee email: <strong>{employee.employee_email}</strong></h6>
                        {success && (<p className={styles.successMessage}>Employee updated successfully!</p>)}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="employee_first_name" value={employee.employee_first_name} onChange={handleChange} placeholder="First Name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="employee_last_name" value={employee.employee_last_name} onChange={handleChange} placeholder="Last Name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="employee_phone" value={employee.employee_phone} onChange={handleChange} placeholder="Phone Number" required />
                            </div>
                            <div className={styles.formGroup}>
                                <select name="company_role_id" value={employee.company_role_id} onChange={handleChange} className={styles.formControl} >
                                    <option value="1">Employee</option>
                                    <option value="2">Manager</option>
                                    <option value="3">Admin</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <input type="checkbox" name="active_employee" checked={employee.active_employee} onChange={handleChange} />
                                    <div className={styles.checkmark}>Is active employee</div>
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

export default EmployeeUpdate;
