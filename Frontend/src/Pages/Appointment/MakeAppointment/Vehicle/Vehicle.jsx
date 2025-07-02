import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaCar, FaChevronLeft } from "react-icons/fa";
import { useAppointment } from '../../../../Contexts/AppointmentContext';
import Layout from '../../../../Layout/Layout';
import style from "./Vehicle.module.css";
import carMakersData from "./carMakers.json";

function Vehicle() {
  const navigate = useNavigate();
  const { formData, setFormData } = useAppointment();
  const [vehicleData, setVehicleData] = useState(formData || {});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setVehicleData(formData || {});
  }, [formData]);

  const handleChange = (field, value) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "make" ? { model: "" } : {}),
    }));
  };

  const carMakers = Object.keys(carMakersData);
  const carModelsByMake = carMakersData;

  // Regular expressions for validation
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    //make validation
    if (!vehicleData.make) {
      errors.make = "make is required";
      isValid = false;
    }

    //model validation
    if (!vehicleData.model) {
      errors.model = "Model is required";
      isValid = false;
    }

    //year validation
    if (!vehicleData.year) {
      errors.year = "year is required";
      isValid = false;
    }

    //color validation
    const colorRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
    if (!vehicleData.color) {
      errors.color = "Color is required";
      isValid = false;
    } else if (!colorRegex.test(vehicleData.color)) {
      errors.color = "Invalid color format";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    setFormData((prev) => ({ ...prev, ...vehicleData }));
    navigate("/make-appointment/services");
  };

  const handleBack = () => {
    setFormData((prev) => ({ ...prev, ...vehicleData }));
    navigate("/make-appointment/customer");
  };

  return (
    <Layout>
      <div className={style.customerContainer}>
        <div className={style.makeAppointmentContainer}>
          <h2>
            Schedule Appointment <span>____</span>
          </h2>
          <div className={style.makeAppointment}>
            <ul>
              <li>
                <Link to="/make-appointment/customer">Customer</Link>{" "}
                <FaChevronRight className={style.arrow} />
              </li>
              <li>
                Vehicle <FaChevronRight className={style.arrow} />
              </li>
              <li>
                Services <FaChevronRight className={style.arrow} />
              </li>
              <li>
                Appointment <FaChevronRight className={style.arrow} />
              </li>
              <li>Review</li>
            </ul>
          </div>
          <p>
            Have an account? <Link to="/auth">Sign In</Link> or continue as
            guest.
          </p>
          <div className={style.tittle}>
            <FaCar /> Vehicle Information
          </div>
          <p>
            <span>*</span> All fields are required
          </p>
          <div className={style.inputsContainer}>
            <div>
            <div className={`${formErrors.make ? style.error : style.hidden}`} role="alert">
              {formErrors.make}.
            </div>
            <select
              className={style.input}
              value={vehicleData.make || ""}
              onChange={(e) => handleChange("make", e.target.value)}
            >
              <option value="">* Make</option>
              {carMakers.map((maker, i) => (
                <option key={i} value={maker}>
                  {maker}
                </option>
              ))}
            </select>
            </div>
            <div>
            <div className={`${formErrors.model ? style.error : style.hidden}`} role="alert">
              {formErrors.model}.
            </div>
            <select
              // className={style.input}
              value={vehicleData.model || ""}
              onChange={(e) => handleChange("model", e.target.value)}
              disabled={!vehicleData.make}
            >
              <option value="">* Model</option>
              {vehicleData.make &&
                carModelsByMake[vehicleData.make].map((model, i) => (
                  <option key={i} value={model}>
                    {model}
                  </option>
                ))}
            </select>
            </div>
            <div>
            <div className={`${formErrors.year ? style.error : style.hidden}`} role="alert">
              {formErrors.year}.
            </div>
            <select
              className={style.input}
              value={vehicleData.year || ""}
              onChange={(e) => handleChange("year", e.target.value)}
            >
              <option value="">* Year</option>
              {Array.from({ length: 40 }, (_, i) => {
                const year = new Date().getFullYear() + 1 - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            </div>
            <div>
            <div className={`${formErrors.color ? style.error : style.hidden}`} role="alert">
              {formErrors.color}.
            </div>
            <input
              type="text"
              className={style.input}
              placeholder="* Color"
              value={vehicleData.color || ""}
              onChange={(e) => handleChange("color", e.target.value)}
            />
            </div>
          </div>
          <div className={style.buttonsContainer}>
            <button onClick={handleBack} className={style.previousButton}>
              <FaChevronLeft /> Back to Customer
            </button>
            <button onClick={handleNext} className={style.nextButton}>
              Continue to Services <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Vehicle;