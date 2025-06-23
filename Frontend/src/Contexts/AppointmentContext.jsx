import { createContext, useContext, useState } from "react";

const AppointmentContext = createContext();

export const useAppointment = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        make: "",
        model: "",
        year: "",
        color: "",
        services: [],
        date: null,   // ✅ ADD THIS
        time: ""      // ✅ AND THIS
    });

    return (
        <AppointmentContext.Provider value={{ formData, setFormData }}>
            {children}
        </AppointmentContext.Provider>
    );
};