import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import getAuth from "./util/auth";

const PrivateAuthRoute = ({ roles, children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const employee = await getAuth(); // Get employee data
        if (employee?.employee_token) {
          setIsLogged(true); // User is logged in
          if (roles?.length > 0 && roles.includes(employee.employee_role)) {
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
  }, [roles]);

  if (isChecked) {
    if (!isLogged) {
      return <Navigate to="/login" />; // Redirect to login if not logged in
    }
    if (!isAuthorized) {
      return <Navigate to="/unauthorized" />; // Redirect to unauthorized page if not authorized
    }
  }

  return isChecked ? children : null; // Render children if checks pass
};

export default PrivateAuthRoute;
