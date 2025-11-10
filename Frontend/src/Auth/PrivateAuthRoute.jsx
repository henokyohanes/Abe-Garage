// import React, { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import getAuth from "../util/auth";

// const PrivateAuthRoute = ({ roles = [], children }) => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [isLogged, setIsLogged] = useState(false);

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       try {
//         const user = await getAuth();
//         if (user?.user_token) {
//           setIsLogged(true);
//         }
//       } catch (error) {
//         console.error("Error during authentication check:", error);
//       } finally {
//         setIsChecked(true);
//       }
//     };

//     checkAuthentication();
//   }, []);

//   // If not checked yet, show nothing
//   if (!isChecked) {
//     return null;
//   }

//   // If not logged in, redirect to login
//   if (!isLogged) {
//     return <Navigate to="/login" replace />;
//   }

//   // Render children if all checks pass
//   return children;
// };

// export default PrivateAuthRoute;


import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import getAuth from "../util/auth";

const PrivateAuthRoute = ({ roles = [], children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await getAuth();
        console.log("user auth", user);
        if (user?.user_token) {
          setIsLogged(true);
          setUserRole(user.user_role); // 👈 use user_role
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
      } finally {
        setIsChecked(true);
      }
    };

    checkAuthentication();
  }, []);

  // Show nothing or loader while checking
  if (!isChecked) {
    return null; // or <div>Loading...</div>
  }

  // If not logged in, redirect to auth
  if (!isLogged) {
    return <Navigate to="/auth" replace />;
  }

  // If roles are defined and user doesn’t match, redirect to dashboard/home
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default PrivateAuthRoute;