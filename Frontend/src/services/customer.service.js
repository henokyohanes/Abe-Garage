import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

// Helper function to retrieve authentication headers
const getAuthHeaders = () => {
    const storedToken = JSON.parse(localStorage.getItem("user"));
    const token = storedToken?.sendBack.user_token;
    return {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
};

// Function to fetch all customers
export const fetchCustomers = async () => {
    try {
        const response = await axios.get(
            `${api_url}/api/customers`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error.response?.data?.message || "Failed to fetch customers";
    }
};

// Function to fetch a customer by ID
export const fetchCustomerById = async (id) => {
    try {
        const response = await axios.get(
            `${api_url}/api/customer/${id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching customer:", error);
        throw error.response?.status || "Failed";
    }
};

// Function to add a new customer
export const addCustomer = async (customerData) => {
    try {
        const response = await axios.post(
            `${api_url}/api/add-customer`,
            customerData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error adding customer:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// Function to update a customer
export const updateCustomer = async (id, updatedData) => {
    try {
        const response = await axios.put(
            `${api_url}/api/update-customer/${id}`,
            updatedData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error updating customer:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// Function to delete a customer
export const deleteCustomer = async (id) => {
    try {
        const response = await axios.delete(
            `${api_url}/api/delete-customer/${id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting customer:", error);
        throw error.response?.data?.message || "Failed";
    }
};

// Function to submit an appointment
export const submitAppointment = async (appointmentData) => {
    console.log(appointmentData);
    try {
        const response = await axios.post(
            `${api_url}/api/appointments`,
            appointmentData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting appointment:", error);
        throw error.response?.data?.message || "Failed to submit appointment";
    }
};


const customerService = {fetchCustomers, fetchCustomerById, addCustomer, updateCustomer, deleteCustomer, submitAppointment};

export default customerService;
