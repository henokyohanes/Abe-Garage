import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import { Link } from "react-router-dom";
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
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAdmin } = useAuth();
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeesData();
    }, []);

    const fetchEmployeesData = async () => {
        try {
            const response = await employeeService.fetchEmployees();
            setEmployees(response.data);
        } catch (err) {
            console.error(err);
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

    const totalPages = Math.ceil(employees.length / itemsPerPage);
    const displayedEmployees = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

    
    const handleDelete = async (id) => {
        try {
            const response = await employeeService.fetchEmployeeById(id);
            const employee = response.data;
            setSelectedEmployee(response.data);
            
            if (employee.company_role_id !== 1) {
                if (employee.employee_email === "admin@admin.com") {
                    alert("You cannot delete this employee");
                    return;
                } else {
                    const confirmation = window.confirm("before deleting this employee, you have to update orders associated with this employee first");
                    if (confirmation) {
                        
                        setShow(true);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to fetch employee");
            return;
        }
    };
    
    useEffect(() => {
        const filterEmployees = employees.filter(
            (employee) =>
                (employee.company_role_id === 2 ||
                    employee.company_role_id === 3) &&
                    employee.employee_id !== selectedEmployee?.employee_id
                );
                setFilteredEmployees(filterEmployees);
            }, [selectedEmployee, employees]);
            
            const handleUpdate = () => {
                if (!newOrdersRecipient) {
                    alert("Please select a new recipient");
                    return;
                }
                
                // Perform further actions with newOrdersRecipient
                console.log("Selected new recipient ID:", newOrdersRecipient);
                
            };
            
            const updateEmployeeForOrders = async () => {
                try {
                    const response = await employeeService.updateEmployeeOrders(

                      selectedEmployee?.employee_id,
                      newOrdersRecipient
                    );
                    // fetchEmployeesData();
                    // setShow(false);
                } catch (err) {
                    console.error(err);
                    alert(err.message || "Failed to update employee");
                }
            };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            <div className={`${styles.container} row g-0`}>
                <div className="d-none d-lg-block col-2">
                    <AdminMenu />
                </div>
                <AdminMenuMobile />
                {/* <div className={`${styles.adminMenuContainer} d-block d-lg-none`}>
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
                </div> */}
                {!show && <div className={`${styles.employeeList} col-12 col-lg-10`}>
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
                                        {isAdmin && <td>
                                            <button onClick={() => handleEdit(employee.employee_id)}><FaEdit /></button>
                                            <button onClick={() => handleDelete(employee.employee_id)}><MdDelete /></button>
                                        </td>}
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
                </div>}
                {show && <div className={`${styles.employeeList} col-12 col-lg-10`}>
                    <h2>Update Orders Recipient Employee <span>____</span></h2>
                    <p>update all orders associated to this employee before deleting the employee by selecting new orders recipient employee.</p>
                    <p><strong>Orders Recipient Employee:</strong> {selectedEmployee.employee_first_name} {selectedEmployee.employee_last_name}</p>
                    <div className={styles.formGroup}>
                        <strong>New Orders Recipient Employee: </strong>
                        {/* <select name="company_role_id" value={selectedEmployee.company_role_id} onChange={handleChange} className={styles.formControl} >
                            <option value="1">Employee</option>
                            <option value="2">Manager</option>
                            <option value="3">Admin</option>
                        </select> */}
                        <select
                            name="newOrdersRecipient"
                            value={newOrdersRecipient}
                            onChange={(e) => setNewOrdersRecipient(e.target.value)}
                            className={styles.formControl}
                        >
                            <option value="" disabled>
                                Select an employee
                            </option>
                            {filteredEmployees.map((employee) => (
                                <option key={employee.employee_id} value={employee.employee_id}>
                                    {employee.employee_first_name} {employee.employee_last_name}
                                </option>
                            ))}
                        </select>

                        <div><button onClick={handleUpdate} className={styles.button}>Update</button></div>

                    </div>
                </div>}
            </div>
        </Layout>
    );
};

export default EmployeeList;
