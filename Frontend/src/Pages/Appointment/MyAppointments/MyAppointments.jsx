import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCar, FaTools, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../../Contexts/AuthContext';
import appointmentservice from '../../../services/appointment.service';
import AdminMenu from '../../../Components/AdminMenu/AdminMenu';
import AdminMenuMobile from '../../../Components/AdminMenuMobile/AdminMenuMobile';
import NotFound from "../../../Components/NotFound/NotFound";
import Loader from "../../../Components/Loader/Loader";
import Layout from '../../../Layout/Layout';
import styles from './MyAppointments.module.css';

const CustomerAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    console.log(user);

    useEffect(() => {
        const fetchAppointments = async () => {

            setLoading(true);
            setError(false);

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

    // Calculate total pages
    const totalPages = Math.ceil(appointments.length / itemsPerPage);
    const displayedAppointments = appointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to handle page change
    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Layout>
            <div className={`${styles.customerAppointments} row g-0`}>
                <div className="d-none d-md-block col-3"><AdminMenu /></div>
                <div className="d-block d-md-none"><AdminMenuMobile /></div>
                <div className={`${styles.appintmentContainer} col-12 col-md-9`}>
                    {!loading && !error ? (<div>

                        <h2>My Appointments <span>____</span></h2>
                        {appointments.length === 0 && <p className={styles.noAppointments}>No appointments found.</p>}
                        {displayedAppointments.map((appt) => (
                            <div key={appt.appointment_id} className={styles.appointmentCard}>
                                <p><FaCalendarAlt /> {new Date(appt.appointment_date).toLocaleDateString()}</p>
                                <p><FaClock /> {appt.appointment_time}</p>
                                <p><FaCar /> {appt.vehicle_make} {appt.vehicle_model} ({appt.vehicle_year})</p>
                                <p><FaTools /> Services:</p>
                                <ul>
                                    {appt.services?.length ? (
                                        appt.services.map((s) => <li key={s.service_id}>{s.service_name}</li>)
                                    ) : (
                                        <li>No services listed.</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                        <Link to="/make-appointment/vehicle" className={styles.appointment}>
                            Make an Appointment <FaChevronRight />
                        </Link>

                        {/* Pagination */}
                        {appointments.length > 0 && <div className={styles.pagination}>
                            <button
                                onClick={() => handlePageChange("prev")}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange("next")}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>}

                    </div>
                    ) : error ? (
                        <NotFound />
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CustomerAppointments;