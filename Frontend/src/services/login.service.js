import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;
export const axiosImageURL = import.meta.env.VITE_API_URL;

// A function to register a new user
export const register = async (formData) => {
  try {
    const response = await axios.post(
      `${api_url}/api/customer/register`,
      formData,
      {headers: { "Content-Type": "application/json" }}
    );
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error.response?.data.message || "Unknown error occurred";
  }
};

// A function to send the login request to the server
export const logIn = async (formData) => {
  try {
    const response = await axios.post(
      `${api_url}/api/employee/login`,
      formData,
      {headers: { "Content-Type": "application/json" }}
    );
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      return { status: "fail", message: error.response.data.message };
    }else {
    console.error("Error logging in:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
    }
  }
};

// A function to log out the user
export const logOut = () => {
  localStorage.removeItem("employee");
};

export default { register, logIn, logOut };
