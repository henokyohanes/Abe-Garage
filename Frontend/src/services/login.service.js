import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

// A function to send the login request to the server
export const logIn = async (formData) => {
  try {
    const response = await axios.post(
      `${api_url}/api/employee/login`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// A function to log out the user
export const logOut = () => {
  localStorage.removeItem("employee");
};

// Export the functions
export default {
  logIn,
  logOut,
};
