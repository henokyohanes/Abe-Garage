import React, { useState, useEffect, useContext, createContext } from "react";
import getAuth from '../util/auth';

// Create a context object  
const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
}
// Create a provider component  
export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);

  const value = { isLogged, isAdmin, setIsAdmin, setIsLogged, employee };

  useEffect(() => {
    // Retrieve the logged in user from local storage
    const loggedInEmployee = getAuth();

    // console.log(loggedInEmployee);
    loggedInEmployee.then((response) => {

      // console.log(response);
      if (response.employee_token) {
        setIsLogged(true);
        
        // 3 is the employee_role for admin
        if (response.employee_role === 3) {
          setIsAdmin(true);
        }
        setEmployee(response);
      }
    });
  }, []);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

