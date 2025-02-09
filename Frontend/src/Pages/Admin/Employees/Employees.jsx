import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import employeeService from "../../../services/employee.service";
import AdminMenu from "../../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../../Components/NotFound/NotFound";
import Loader from "../../../Components/Loader/Loader";
import Layout from "../../../Layout/Layout";
import styles from "./Employees.module.css";
import { use } from "react";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [newOrdersRecipient, setNewOrdersRecipient] = useState("");
    const [showUpdateSection, setShowUpdateSection] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const itemsPerPage = 10;

    const fetchEmployeesData = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await employeeService.fetchEmployees();
            setEmployees(response.data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesData();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const displayedEmployees = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEdit = (id) => {
        if (!id) {
            Swal.fire("Error", "Invalid employee ID", "error");
            return;
        }
        navigate(`/edit-employee/${id}`);
    };

const handleDelete = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",    
        customClass: {
            confirmButton: styles.confirmButton,
            cancelButton: styles.cancelButton,
            icon: styles.icon,
            title: styles.title,
            text: styles.text,
        }
    })
    setLoading(true);
    setError(false);
    
    try {
        const { data: employee } = await employeeService.fetchEmployeeById(id);
        setSelectedEmployee(employee);
        
        if (employee.order_id) {
            if (employee.employee_email === "admin@admin.com") {
                alert("You cannot delete this employee.");
                setLoading(false);
                return;
            }
            
            if (window.confirm(
                "Before deleting this employee, you must reassign orders recipient to another employee."
            )) {
                setShowUpdateSection(true);
                setLoading(false);
            }
        } else {
        await employeeService.deleteEmployee(id);
        setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.employee_id !== id));
        alert("Employee deleted successfully.");
        setLoading(false);
        }
        
    } catch (err) {
        console.error(err);
        setError(true);
    } finally {
        setLoading(false);
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


    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className="d-none d-xxl-block col-2">
                    <AdminMenu />
                </div>
                <div className="d-block d-xxl-none">
                    <AdminMenuMobile />
                </div>
                <div className="col-12 col-xxl-10">
                {!loading && !error ? (<div>
                {!showUpdateSection && (
                    <div className={styles.employeeList}>
                        <h2>
                            Employees <span>____</span>
                        </h2>
                        <div className={styles.tableContainer}>
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
                        </div>
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
                    <div className={styles.employeeList}>
                        <h2>
                            Update Orders Recipient <span>____</span>
                        </h2>
                        <p>
                            Please reassign all orders associated with 
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
                )}</div>) : error ? <NotFound /> : <Loader />}
                </div>
            </div>
        </Layout>
    );
};

export default EmployeeList;
