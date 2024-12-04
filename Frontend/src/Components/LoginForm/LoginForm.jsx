import React from 'react';
import Styles from "./LoginForm.module.css"

const LoginForm = () => {
  
  return (
    <section className={Styles.contactSection}>
      <div className={Styles.container}>
        <div className={Styles.sectionTitle}>
          <h2>Login to your account</h2>
        </div>
        <div className={Styles.contactForm}>
          <div className={Styles.innerContainer}>
            <div className={Styles.formContainer} >
              <div className={Styles.form}>
                <form>
                  <div className={Styles.formGroupContainer}>

                    <div className={Styles.formGroup}>
                      <input type="email" name="employee_email" placeholder="Email" />
                    </div>

                    <div className={Styles.formGroup}>
                      <input type="password" name="employee_password" placeholder="Password" />
                    </div>

                    <div className={Styles.formGroup}>
                      <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait..."><span>Login</span></button>
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
