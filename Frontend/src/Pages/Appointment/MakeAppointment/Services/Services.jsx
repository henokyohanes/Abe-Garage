import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaWrench } from 'react-icons/fa';
import Layout from '../../../../Layout/Layout';
import style from "./Services.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext';
import serviceService from '../../../../services/service.service';

function Services() {
    const navigate = useNavigate();
    const { formData, setFormData } = useAppointment();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedServices, setSelectedServices] = useState(formData.services || []);

    useEffect(() => {
        const fetchAllServices = async () => {
            setLoading(true);
            setError(false);
            try {
                const fetchedServices = await serviceService.getAllServices();
                console.log("Fetched services:", fetchedServices);
                setServices(fetchedServices);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAllServices();
    }, []);

    useEffect(() => {
        setSelectedServices(formData.services || []);
    }, [formData.services]);

    const toggleService = (service) => {
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.service_id === service.service_id);
            if (exists) {
                return prev.filter((s) => s.service_id !== service.service_id);
            } else {
                return [
                    ...prev,
                    {
                        service_id: service.service_id,
                        service_name: service.service_name,
                    },
                ];
            }
        });
    };

    const handleNext = () => {
        setFormData(prev => ({ ...prev, services: selectedServices }));
        navigate("/make-appointment/appointment");
    };

    const handleBack = () => {
        setFormData(prev => ({ ...prev, services: selectedServices }));
        navigate("/make-appointment/vehicle");
    };

    console.log(services);
    console.log(selectedServices);

    return (
        <Layout>
            <div className={style.customerContainer}>
                <div className={style.makeAppointmentContainer}>
                    <h2>Schedule Appointment <span>____</span></h2>
                    <div className={style.makeAppointment}>
                        <ul>
                            <li className={style.completed}><Link to="/make-appointment/customer">Customer</Link> <FaChevronRight className={style.arrow} /></li>
                            <li className={style.completed}><Link to="/make-appointment/vehicle">Vehicle</Link> <FaChevronRight className={style.arrow} /></li>
                            <li className={style.completed}><div>Services</div> <FaChevronRight className={style.arrow} /></li>
                            <li className={style.completed}><div>Appointment</div> <FaChevronRight className={style.arrow} /></li>
                            <li className={style.completed}><div>Review</div></li>
                        </ul>
                    </div>
                    <div className={style.tittle}><FaWrench /> Choose Services</div>
                    <p>Select the services you need by checking the boxes.</p>

                    {loading && <p>Loading services...</p>}
                    {error && <p className="text-danger">Failed to load services. Please try again later.</p>}

                    <div className={`${style.servicesContainer} row g-0`}>
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`col-12 col-sm-11 col-md-10 col-lg-6 ${index % 2 === 0 ? 'pe-lg-2' : 'ps-lg-2'} col-xxl-5`}
                            >
                                <div className={style.service}>
                                    <input
                                        id={`service-${index}`}
                                        type="checkbox"
                                        checked={selectedServices.some(s => s.service_id === service.service_id)}
                                        onChange={() => toggleService(service)}
                                    />
                                    <label htmlFor={`service-${index}`}>
                                        <h3>{service.service_name}</h3>
                                        <p>{service.service_description}</p>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={style.buttonsContainer}>
                        <button onClick={handleBack} className={style.previousButton}>
                            <FaChevronLeft /> Back to Vehicle
                        </button>
                        <button onClick={handleNext} className={style.nextButton}>
                            Continue to Appointment <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Services;