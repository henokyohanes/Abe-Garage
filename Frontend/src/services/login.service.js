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
  console.log(formData);
  try {
    const response = await axios.post(
      `${api_url}/api/user/login`,
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

// function to forget password
export const forgotPassword  = async (email) => {
  try {
    const response = await axios.post(
      `${api_url}/api/user/forgot-password`,
        { email },
      {headers: { "Content-Type": "application/json" }}
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

// function to reset password
export const resetPassword = async (token, newPassword) => {
  console.log(token, newPassword);
  try {
    const response = await axios.post(
      `${api_url}/api/user/reset-password/${token}`,
        { newPassword },
      {headers: { "Content-Type": "application/json" }}
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

// Function to check if a username is available
export const checkUsernameAvailability = async (username) => {
  console.log(username);
  try {
    const response = await axios.get(`${api_url}/api/user/check-username`, {
      params: { username },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking username:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

// -------------------- VERIFY OTP --------------------
export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(
      `${api_url}/api/user/verify-otp`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

// A function to log out the user
export const logOut = () => {
  localStorage.removeItem("user");
};

export default { register, logIn, forgotPassword, resetPassword, checkUsernameAvailability, verifyOTP, logOut };