import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaCar, FaTools } from 'react-icons/fa';
import { useAuth } from '../../../Contexts/AuthContext';
import appointmentservice from '../../../services/appointment.service';

const CustomerAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    console.log(user);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await appointmentservice.getAppointmentsByCustomerEmail(user.customer_email);   
                setAppointments(response.data);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user.customer_email) fetchAppointments();
    }, [user.customer_email]);

    if (loading) return <p>Loading appointments...</p>;
    if (appointments.length === 0) return <p>No appointments found.</p>;

    return (
        <div className="appointments-container">
            <h2>My Appointments</h2>
            {appointments.map((appt) => (
                <div key={appt.id} className="appointment-card">
                    <p><FaCalendarAlt /> Date: {new Date(appt.appointment_date).toLocaleDateString()}</p>
                    <p><FaClock /> Time: {appt.appointment_time}</p>
                    <p><FaCar /> Vehicle: {appt.vehicle_make} {appt.vehicle_model} ({appt.vehicle_year})</p>
                    <p><FaTools /> Services:</p>
                    <ul>
                        {appt.services?.length ? (
                            appt.services.map((s) => <li key={s.id}>{s.service_name}</li>)
                        ) : (
                            <li>No services listed.</li>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CustomerAppointments;