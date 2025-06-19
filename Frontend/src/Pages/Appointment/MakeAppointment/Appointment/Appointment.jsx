import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaCalendar } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from '../../../../Layout/Layout';
import style from "./Appointment.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext';

function Appointment() {
  const { formData, setFormData } = useAppointment();
  const navigate = useNavigate();

  const selectedDate = formData.date ? new Date(formData.date) : new Date();
  const selectedTime = formData.time || '';

  const availableTimes = [
    '07:20 AM', '07:40 AM', '08:00 AM', '08:20 AM', '08:40 AM', '09:00 AM', '09:20 AM', '09:40 AM',
    '10:00 AM', '10:20 AM', '10:40 AM', '11:00 AM', '11:20 AM', '11:40 AM', '12:00 PM', '12:20 PM',
    '12:40 PM', '01:00 PM', '01:20 PM', '01:40 PM', '02:00 PM', '02:20 PM', '02:40 PM', '03:00 PM',
    '03:20 PM', '03:40 PM', '04:00 PM', '04:20 PM', '04:40 PM', '05:00 PM', '05:20 PM', '05:40 PM'
  ];

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date.toISOString()
    }));
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      navigate("/make-appointment/review");
    }
  };

  const handleBack = () => {
    navigate("/make-appointment/services");
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
              <li>Appointment <FaChevronRight className={style.arrow} /></li>
              <li>Review</li>
            </ul>
          </div>

          <p>Have an account? <Link to="/auth">Sign In</Link> or continue as guest.</p>

          <div className={style.tittle}><FaCalendar /> Set Appointment</div>

          <div className={style.datePickerContainer}>
            <div className="row g-0 justify-content-between">
              <div className={`${style.datePickerWrapper} col-md-4`}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className={`${style.datePicker} form-control`}
                  minDate={new Date()}
                  maxDate={new Date(new Date().setDate(new Date().getDate() + 45))}
                  inline
                />
              </div>

              <div className="col-md-7">
                <label className="form-label fw-bold">
                  Available Times on {selectedDate.toLocaleDateString()}:
                </label>
                <div className={`${style.timeContainer} d-flex flex-wrap gap-2`}>
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`btn btn-outline-primary btn-sm ${selectedTime === time ? 'active' : ''}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={style.buttonsContainer}>
            <button onClick={handleBack} className={style.previousButton}>
              <FaChevronLeft /> Back to Services
            </button>
            <button
              onClick={handleNext}
              className={style.nextButton}
              disabled={!selectedTime}
            >
              Review Your Appointment <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Appointment;