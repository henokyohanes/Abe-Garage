import React, {useState, useEffect, useContext, createContext, useMemo} from "react";
import getAuth from "../util/auth";

// Create a context object
const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Create a provider component
export const AuthProvider = ({ children }) => {

  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {

      // Fetch authentication details
      try {
        const loggedInUser = await getAuth();
        
        if (loggedInUser?.user_token) {
          setIsLogged(true);

          // Check if the employee is an admin
          if (loggedInUser.company_role_id === 3) {
            setIsAdmin(true);
          }

          // Check if the employee is a manager
          if (loggedInUser.company_role_id === 2) {
            setIsManager(true);
          }

          // check if the employee is an employee
          if (loggedInUser.company_role_id === 1) {
            setIsEmployee(true);
          }
          setUser(loggedInUser);
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
  const value = useMemo(() => ({
    isLogged,
    isAdmin,
    isManager,
    isEmployee,
    setIsAdmin,
    setIsLogged,
    user,
    setUser,
    loading,
    employeeId: user?.employee_id
  }),
    [isLogged, isAdmin, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};
