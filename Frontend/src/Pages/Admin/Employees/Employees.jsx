import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import employeeService from "../../../services/employees.service";
import styles from "./Employees.module.css";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import Layout from "../../../Layout/Layout";

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
            setEmployees(response.data);
        } catch (err) {
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
                        <Link to="/admin/order" className={styles.listGroupItem}>New order</Link>
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
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.active ? "Yes" : "No"}</td>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.addedDate}</td>
                                    <td>{employee.role}</td>
                                    <td>
                                        <button onClick={() => handleEdit(employee.id)}><FaEdit /></button>
                                        <button onClick={() => handleDelete(employee.id)}><MdDelete /></button>
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
