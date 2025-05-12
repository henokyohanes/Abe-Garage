import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { FaInfoCircle } from "react-icons/fa";
import CryptoJS from "crypto-js";
import loginService from "../../services/login.service";
import Swal from "sweetalert2";
import styles from "./SignUp.module.css";

const Signup = ({ onToggle, setError }) => {

  const [formData, setFormData] = useState({
    customer_username: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_phone_number: "",
    customer_email: "",
    customer_password: "",
    active_customer_status: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the input value
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Remove error immediately when user starts typing
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Regular expressions for validation
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    //name validation
    const nameRegex = /^[A-Za-z]{2,}([ '-][A-Za-z]+)*$/;
    if (!formData.customer_first_name) {
      errors.firstName = "First name is required";
      isValid = false;
    } else if (!nameRegex.test(formData.customer_first_name)) {
      errors.firstName = "Invalid first name format";
      isValid = false;
    }
    if (!formData.customer_last_name) {
      errors.lastName = "Last name is required";
      isValid = false;
    } else if (!nameRegex.test(formData.customer_last_name)) {
      errors.lastName = "Invalid last name format";
      isValid = false;
    }

    //username validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!formData.customer_username) {
      errors.username = "Username is required";
      isValid = false;
    } else if (!usernameRegex.test(formData.customer_username)) {
      errors.username = "Username must be alphanumeric";
      isValid = false;
    }

    //phone validation
    const phoneRegex = /^(\(?\d{3}\)?[-\s]?)\d{3}[-\s]?\d{4}$/;
    if (!formData.customer_phone_number) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.customer_phone_number)) {
      errors.phone = "Invalid phone number format";
      isValid = false;
    }

    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customer_email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.customer_email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    //password validation
    const passwordRegex = /^.{8,}$/;
    if (!formData.customer_password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.customer_password)) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Generate the customer hash
  const generateCustomerHash = () => {
    const dataToHash =
      formData.customer_first_name +
      formData.customer_last_name +
      formData.customer_email;
    return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Base64);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Generate the customer hash
    const customerHash = generateCustomerHash();

    const formDataWithHash = {
      ...formData,
      customer_hash: customerHash,
    };

    try {
      setLoading(true);
      setError(false);

      const response = await loginService.register(formDataWithHash);

      console.log(response);

      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
          html: "Customer registered successfully!",
          icon: "success",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.successTitle,
            htmlContainer: styles.text,
          },
        });

        // Store the token in local storage and redirect to the home page
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to register user:", err);

      if (err === "Customer already exists") {
        Swal.fire({
          title: "Failed!",
          html: "Customer with this email already exists",
          icon: "error",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.errorTitle,
            htmlContainer: styles.text,
          },
        });
      } else if (err === "Something went wrong!") {
        Swal.fire({
          title: "Failed!",
          html: "Something went wrong. Please try again",
          icon: "error",
          customClass: {
            popup: styles.popup,
            confirmButton: styles.confirmButton,
            icon: styles.icon,
            title: styles.errorTitle,
            htmlContainer: styles.text,
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
    <div className={styles.signupContainer}>
      <h2>
        Join the network <span>___</span>
      </h2>
      <p>
        Already have an account?{" "}
        <Link to="/auth" onClick={onToggle}>
          Sign In
        </Link>
      </p>
      {/* Signup Form */}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.name_fields}>
          <div className={styles.inputGroup}>
              <div className={`${formErrors.firstName ? styles.error : styles.hidden}`} role="alert">
                {formErrors.firstName}.
              </div>
            <input
              type="text"
              name="customer_first_name"
              placeholder="First name *"
              value={formData.customer_first_name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
              <div className={`${formErrors.lastName ? styles.error : styles.hidden}`} role="alert">
                {formErrors.lastName}.
              </div>
            <input
              type="text"
              name="customer_last_name"
              placeholder="Last name *"
              value={formData.customer_last_name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.phone_fields}>
          <div className={styles.inputGroup}>
              <div className={`${formErrors.username ? styles.error : styles.hidden}`} role="alert">
                {formErrors.username}.
              </div>
            <input
              type="text"
              name="customer_username"
              placeholder="Username *"
              value={formData.customer_username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
              <div className={`${formErrors.phone ? styles.error : styles.hidden}`} role="alert">
                {formErrors.phone}.
              </div>
            <input
              type="text"
              name="customer_phone_number"
              placeholder="Phone *"
              value={formData.customer_phone_number}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
            <div className={`${formErrors.email ? styles.error : styles.hidden}`} role="alert">
              {formErrors.email}.
            </div>
          <input
            type="email"
            name="customer_email"
            placeholder="Email address *"
            value={formData.customer_email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
            <div className={`${formErrors.password ? styles.error : styles.hidden}`} role="alert">
              {formErrors.password}.
            </div>
          <input
            type="password"
            name="customer_password"
            placeholder="Password *"
            value={formData.customer_password}
            onChange={handleChange}
          />
        </div>
        <span className={styles.passwordHint}>
          <FaInfoCircle color="#0b5ed7" /> Passwords must be at least 8
          characters.
        </span>
        <div className={styles.terms}>
          I agree to the <Link to="/privacy-policy">privacy policy</Link> and{" "}
          <Link to="/terms-of-service">terms of service</Link>.
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <PulseLoader color="#fff" height={12} />
          ) : (
            "Agree and Join"
          )}
        </button>
      </form>
      <p>
        <Link to="/auth" onClick={onToggle}>
          Already have an account?{" "}
        </Link>
      </p>
    </div>
  );
};

export default Signup;