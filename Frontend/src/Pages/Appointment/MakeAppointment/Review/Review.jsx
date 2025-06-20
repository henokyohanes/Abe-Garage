import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaChevronLeft, FaChevronRight, FaCalendar, FaIdCard,
  FaUser, FaCar, FaWrench
} from 'react-icons/fa';
import Layout from '../../../../Layout/Layout';
import style from "./Review.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext';

function Review() {
  const { formData } = useAppointment();
  const navigate = useNavigate();

  const selectedDate = formData.date ? new Date(formData.date) : null;
  const selectedTime = formData.time;

  const handleSubmit = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'make', 'model', 'year', 'color'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert('Please fill out all required fields.');
        return;
      }
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select an appointment date and time.');
      return;
    }

    const appointmentDetails = {
      ...formData,
      appointmentDate: selectedDate.toLocaleDateString(),
      appointmentTime: selectedTime
    };

    console.log('Appointment Details:', appointmentDetails);
    alert("Appointment scheduled! Check console for details.");
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
              <li><Link to="/make-appointment/services">Services</Link> <FaChevronRight className={style.arrow} /></li>
              <li><Link to="/make-appointment/appointment">Appointment</Link> <FaChevronRight className={style.arrow} /></li>
              <li>Review</li>
            </ul>
          </div>

          <p>Have an account? <Link to="/auth">Sign In</Link> or continue as guest.</p>
<div className="row g-0 justify-content-between">
          <div className="col-md-5">
            <div className={style.tittle}><FaUser /> Your Information</div>
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.email}</p>
            <p>{formData.phone}</p>
          </div>

          <div className="col-md-5">
            <div className={style.tittle}><FaCar /> Vehicle Information</div>
            <p>{formData.year} {formData.make} 
              
              
              {formData.model} ({formData.color})</p>
          </div>

          <div className="col-md-5">
            <div className={style.tittle}><FaWrench />Selected Services</div>
            <p>{formData.services.length > 0 ? formData.services.join(', ') : 'None selected'}</p>
          </div>

          <div className="col-md-5">
            <div className={style.tittle}><FaCalendar /> Appointment Time</div>
            <p>{selectedDate ? selectedDate.toLocaleDateString() + ", " + selectedTime : 'Not selected'}</p>
          </div>
</div>
          <div className={style.buttonsContainer}>
            <button onClick={() => navigate("/make-appointment/appointment")} className={style.previousButton}>
              <FaChevronLeft /> Back to Appointment
            </button>
            <button onClick={handleSubmit} className={style.nextButton}>
              Schedule Your Appointment <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Review;