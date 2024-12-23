import React, { useState, useEffect } from "react";
import customerService from "../../services/customers.service";
import Layout from "../../Layout/Layout";
import { FaSearch } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customerService.fetchCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
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

  return (
    <Layout>
      <div className="customer-list">
        <h1>
          Customers <span>____</span>
        </h1>
        <div>
          <input
            type="text"
            placeholder="Search for a customer using first name, last name, email address or phone number"
            value={searchQuery}
            onChange={handleSearch}
          />
          <span>
            <FaSearch />
          </span>
        </div>
        <table>
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
                    <button onClick={() => handleEdit(employee.employee_id)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(employee.employee_id)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
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
    </Layout>
  );
};

export default Customers;