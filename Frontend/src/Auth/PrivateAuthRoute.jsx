import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import getAuth from "../util/auth";

const PrivateAuthRoute = ({ roles = [], children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const employee = await getAuth(); // Get employee data
        if (employee?.employee_token) {
          setIsLogged(true); // User is logged in
          // If roles are specified, check authorization
          if (roles.length === 0 || roles.includes(employee.employee_role)) {
            setIsAuthorized(true); // User is authorized
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      } finally {
        setIsChecked(true); // Mark authentication check as complete
      }
    };

    checkAuthentication();
  }, []); // Removed dependency on `roles` to avoid unnecessary re-checking

  if (!isChecked) {
    return null; // Show nothing until authentication is checked
  }

  if (!isLogged) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />; // Redirect to unauthorized page if not authorized
  }

  return children; // Render children if all checks pass
};

export default PrivateAuthRoute;
