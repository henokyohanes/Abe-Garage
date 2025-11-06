import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

// Helper function to retrieve authentication headers
const getAuthHeaders = () => {
    const storedToken = JSON.parse(localStorage.getItem("user"));
    const token = storedToken?.user_token;
    return {
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
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

// Function to fetch booked times for a specific date
export const getBookedTimesByDate = async (dateKey) => {
    console.log("dateKey", dateKey);
    try {
        const response = await axios.get(
            `${api_url}/api/appointments/booked-times`,
            {
                params: { date: dateKey },
            }
        );
        return response.data.bookedTimes || [];
    } catch (error) {
        console.error("Error fetching booked times:", error);
        return [];
    }
};

// Function to get appointments for a specific customer by email
export const getAppointmentsByCustomerEmail = async (customerEmail) => {
    try {
        const response = await axios.get(
            `${api_url}/api/appointments/by-email`,
            {
                params: { email: customerEmail },
                ...getAuthHeaders(),
            }
        );
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error.response?.data?.message || "Failed to fetch appointments";
    }
};

const appointmentService = {
    submitAppointment,
    getBookedTimesByDate, getAppointmentsByCustomerEmail
};

export default appointmentService;