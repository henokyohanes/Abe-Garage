import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaChevronLeft, FaChevronRight, FaCalendar,
  FaUser, FaCar, FaWrench, FaEdit
} from 'react-icons/fa';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import appointmentService from '../../../../services/appointment.service';
import Layout from '../../../../Layout/Layout';
import style from "./Review.module.css";
import { useAppointment } from '../../../../Contexts/AppointmentContext';
import NotFound from '../../../../Components/NotFound/NotFound';
import Loader from '../../../../Components/Loader/Loader';

function Review() {
  const { formData, clearFormData } = useAppointment();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedDate = formData.date ? new Date(formData.date) : null;
  const selectedTime = formData.time;

  const handleSubmit = async () => {

    setError(false);
    setLoading(true);

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "make",
      "model",
      "year",
      "color",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error("Please fill out all required fields.");
        return;
      }
    }

    const appointmentDetails = {
      ...formData,
      appointmentDate: selectedDate.toISOString().split("T")[0],
      appointmentTime: selectedTime,
    };

    console.log("Appointment details:", appointmentDetails);

    try {
      await appointmentService.submitAppointment(appointmentDetails);
      Swal.fire({
        title: "Success!",
        html: "Appointment scheduled successfully!",
        icon: "success",
        customClass: {
          popup: style.popup,
          confirmButton: style.confirmButton,
          icon: style.icon,
          title: style.successTitle,
          htmlContainer: style.text,
        },
      });
      clearFormData();
      // setTimeout(() => navigate("/"), 1500);
      setTimeout(() => { window.location.href = "/" }, 1500);
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      if (error === "Failed to create appointment") {
        Swal.fire({
          title: "Error!",
          html: `${error}. Please try again.`,
          icon: "error",
          customClass: {
            popup: style.popup,
            confirmButton: style.confirmButton,
            icon: style.icon,
            title: style.errorTitle,
            htmlContainer: style.text,
          },
        });
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {!loading && !error ? (<div className={style.customerContainer}>
        <div className={style.makeAppointmentContainer}>
          <h2>Schedule Appointment <span>____</span></h2>
          <div className={style.makeAppointment}>
            <ul>
              <li className={style.completed}><Link to="/make-appointment/customer">Customer</Link> <FaChevronRight className={style.arrow} /></li>
              <li className={style.completed}><Link to="/make-appointment/vehicle">Vehicle</Link> <FaChevronRight className={style.arrow} /></li>
              <li className={style.completed}><Link to="/make-appointment/services">Services</Link> <FaChevronRight className={style.arrow} /></li>
              <li className={style.completed}><Link to="/make-appointment/appointment">Appointment</Link> <FaChevronRight className={style.arrow} /></li>
              <li className={style.completed}><div>Review</div></li>
            </ul>
          </div>
          <div className={style.tittle}><FaUser /> Review Your Appointment</div>
          <div className="row g-0 justify-content-between">
            <div className="col-md-5 mb-4">
              <div className={style.tittles}><FaUser /> Your Information <FaEdit className={style.editIcon} onClick={() => navigate("/make-appointment/customer")} /> </div>
              <p>{formData.firstName} {formData.lastName}</p>
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
            </div>

            <div className="col-md-5 mb-4">
              <div className={style.tittles}><FaCar /> Vehicle Information <FaEdit className={style.editIcon} onClick={() => navigate("/make-appointment/vehicle")} /> </div>
              <p>{formData.year} {formData.make} {formData.model} ({formData.color})</p>
            </div>

            <div className="col-md-5 mb-4">
              <div className={style.tittles}><FaWrench />Selected Services <FaEdit className={style.editIcon} onClick={() => navigate("/make-appointment/services")} /> </div>
              <p>{formData.services && formData.services.length > 0 ? formData.services.map(s => s.service_name).join(", ") : "No services selected"}</p>
            </div>

            <div className="col-md-5 mb-4">
              <div className={style.tittles}><FaCalendar /> Appointment Time <FaEdit className={style.editIcon} onClick={() => navigate("/make-appointment/appointment")} /> </div>
              {/* <p>{selectedDate ? selectedDate.toLocaleDateString() + ", " + selectedTime : 'Not selected'}</p> */}
              <p>
                {selectedDate
                  ? `${selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })} at ${selectedTime}`
                  : "Not selected"}
              </p>

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
      </div>) : error ? <NotFound /> : <Loader />}
    </Layout>
  );
}

export default Review;