import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCar, FaTools, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../../Contexts/AuthContext';
import appointmentservice from '../../../services/appointment.service';
import AdminMenu from '../../../Components/AdminMenu/AdminMenu';
import AdminMenuMobile from '../../../Components/AdminMenuMobile/AdminMenuMobile';
import Layout from '../../../Layout/Layout';
import styles from './MyAppointments.module.css';

const CustomerAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    console.log(user);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await appointmentservice.getAppointmentsByCustomerEmail(user.customer_email);
                console.log("response", response);
                setAppointments(response);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user?.customer_email) fetchAppointments();
    }, [authLoading, user?.customer_email]);

    console.log("appointments", appointments);
    return (
        <Layout>
            <div className={`${styles.customerAppointments} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className={`${styles.appintmentContainer} col-12 col-md-9`}>
                    <h2>My Appointments <span>____</span></h2>
                    {appointments.length === 0 && <p className={styles.noAppointments}>No appointments found.</p>}
                    {appointments.map((appt) => (
                        <div key={appt.appointment_id} className={styles.appointmentCard}>
                            <p><FaCalendarAlt /> {new Date(appt.appointment_date).toLocaleDateString()}</p>
                            <p><FaClock /> {appt.appointment_time}</p>
                            <p><FaCar /> {appt.vehicle_make} {appt.vehicle_model} ({appt.vehicle_year})</p>
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
                    <Link to="/make-appointment/vehicle" className={styles.appointment}>
                        Make an Appointment <FaChevronRight />
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default CustomerAppointments;