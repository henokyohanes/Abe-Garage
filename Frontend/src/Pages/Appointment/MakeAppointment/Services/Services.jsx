import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaWrench } from 'react-icons/fa';
import Layout from '../../../../Layout/Layout';
import style from "./Services.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext'; // ✅ import context

function Services() {
    const navigate = useNavigate();
    const { formData, setFormData } = useAppointment(); // ✅ use context

    const servicesList = [
        "Oil change", "Spark Plug Replacement", "Fuel Cap Tightening", "Oxygen Sensor Replacement",
        "Brake Work", "Tire Repairs and Changes", "The Ignition System", "Programming the Camera Software",
        "Engine Repair", "Transmission Repair", "AC System Service", "Battery Replacement"
    ];

    const serviceDescriptions = {
        "Oil change": "Every 5,000 kilometers or so, you need to change the oil in your car to keep your engine in the best possible shape.",
        "Spark Plug Replacement": "Spark plugs are a small part that can cause huge problems. Their job is to ignite the fuel in your engine, helping it start.",
        "Fuel Cap Tightening": "Loose fuel caps are a main reason the 'check engine' light comes on.",
        "Oxygen Sensor Replacement": "Measures oxygen in exhaust gases to optimize performance and emissions.",
        "Brake Work": "Essential to prevent accidents and ensure stopping safety.",
        "Tire Repairs and Changes": "Good tires are vital for control and efficiency.",
        "The Ignition System": "Includes battery, starter, and ignition itself.",
        "Programming the Camera Software": "Ensures better focus, quality, and performance.",
        "Engine Repair": "Diagnose and fix engine issues for reliability.",
        "Transmission Repair": "Fix slipping gears, leaks, and shifting problems.",
        "AC System Service": "Recharge and repair your car’s air conditioning.",
        "Battery Replacement": "Test and replace dead or weak batteries."
    };

    // Local state for checkboxes
    const [selectedServices, setSelectedServices] = useState(formData.services || []);

    useEffect(() => {
        setSelectedServices(formData.services || []);
    }, [formData.services]);

    const toggleService = (serviceName) => {
        setSelectedServices(prev =>
            prev.includes(serviceName)
                ? prev.filter(s => s !== serviceName)
                : [...prev, serviceName]
        );
    };

    const handleNext = () => {
        setFormData(prev => ({ ...prev, services: selectedServices })); // ✅ save selected services
        navigate("/make-appointment/appointment");
    };

    const handleBack = () => {
        setFormData(prev => ({ ...prev, services: selectedServices }));
        navigate("/make-appointment/vehicle");
    };

    return (
        <Layout>
            <div className={style.customerContainer}>
                <div className={style.makeAppointmentContainer}>
                    <h2>Schedule Appointment <span>____</span></h2>
                    <div className={style.makeAppointment}>
                        <ul>
                            <li><Link to="/make-appointment/customer">Customer</Link> <FaChevronRight className={style.arrow} /></li>
                            <li><Link to="/make-appointment/vehicle">Vehicle</Link> <FaChevronRight className={style.arrow} /></li>
                            <li>Services <FaChevronRight className={style.arrow} /></li>
                            <li>Appointment <FaChevronRight className={style.arrow} /></li>
                            <li>Review</li>
                        </ul>
                    </div>
                    <p>Have an account? <Link to="/auth">Sign In</Link> or continue as guest.</p>
                    <div className={style.tittle}><FaWrench /> Choose Services</div>
                    <p>Select the services you need by checking the boxes.</p>
                    <div className={`${style.servicesContainer} row g-0`}>
                        {servicesList.map((service, index) => (
                            <div key={index} className={`col-12 col-sm-11 col-md-10 col-lg-6 ${index % 2 === 0 ? 'pe-lg-2' : 'ps-lg-2'} col-xxl-5`}>
                                <div className={style.service}>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.includes(service)}
                                        onChange={() => toggleService(service)}
                                    />
                                    <div>
                                        <h3>{service}</h3>
                                        <p>{serviceDescriptions[service]}</p>
                                    </div>
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