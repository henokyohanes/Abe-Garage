import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import loginService from "../../services/login.service";
import Styles from "./LoginForm.module.css";

const LoginForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [employee_email, setEmail] = useState("");
  const [employee_password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client side validations here
    let valid = true;

    // Email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!employee_email) {
      setEmailError("Please enter your email address first");
      valid = false;
    } else if (!regex.test(employee_email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!employee_password || employee_password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    const formData = { employee_email, employee_password };

    try {
      setLoading(true);
      const response = await loginService.logIn(formData);
      if (response.status === "success") {
        if (response.data.employee_token) {
          localStorage.setItem("employee", JSON.stringify(response.data));
        }
        navigate("/");
        window.location.reload();
      } else {
        setServerError(response.message || "Unexpected error. Please try again.");
      }
    } catch (err) {
      setServerError(err.message || "An error has occurred. Please try again later.");
    } finally { 
      setLoading(false);
    }
  };

  return (
    <section className={Styles.contactSection}>
      <div className={Styles.container}>
        <div className={Styles.sectionTitle}>
          <h2>Login to your account <span>___</span></h2>
        </div>
        <div className={Styles.contactForm}>
          <div className={Styles.innerContainer}>
            <div className={Styles.formContainer} >
              <div className={Styles.form}>
                <form onSubmit={handleSubmit}>
                  <div className={Styles.formGroupContainer}>
                    <div className={Styles.formGroup}>
                      {serverError && <div className={Styles.error} role="alert">{serverError}</div>}
                      <input type="email" name="employee_email" value={employee_email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
                      {emailError && <div className={Styles.error} role="alert">{emailError}</div>}
                    </div>
                    <div className={Styles.formGroup}>
                      <input type="password" name="employee_password" value={employee_password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                      {passwordError && <div className={Styles.error} role="alert">{passwordError}</div>}
                    </div>
                    <div className={Styles.formGroup}>
                      <button type="submit" data-loading-text="Please wait..." disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;

