import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaCar, FaChevronLeft } from "react-icons/fa";
import Layout from '../../../../Layout/Layout';
import style from "./Vehicle.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext'; // ✅ import context

function Vehicle() {
  const navigate = useNavigate();
  const { formData, setFormData } = useAppointment(); // ✅ use shared context

  const [vehicleData, setVehicleData] = useState({
    make: formData.make || '',
    model: formData.model || '',
    year: formData.year || '',
    color: formData.color || ''
  });

  // Keep it in sync if the context changes (optional)
  useEffect(() => {
    setVehicleData({
      make: formData.make || '',
      model: formData.model || '',
      year: formData.year || '',
      color: formData.color || ''
    });
  }, [formData]);

  const handleChange = (field, value) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setFormData(prev => ({ ...prev, ...vehicleData })); // ✅ update context
    navigate("/make-appointment/services");
  };

  const handleBack = () => {
    setFormData(prev => ({ ...prev, ...vehicleData })); // ✅ keep data even if going back
    navigate("/make-appointment/customer");
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
          <div className={style.tittle}><FaCar /> Vehicle Information</div>
          <p><span>*</span> All fields are required</p>
          <div className={style.inputsContainer}>
            <input type="text" placeholder="* Make" value={vehicleData.make} onChange={(e) => handleChange('make', e.target.value)} />
            <input type="text" placeholder="* Model" value={vehicleData.model} onChange={(e) => handleChange('model', e.target.value)} />
            <input type="text" placeholder="* Year" value={vehicleData.year} onChange={(e) => handleChange('year', e.target.value)} />
            <input type="text" placeholder="* Color" value={vehicleData.color} onChange={(e) => handleChange('color', e.target.value)} />
          </div>
          <div className={style.buttonsContainer}>
            <button onClick={handleBack} className={style.previousButton}><FaChevronLeft /> Back to Customer</button>
            <button onClick={handleNext} className={style.nextButton}>Continue to Services <FaChevronRight /></button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Vehicle;