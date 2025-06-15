import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaChevronRight, FaCar, FaChevronLeft } from "react-icons/fa";
import Layout from '../../../../Layout/Layout'
import style from "./Vehicle.module.css"

function Vehicle() {

  const [formData, setFormData] = useState({ make: '', model: '', year: '', color: '' });
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Layout>
      <div className={style.customerContainer}>
        <div className={style.makeAppointmentContainer}>
          <h2>Schedule Appointment <span>____</span></h2>
          <div className={style.makeAppointment}>
            <ul>
              <li> <Link to="/make-appointment/customer">Customer </Link> <FaChevronRight className={style.arrow} /> </li>
              <li> Vehicle <FaChevronRight className={style.arrow} /> </li>
              <li> Services <FaChevronRight className={style.arrow} /> </li>
              <li> Appointment <FaChevronRight className={style.arrow} /> </li>
              <li> Review </li>
            </ul>
          </div>
          <p>have an account? <Link to="/auth">Sign In </Link> or continue as guest.</p>
          <div className={style.tittle}><FaCar /> Vehicle Information</div>
          <p><span>*</span> All fields are required</p>
          <div className={style.inputsContainer}>
            <input type="text" placeholder="* Make" value={formData.make} onChange={(e) => handleChange('make', e.target.value)} />
            <input type="text" placeholder="* Model" value={formData.model} onChange={(e) => handleChange('model', e.target.value)} />
            <input type="text" placeholder="* Year" value={formData.year} onChange={(e) => handleChange('year', e.target.value)} />
            <input type="text" placeholder="* Color" value={formData.color} onChange={(e) => handleChange('color', e.target.value)} />
          </div>
          <div className={style.buttonsContainer}>
            <button onClick={() => navigate("/make-appointment/customer")} className={style.previousButton}> <FaChevronLeft /> Back to Customer</button>
            <button onClick={() => navigate("/make-appointment/services")} className={style.nextButton}>Continue to Services <FaChevronRight /></button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Vehicle