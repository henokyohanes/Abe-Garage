import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import Swal from "sweetalert2";
import loginService from "../../services/login.service";
import Layout from "../../Layout/Layout";
import Styles from "./Login.module.css";

const Login = () => {

  const [employee_email, setEmail] = useState("");
  const [employee_password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client side validations here
    let valid = true;

    // Email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!employee_email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!regex.test(employee_email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!employee_password) {
      setPasswordError("please enter your password");
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
        Swal.fire({
          title: "Good job!",
          html: "You have logged in successfully",
          icon: "success",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.successTitle,
            htmlContainer: Styles.text,
          },
        });
        if (response.data.employee_token) {
          localStorage.setItem("employee", JSON.stringify(response.data));
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        Swal.fire({
          title: "Oops!",
          html: "Incorrect email or password. Please try again!",
          icon: "error",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.errorTitle,
            htmlContainer: Styles.text,
          },
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "error!",
        html: "Unexpected error occured. Please try again!",
        icon: "error",
        customClass: {
          popup: Styles.popup,
          confirmButton: Styles.confirmButton,
          icon: Styles.icon,
          title: Styles.errorTitle,
          htmlContainer: Styles.text
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
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
                        {emailError && <div className={Styles.error} role="alert">{emailError}</div>}
                        <input
                          name="employee_email" value={employee_email}
                          onChange={(event) => setEmail(event.target.value)} placeholder="Email"
                        />
                      </div>
                      <div className={Styles.formGroup}>
                        {passwordError && <div className={Styles.error} role="alert">{passwordError}</div>}
                        <input type="password" name="employee_password" value={employee_password}
                          onChange={(event) => setPassword(event.target.value)} placeholder="Password"
                        />
                      </div>
                      <div className={Styles.formGroup}>
                        <button type="submit" data-loading-text="Please wait..." disabled={loading}>
                          {loading ? <PulseLoader color="white" size={12} /> : "Login"}
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
    </Layout>
  );
}

export default Login;
