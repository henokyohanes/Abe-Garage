// Function to read the data from the user's local storage
const getAuth = async () => {
  try {
    
    // Read the data from the user's local storage
    const employee = JSON.parse(localStorage.getItem("employee"));
    // console.log(employee);
    if (employee && employee.sendBack.employee_token) {
      const decodedToken = decodeTokenPayload(employee.sendBack.employee_token);
      return {
        // ...employee,
        employee_token: employee.sendBack.employee_token,
        employee_role: decodedToken.employee_role,
        employee_id: decodedToken.employee_id,
        employee_username: decodedToken.employee_username,
        employee_first_name: decodedToken.employee_first_name,
        employee_last_name: decodedToken.employee_last_name,
        employee_email: decodedToken.employee_email,
        employee_phone: decodedToken.employee_phone,
        employee_profile_picture: decodedToken.employee_profile_picture,
      };
    }
    return {};
  } catch (error) {
    console.error("Error reading authentication data:", error);
    return {};
  }
};

// Function to decode the payload from the token
const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token payload:", error);
    return {};
  }
};

export default getAuth;