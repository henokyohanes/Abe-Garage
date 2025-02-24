import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import customerService from "../../services/customer.service";
import orderService from "../../services/order.service";
import vehicleService from "../../services/vehicle.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
import styles from "./Customers.module.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);
      setError(false);

      try {
        const response = await customerService.fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError(true);
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
            const customerData = await customerService.fetchCustomerById(id);

            if (customerData.data.order_id) {
                await orderService.deleteOrder(customerData.data.order_id);
            }

            if (customerData.data.vehicle_id) {
                await vehicleService.deleteVehicle(customerData.data.vehicle_id);
            }
          } catch (err) {
            alert(err.message || "Failed to delete customer");
          }
          
          try {
            await customerService.deleteCustomer(id);
            setCustomers(customers.filter((customer) => customer.customer_id !== id));
          } catch (err) {
            alert(err.message || "Failed to delete customer");
          }
    }
  };

  const handleProfile = (id) => {
    navigate(`/customer-profile/${id}`);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  return (
    <Layout>
      <div className={`${styles.container} row g-0`}>
        <div className=" d-none d-xxl-block col-3">
          <AdminMenu />
        </div>
        <div className="d-block d-xxl-none">
          <AdminMenuMobile />
        </div>
        <div className="col-12 col-xxl-9">
          {!loading && !error ? (<div className={styles.customerList}>
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
            <div className={styles.tableContainer}>
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
                        <td>{formatDate(customer.customer_added_date)}</td>
                        <td>{customer.active_customer_status ? "Yes" : "No"}</td>
                        <td>
                          <button onClick={() => handleProfile(customer.customer_id)}>
                            <CgProfile />
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
          </div>) : error ? <NotFound /> : <Loader />}
        </div>

      </div>
    </Layout>
  );
};

export default Customers;