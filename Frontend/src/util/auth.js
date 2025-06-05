import employeeService from "../services/employee.service";
import customerService from "../services/customer.service";

// Function to read the data from the user's local storage
const getAuth = async () => {
  try {
    
    // Read the data from the user's local storage
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.sendBack.user_token) {
      const decodedToken = decodeTokenPayload(stored.sendBack.user_token);
      const employee_id = stored?.userInfo?.employee_id;
      const customer_id = stored?.userInfo?.customer_id;
      
      // Call the getEmployeeById method from the employee service
      let employee = null;
      let customer = null;

      if (employee_id) {   
        employee = await employeeService.fetchEmployeeById(employee_id);
        if (!employee) throw new Error("Employee not found.");
      }
      
      if (customer_id) {
        customer = await customerService.fetchCustomerById(customer_id);
        if (!customer) throw new Error("Customer not found.");
      }

      // If the employee is not found
      
      const userData = (employee && employee.data) || (customer && customer.data);

      return {
        ...userData,
        user_token: stored.sendBack.user_token,
        user_role: userData.employee_role || null,
        user_id: userData.employee_id || userData.customer_id,
        user_name: userData.employee_username || userData.customer_username,
        first_name: userData.employee_first_name || userData.customer_first_name,
        last_name: userData.employee_last_name || userData.customer_last_name,
        email: userData.employee_email || userData.customer_email,
        phone: userData.employee_phone || userData.customer_phone_number,
        profile_picture: userData.employee_profile_picture || userData.customer_profile_picture,
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