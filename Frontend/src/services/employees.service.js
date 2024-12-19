import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const storedToken = JSON.parse(localStorage.getItem("employee"));
    const token = storedToken?.employee_token;
    // console.log(token);
    return {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
};

// Function to fetch all employees
export const fetchEmployees = async () => {
    try {
        const response = await axios.get(
            `${api_url}/api/employees`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error.response?.data?.message || "Failed to fetch employees";
    }
};

// Function to delete an employee by ID
export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete(
            `${api_url}/api/employees/${id}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw error.response?.data?.message || "Failed to delete employee";
    }
};

// Function to update an employee (e.g., editing their details)
export const updateEmployee = async (id, updatedData) => {
    try {
        const response = await axios.put(
            `${api_url}/api/employees/${id}`,
            updatedData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error.response?.data?.message || "Failed to update employee";
    }
};

// Function to add a new employee
export const addEmployee = async (employeeData) => {
    try {
        const response = await axios.post(
            `${api_url}/api/employee`,
            employeeData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error adding employee:", error);
        throw error.response?.data?.error || "Failed to add employee";
    }
};

// Export the functions as a default object
const employeeService = {fetchEmployees, deleteEmployee, updateEmployee, addEmployee};

export default employeeService;
