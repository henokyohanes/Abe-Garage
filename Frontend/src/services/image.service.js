import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;
export const axiosImageURL = import.meta.env.VITE_API_URL;

// Helper function to retrieve authentication headers
const getAuthHeaders = () => {
    const storedToken = JSON.parse(localStorage.getItem("user"));
    const token = storedToken?.user_token;
    return {
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
        },
    };
};

// Function to upload an image
export const handleProfileImageUpdate = async (formData, user) => { 
    console.log(formData);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
        const response = await axios.post(
            `${api_url}/api/update-profile-image`, formData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error.response?.data?.message || "Failed to upload image";
    }
};