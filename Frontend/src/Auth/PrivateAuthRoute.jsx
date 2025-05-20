import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import getAuth from "../util/auth";

const PrivateAuthRoute = ({ roles = [], children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const employee = await getAuth();
        if (employee?.employee_token) {
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      } finally {
        setIsChecked(true);
      }
    };

    checkAuthentication();
  }, []);

  // If not checked yet, show nothing
  if (!isChecked) {
    return null;
  }

  // If not logged in, redirect to login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Render children if all checks pass
  return children;
};

export default PrivateAuthRoute;
