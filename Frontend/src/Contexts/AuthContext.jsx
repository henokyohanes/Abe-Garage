import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
} from "react";
import getAuth from "../util/auth";

// Create a context object
const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const loggedInEmployee = await getAuth();
        if (loggedInEmployee?.employee_token) {
          setIsLogged(true);

          // Check if the employee is an admin
          if (loggedInEmployee.employee_role === 3) {
            setIsAdmin(true);
          }

          // Set the employee object
          setEmployee(loggedInEmployee);
        }
      } catch (error) {
        console.error("Error fetching authentication details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      isLogged,
      isAdmin,
      setIsAdmin,
      setIsLogged,
      employee,
      loading,
      employeeId: employee?.employee_id, // Add employee_id to the context value
    }),
    [isLogged, isAdmin, employee, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
