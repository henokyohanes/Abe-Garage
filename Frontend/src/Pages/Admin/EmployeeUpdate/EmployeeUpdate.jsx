import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import employeeService from "../../../services/employees.service";
import styles from "./EmployeeUpdate.module.css";
import Layout from "../../../Layout/Layout";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";

const EmployeeUpdate = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({firstName: "", lastName: "", phone: "", role: "Employee",  active: false});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const response = await employeeService.fetchEmployees();
            const employeeData = response.data.find(employee => employee.employee_id === parseInt(id));
            if (!employeeData) throw new Error("Employee not found.");
            console.log(employeeData);
            setEmployee({
                firstName: employeeData.employee_first_name,
                lastName: employeeData.employee_last_name,
                email: employeeData.employee_email,
                phone: employeeData.employee_phone,
                role: employeeData.company_role_name,
                active: employeeData.active_employee
            });
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
        try {
            await employeeService.updateEmployee(id, {...employee,
                employee_first_name: employee.firstName,
                employee_last_name: employee.lastName,
                employee_email: employee.email,
                employee_phone: employee.phone,
                company_role_name: employee.role,
                active_employee: employee.active
            });
            setSuccess(true);
            setTimeout(() => navigate("/admin/employees"), 1000);
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
                    <h2>Edit: {`${employee.firstName} ${employee.lastName}`} <span>____</span></h2>
                    <div className={styles.formContainer}>
                        <h6>Employee email: <strong>{employee.email}</strong></h6>
                        {success && (<p className={styles.successMessage}>Employee updated successfully!</p>)}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="firstName" value={employee.firstName} onChange={handleChange} placeholder="First Name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="lastName" value={employee.lastName} onChange={handleChange} placeholder="Last Name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <input className={styles.formControl} type="text" name="phone" value={employee.phone} onChange={handleChange} placeholder="Phone Number" required />
                            </div>
                            <div className={styles.formGroup}>
                                <select name="role" value={employee.role} onChange={handleChange} className={styles.formControl} >
                                    <option value="Employee">Employee</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <input type="checkbox" name="active" checked={employee.active} onChange={handleChange} />
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
