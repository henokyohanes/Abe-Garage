import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight, FaUser } from "react-icons/fa";
import Layout from '../../../../Layout/Layout';
import style from "./Customer.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext'; // ✅ import context

function Customer() {
    const navigate = useNavigate();

    const { formData, setFormData } = useAppointment(); // ✅ use context
    const [localForm, setLocalForm] = useState(formData); // local copy for editing

    // Optional: Keep context and local form in sync (useful if user goes back)
    useEffect(() => {
        setLocalForm(formData);
    }, [formData]);

    const handleChange = (field, value) => {
        setLocalForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleClick = () => {
        setFormData((prev) => ({ ...prev, ...localForm })); // ✅ save to context
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
                            <li>Vehicle <FaChevronRight className={style.arrow} /></li>
                            <li>Services <FaChevronRight className={style.arrow} /></li>
                            <li>Appointment <FaChevronRight className={style.arrow} /></li>
                            <li>Review</li>
                        </ul>
                    </div>
                    <p>Have an account? <Link to="/auth">Sign In</Link> or continue as guest.</p>
                    <div className={style.tittle}><FaUser /> My Information</div>
                    <p><span>*</span> All fields are required</p>
                    <div className={style.inputsContainer}>
                        <input type="text" placeholder="* First Name" value={localForm.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                        <input type="text" placeholder="* Last Name" value={localForm.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                        <input type="text" placeholder="* Email" value={localForm.email} onChange={(e) => handleChange('email', e.target.value)} />
                        <input type="text" placeholder="* Phone" value={localForm.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    </div>
                    <button onClick={handleClick}>
                        Continue to Vehicle <FaChevronRight />
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default Customer;