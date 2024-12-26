import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import employeeService from "../../../services/employee.service";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import Layout from "../../../Layout/Layout";
import styles from "./Employees.module.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const response = await employeeService.fetchEmployees();
            console.log(response.data);
            setEmployees(response.data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );
        if (confirmDelete) {
            try {
                await employeeService.deleteEmployee(id);
                setEmployees(employees.filter((employee) => employee.id !== id));
            } catch (err) {
                alert(err.message || "Failed to delete employee");
            }
        }
    };

    const handleEdit = (id) => {
        console.log("Editing employee with id:", id);
        if (!id) {
            alert("Invalid employee ID");
            return;
        }
        navigate(`/edit-employee/${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className={`${styles.adminMenu} d-none d-lg-block col-2`}>
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
                <div className={`${styles.employeeList} col-12 col-lg-10`}>
                    <h2>Employees <span>____</span></h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Active</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Added Date</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={employee.id || index}>
                                    <td>{employee.active_employee ? "Yes" : "No"}</td>
                                    <td>{employee.employee_first_name}</td>
                                    <td>{employee.employee_last_name}</td>
                                    <td>{employee.employee_email}</td>
                                    <td>{employee.employee_phone}</td>
                                    <td>{employee.added_date.split("T")[0]}</td>
                                    <td>{employee.company_role_name}</td>
                                    <td>
                                        <button onClick={() => handleEdit(employee.employee_id)}><FaEdit /></button>
                                        <button onClick={() => handleDelete(employee.employee_id)}><MdDelete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeList;
