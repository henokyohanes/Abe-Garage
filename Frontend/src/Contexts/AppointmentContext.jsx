// import { createContext, useContext, useState } from "react";

// const AppointmentContext = createContext();

// export const useAppointment = () => useContext(AppointmentContext);

// export const AppointmentProvider = ({ children }) => {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         make: "",
//         model: "",
//         year: "",
//         color: "",
//         services: [],
//         date: null,
//         time: "",
//     });

//     const clearFormData = () => {
//         setFormData({
//             firstName: "",
//             lastName: "",
//             email: "",
//             phone: "",
//             make: "",
//             model: "",
//             year: "",
//             color: "",
//             services: [],
//             date: null,
//             time: "",
//         });
//     };

//     return (
//         <AppointmentContext.Provider
//             value={{ formData, setFormData, clearFormData }}
//         >
//             {children}
//         </AppointmentContext.Provider>
//     );
// };



import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AppointmentContext = createContext();
export const useAppointment = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const { isLogged, user } = useAuth();

  const defaultData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    color: "",
    services: [],
    date: null,
    time: "",
  };

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("appointmentFormData");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const clearFormData = () => {
    localStorage.removeItem("appointmentFormData");
    setFormData(defaultData);
    console.log("formData", formData);
  };

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("appointmentFormData", JSON.stringify(formData));
  }, [formData]);

  // Autofill customer data from logged-in user (if not already filled)
  useEffect(() => {
    if (isLogged && user) {
      const filledData = {
        firstName: user.first_name || user.customer_first_name || "",
        lastName: user.last_name || user.customer_last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      };

      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || filledData.firstName,
        lastName: prev.lastName || filledData.lastName,
        email: prev.email || filledData.email,
        phone: prev.phone || filledData.phone,
      }));
    }
  }, [isLogged, user]);

  return (
    <AppointmentContext.Provider
      value={{ formData, setFormData, clearFormData }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

