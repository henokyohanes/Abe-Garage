import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import employeeService from "../../../services/employee.service";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../../Components/AdminMenuMobile/AdminMenuMobile";
import Layout from "../../../Layout/Layout";
import styles from "./Employees.module.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [newOrdersRecipient, setNewOrdersRecipient] = useState("");
    const [showUpdateSection, setShowUpdateSection] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const itemsPerPage = 10;

    useEffect(() => {
        fetchEmployeesData();
    }, []);

    const fetchEmployeesData = async () => {
        try {
            const response = await employeeService.fetchEmployees();
            setEmployees(response.data);
        } catch (err) {
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        if (!id) {
            alert("Invalid employee ID");
            return;
        }
        navigate(`/edit-employee/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const response = await employeeService.fetchEmployeeById(id);
            const employee = response.data;
            setSelectedEmployee(employee);

            const confirmation = window.confirm(
                "Are you sure you want to delete this employee?"
            );
            if (confirmation) {

                if (employee.order_id) {
                    if (employee.employee_email === "admin@admin.com") {
                        alert("You cannot delete this employee.");
                        return;
                    }

                    const confirmation = window.confirm(
                        "Before deleting this employee, you must reassign orders recipient to another employee."
                    );

                    if (confirmation) {
                        setShowUpdateSection(true);
                    }
                } else {
                    await employeeService.deleteEmployee(id);
                    fetchEmployeesData();
                    alert("Employee deleted successfully.");
                }
            }
        } catch (err) {
            alert(err.message || "Failed to fetch employee.");
        }
    };

    useEffect(() => {
        const filterEmployees = employees.filter(
            (employee) =>
                (employee.company_role_id === 2 || employee.company_role_id === 3) &&
                employee.employee_id !== selectedEmployee?.employee_id
        );
        setFilteredEmployees(filterEmployees);
    }, [selectedEmployee, employees]);

    const handleUpdate = async () => {
        if (!newOrdersRecipient) {
            alert("Please select a new recipient.");
            return;
        }

        try {
            // Reassign the orders
            await employeeService.updateEmployeeOrders(
                selectedEmployee?.employee_id,
                newOrdersRecipient
            );

            // Now, delete the employee after successful reassignment
            await employeeService.deleteEmployee(selectedEmployee?.employee_id);
            alert("orders reassigned and employee deleted successfully.");

            // Refresh the employee data
            fetchEmployeesData();
            setShowUpdateSection(false);
        } catch (err) {
            alert(err.message || "Failed to update orders or delete employee.");
        }
    };


    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const displayedEmployees = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className="d-none d-lg-block col-2">
                    <AdminMenu />
                </div>
                <AdminMenuMobile />

                {!showUpdateSection && (
                    <div className={`${styles.employeeList} col-12 col-lg-10`}>
                        <h2>
                            Employees <span>____</span>
                        </h2>
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
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedEmployees.length > 0 ? (
                                    displayedEmployees.map((employee) => (
                                        <tr key={employee.employee_id}>
                                            <td>{employee.active_employee ? "Yes" : "No"}</td>
                                            <td>{employee.employee_first_name}</td>
                                            <td>{employee.employee_last_name}</td>
                                            <td>{employee.employee_email}</td>
                                            <td>{employee.employee_phone}</td>
                                            <td>{formatDate(employee.added_date)}</td>
                                            <td>{employee.company_role_name}</td>
                                            {isAdmin && (
                                                <td>
                                                    <button
                                                        onClick={() => handleEdit(employee.employee_id)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.employee_id)}
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No employees found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className={styles.pagination}>
                            <button
                                onClick={() => handlePageChange("prev")}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange("next")}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {showUpdateSection && (
                    <div className={`${styles.employeeList} col-12 col-lg-10`}>
                        <h2>
                            Update Orders Recipient <span>____</span>
                        </h2>
                        <p>
                            Reassign all orders associated with 
                            <strong>
                                {" "}{selectedEmployee?.employee_first_name}{" "}
                                {selectedEmployee?.employee_last_name}{" "}
                            </strong>
                            before deletion.
                        </p>
                        <div className={styles.newRecipient}>
                            <label>
                                Select New Recipient:
                            </label>
                            <select
                                id="newOrdersRecipient"
                                value={newOrdersRecipient}
                                onChange={(e) => setNewOrdersRecipient(e.target.value)}
                                className={styles.formControl}
                            >
                                <option value="" disabled>
                                    Select an employee
                                </option>
                                {filteredEmployees.map((employee) => (
                                    <option key={employee.employee_id} value={employee.employee_id}>
                                        {employee.employee_first_name}{" "}
                                        {employee.employee_last_name}
                                    </option>
                                ))}
                            </select>
                            <div onClick={handleUpdate} className={styles.button}>
                                Update
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default EmployeeList;
