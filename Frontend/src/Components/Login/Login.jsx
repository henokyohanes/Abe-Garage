import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import loginService from "../../services/login.service";
import Styles from "./Login.module.css";

const Login = ({onToggle, setError}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client side validations here
    let valid = true;

    // Email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!regex.test(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("please enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    const formData = { email, password };

    // Make the API call
    try {
      setLoading(true);
      setError(false);

      const response = await loginService.logIn(formData);

      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
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

        // Store the employee data in localStorage
        if (response.data.sendBack.user_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(response.data);
        }

        setTimeout(() => {window.location.href = "/"}, 1500);
      } else if (response.message === "Something went wrong") {
        Swal.fire({
          title: "error!",
          html: "Unexpected error occured. Please try again!",
          icon: "error",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.errorTitle,
            htmlContainer: Styles.text,
          },
        });
      } else {
        Swal.fire({
          title: "Error!",
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
      if (!err.error) {
        setError(true);
      } else {
        Swal.fire({
          title: "error!",
          html: "Unexpected error occured. Please try again!",
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
    } finally {
      setLoading(false);
    }
  };

  return (
        <section className={Styles.contactSection}>
          <div className={Styles.container}>
            <div className={Styles.sectionTitle}>
              <h2>
                Login to your account <span>___</span>
              </h2>
              <p>
                Don’t have an account? <Link to="" onClick={onToggle}>Create a new account</Link>
              </p>
            </div>
            <div className={Styles.contactForm}>
              <div className={Styles.innerContainer}>
                <div className={Styles.formContainer}>
                  <div className={Styles.form}>
                    <form onSubmit={handleSubmit}>
                      <div className={Styles.formGroupContainer}>
                        <div className={Styles.formGroup}>
                            <div className={`${emailError ? Styles.error : Styles.hidden}`} role="alert">
                              {emailError}.
                            </div>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Email *"
                            onChange={(event) => setEmail(event.target.value)}
                          />
                        </div>
                        <div className={Styles.formGroup}>
                            <div className={`${passwordError ? Styles.error : Styles.hidden}`} role="alert">
                              {passwordError}.
                            </div>
                          <div className={Styles.passwordContainer}>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={password}
                              placeholder="Password *"
                              autoComplete="current-password"
                              onChange={(event) =>
                                setPassword(event.target.value)
                              }
                            />
                            <button
                              type="button"
                              className={Styles.togglePassword}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        <div className={Styles.formGroup}>
                          <div className={Styles.forgotPassword}>
                            <Link to="/forgot-password">Forgot password?</Link>
                          </div>
                          <button className={Styles.logInButton} type="submit">
                            {loading ? (
                              <PulseLoader color="white" size={12} />
                            ) : (
                              "LogIn"
                            )}
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

export default Login;