import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import loginService from "../../services/login.service";
import Styles from "./LoginForm.module.css";

const LoginForm = () => {
  
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

