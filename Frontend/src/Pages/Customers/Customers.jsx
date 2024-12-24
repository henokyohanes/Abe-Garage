import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import customerService from "../../services/customers.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import styles from "./Customers.module.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customerService.fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
            setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!customer) return false;

    const query = searchQuery.toLowerCase();
    return (
      query === "" ||
      customer.customer_first_name?.toLowerCase().includes(query) ||
      customer.customer_last_name?.toLowerCase().includes(query) ||
      customer.customer_email?.toLowerCase().includes(query) ||
      customer.customer_phone_number?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const displayedCustomers = filteredCustomers.slice(
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (err) {
        alert(err.message || "Failed to delete customer");
      }
    }
  };

  const handleEdit = (id) => {
    console.log("Editing customer with id:", id);
    if (!id) {
      alert("Invalid customer ID");
      return;
    }
    navigate(`/edit-customer/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <Layout>
      <div className={`${styles.container} row g-0`}>
        <div className=" d-none d-lg-block col-2">
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
        <div className={`${styles.customerList} col-12 col-lg-10`}>
          <div className={styles.header}>
            <h2>
              Customers <span>____</span>
            </h2>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search for a customer by name, email or phone number"
                value={searchQuery}
                onChange={handleSearch}
              />
              <span>
                <FaSearch />
              </span>
            </div>
          </div>
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added Date</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCustomers.length > 0 ? (
                displayedCustomers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_id}</td>
                    <td>{customer.customer_first_name}</td>
                    <td>{customer.customer_last_name}</td>
                    <td>{customer.customer_email}</td>
                    <td>{customer.customer_phone_number}</td>
                    <td>{customer.customer_added_date.split("T")[0]}</td>
                    <td>{customer.active_customer_status ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={() => handleEdit(customer.customer_id)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(customer.customer_id)}>
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className={styles.noResults}>
                  <td colSpan="8">No customers matched your search</td>
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
      </div>
    </Layout>
  );
};

export default Customers;