import employeeService from "../services/employee.service";

// Function to read the data from the user's local storage
const getAuth = async () => {
  try {
    
    // Read the data from the user's local storage
    const stored = JSON.parse(localStorage.getItem("employee"));
    // console.log(employee);
    if (stored && stored.sendBack.employee_token) {
      const decodedToken = decodeTokenPayload(stored.sendBack.employee_token);
      const employee_id = decodedToken.employee_id;

      // Call the getEmployeeById method from the employee service
      const employee = await employeeService.fetchEmployeeById(employee_id);

      console.log(employee);

      // If the employee is not found
      if (!employee) throw new Error("Employee not found.");

      const employeeData = employee.data;

      console.log(employeeData);

      return {
        ...employeeData,
        employee_token: stored.sendBack.employee_token,
        employee_role: decodedToken.employee_role,
        employee_id: decodedToken.employee_id,
        employee_username: employeeData.employee_username,
        employee_first_name: employeeData.employee_first_name,
        employee_last_name: employeeData.employee_last_name,
        employee_email: employeeData  .employee_email,
        employee_phone: employeeData.employee_phone,
        employee_profile_picture: employeeData.employee_profile_picture,
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