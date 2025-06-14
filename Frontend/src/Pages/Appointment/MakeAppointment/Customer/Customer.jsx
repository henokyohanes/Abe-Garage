import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight, FaUser } from "react-icons/fa";
import Layout from '../../../../Layout/Layout';
import style from "./Customer.module.css"



function Customer() {

    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClick = () => {
        navigate("/make-appointment/vehicle");
    };

    return (
        <Layout>
            <div className={style.makeAppointmentContainer}>
                <h2>Schedule Appointment <span>____</span></h2>
                <div className={style.makeAppointment}>
                    <ul>
                        <li> <div> 1 </div> <Link to="/make-appointment/customer">Customer </Link> <FaChevronRight className={style.arrow} /> </li>
                        <li> <div> 2 </div> Vehicle <FaChevronRight className={style.arrow} /> </li>
                        <li> <div> 3 </div> Services <FaChevronRight className={style.arrow} /> </li>
                        <li> <div> 4 </div> Appointment <FaChevronRight className={style.arrow} /> </li>
                        <li> <div> 5 </div> Review </li>
                    </ul>
                </div>
                <p>have an account? <Link to="/auth">Sign In </Link> or continue as guest.</p>
                <div className={style.tittle}><FaUser /> My Information</div>
                <p><span>*</span> All fields are required</p>
                <div className={style.inputsContainer}>
                    <input type="text" placeholder="* First Name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                    <input type="text" placeholder="* Last Name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                    <input type="text" placeholder="* Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    <input type="text" placeholder="* Phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                </div>
                    <button onClick={handleClick}>Continue to Vehicle <FaChevronRight /></button>
            </div>
        </Layout>
    )
}

export default Customer