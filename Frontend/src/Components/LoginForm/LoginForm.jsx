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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client side validations here
    let valid = true;

    // Email validation
    if (!employee_email) {
      setEmailError("Please enter your email address first");
      valid = false;
    } else if (!employee_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(employee_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }
    if (!employee_password || employee_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) {
      return;
    }

    const formData = {
      employee_email,
      employee_password,
    };

    // Call the service
    const loginEmployee = loginService.logIn(formData);
    loginEmployee
      .then((response) => {
        if (response.status === "success") {
          // Save the user in the local storage
          if (response.data.employee_token) {
            localStorage.setItem("employee", JSON.stringify(response.data));
          }

          // Redirect the user to the dashboard
          navigate("/admin");
          if (location.pathname === "/login") {
            navigate("/admin");
            window.location.replace("/");
          } else {
            window.location.reload();
          }
        } else {
          setServerError(response.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setServerError("An error has occurred. Please try again later.");
      });
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
                      <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait...">Login</button>
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
}

export default LoginForm;

