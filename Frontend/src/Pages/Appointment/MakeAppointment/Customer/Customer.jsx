import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight, FaUser } from "react-icons/fa";
import Layout from '../../../../Layout/Layout';
import style from "./Customer.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext';
import { useAuth } from '../../../../Contexts/AuthContext';

function Customer() {
    const navigate = useNavigate();
    const { isLogged, user } = useAuth();

    const defaultForm = {firstName: "", lastName: "", email: "", phone: ""};
    const { formData, setFormData } = useAppointment();
    const [localForm, setLocalForm] = useState({...defaultForm, ...formData});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        setLocalForm((prev) => ({ ...prev, ...formData }));
    }, [formData]);

    // Regular expressions for validation
    const validateForm = () => {
        let isValid = true;
        const errors = {};

        //name validation
        const nameRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
        if (!localForm.firstName) {
            errors.firstName = "First name is required";
            isValid = false;
        } else if (!nameRegex.test(localForm.firstName)) {
            errors.firstName = "Invalid first name format";
            isValid = false;
        }
        if (!localForm.lastName) {
            errors.lastName = "Last name is required";
            isValid = false;
        } else if (!nameRegex.test(localForm.lastName)) {
            errors.lastName = "Invalid last name format";
            isValid = false;
        }

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!localForm.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(localForm.email)) {
            errors.email = "Invalid email format";
            isValid = false;
        }

        //phone validation
        const phoneRegex = /^(\(?\d{3}\)?[-\s]?)\d{3}[-\s]?\d{4}$/;
        if (!localForm.phone) {
            errors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(localForm.phone)) {
            errors.phone = "Invalid phone number format";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (field, value) => {
        setLocalForm((prev) => ({ ...prev, [field]: value }));
        // Remove error immediately when user starts typing
        setFormErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    };

    const handleClick = () => {
        if (!validateForm()) return;
        if (!localForm) return;

        setFormData((prev) => ({ ...prev, ...localForm }));
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
                            <li><a>Vehicle</a> <FaChevronRight className={style.arrow} /></li>
                            <li><a>Services</a> <FaChevronRight className={style.arrow} /></li>
                            <li><a>Appointment</a> <FaChevronRight className={style.arrow} /></li>
                            <li><a>Review</a></li>
                        </ul>
                    </div>
                    {!isLogged && <p>Have an account? <Link to="/auth">Sign In</Link> or continue as guest.</p>}
                    <div className={style.tittle}><FaUser /> My Information</div>
                    <p><span>*</span> All fields are required</p>
                    <div className={style.inputsContainer}>
                        <div>
                        <div className={`${formErrors.firstName ? style.error : style.hidden}`} role="alert">
                            {formErrors.firstName}.
                        </div>
                        <input type="text" placeholder="* First Name" value={localForm.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                        </div>
                        <div>
                        <div className={`${formErrors.lastName ? style.error : style.hidden}`} role="alert">
                            {formErrors.lastName}.
                        </div>
                        <input type="text" placeholder="* Last Name" value={localForm.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                        </div>
                        <div>
                        <div className={`${formErrors.email ? style.error : style.hidden}`} role="alert">
                            {formErrors.email}.
                        </div>
                        <input type="text" placeholder="* Email" value={localForm.email} onChange={(e) => handleChange('email', e.target.value)} />
                        </div>
                        <div>
                        <div className={`${formErrors.phone ? style.error : style.hidden}`} role="alert">
                            {formErrors.phone}.
                        </div>
                        <input type="text" placeholder="* Phone" value={localForm.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                        </div>
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