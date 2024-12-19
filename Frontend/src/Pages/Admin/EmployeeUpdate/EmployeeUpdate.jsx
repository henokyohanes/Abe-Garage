import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import employeeService from "../../../services/employees.service";
import StyleS from "./EmployeeUpdate.module.css";

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
            console.log(response.data);
            const employeeData = response.data.find(emp => emp.employee_id === parseInt(id));
            if (!employeeData) throw new Error("Employee not found.");
            setEmployee(employeeData);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch employee data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployee({
            ...employee,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await employeeService.updateEmployee(id, employee);
            setSuccess(true);
            setTimeout(() => navigate("/employees"), 2000);
        } catch (err) {
            setError("Failed to update employee. Please try again.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className={StyleS.updateSection}>
            <div className={StyleS.container}>
                <h2>Edit: {`${employee.employee_first_name} ${employee.employee_last_name}`}</h2>
                <p>Employee email: {employee.employee_email}</p>
                {success && (<p className={StyleS.successMessage}>Employee updated successfully!</p>)}
                <form onSubmit={handleSubmit} className={StyleS.form}>
                    <div className={StyleS.formGroup}>
                        <input type="text" name="firstName" value={employee.employee_first_name} onChange={handleChange} placeholder="First Name" required />
                    </div>
                    <div className={StyleS.formGroup}>
                        <input type="text" name="lastName" value={employee.employee_last_name} onChange={handleChange} placeholder="Last Name" required />
                    </div>
                    <div className={StyleS.formGroup}>
                        <input type="text" name="phone" value={employee.employee_phone} onChange={handleChange} placeholder="Phone Number" required />
                    </div>
                    <div className={StyleS.formGroup}>
                        <select name="role" value={employee.company_role_name} onChange={handleChange} className={StyleS.formControl} >
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className={StyleS.formGroup}>
                        <label>
                            <input type="checkbox" name="active" checked={employee.active_employee} onChange={handleChange} />
                            Is active employee
                        </label>
                    </div>
                    <div className={StyleS.formGroup}>
                        <button className={StyleS.submitButton} type="submit"> Update </button>
                    </div>
                </form>
                {error && <p className={StyleS.errorMessage}>{error}</p>}
            </div>
        </section>
    );
};

export default EmployeeUpdate;
