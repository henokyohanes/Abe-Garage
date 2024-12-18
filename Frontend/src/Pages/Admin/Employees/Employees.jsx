import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import employeeService from "../../../services/employees.service";
import StyleS from "./Employees.module.css";

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
        <div className={StyleS.employeeList}>
            <h2>Employees</h2>
            <table className={StyleS.table}>
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
    );
};

export default EmployeeList;
