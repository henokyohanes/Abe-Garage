// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { PulseLoader } from "react-spinners";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Swal from "sweetalert2";
// import loginService from "../../services/login.service";
// import Styles from "./Login.module.css";

// const Login = ({onToggle, setError}) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   // const [error, setError] = useState(false);

//   // Handle form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Handle client side validations here
//     let valid = true;

//     // Email validation
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) {
//       setEmailError("Please enter your email address");
//       valid = false;
//     } else if (!regex.test(email)) {
//       setEmailError("Invalid email address");
//       valid = false;
//     } else {
//       setEmailError("");
//     }

//     if (!password) {
//       setPasswordError("please enter your password");
//       valid = false;
//     } else {
//       setPasswordError("");
//     }
//     if (!valid) return;

//     const formData = { email, password };

//     // Make the API call
//     try {
//       setLoading(true);
//       setError(false);

//       const response = await loginService.logIn(formData);

//       if (response.status === "success") {
//         Swal.fire({
//           title: "Success!",
//           html: "You have logged in successfully",
//           icon: "success",
//           customClass: {
//             popup: Styles.popup,
//             confirmButton: Styles.confirmButton,
//             icon: Styles.icon,
//             title: Styles.successTitle,
//             htmlContainer: Styles.text,
//           },
//         });

//         // Store the employee data in localStorage
//         if (response.data.sendBack.user_token) {
//           localStorage.setItem("user", JSON.stringify(response.data));
//         }

//         setTimeout(() => {window.location.href = "/dashboard"}, 2000);
//       } else if (response.message === "Something went wrong") {
//         Swal.fire({
//           title: "error!",
//           html: "Unexpected error occured. Please try again!",
//           icon: "error",
//           customClass: {
//             popup: Styles.popup,
//             confirmButton: Styles.confirmButton,
//             icon: Styles.icon,
//             title: Styles.errorTitle,
//             htmlContainer: Styles.text,
//           },
//         });
//       } else {
//         Swal.fire({
//           title: "Error!",
//           html: "Incorrect email or password. Please try again!",
//           icon: "error",
//           customClass: {
//             popup: Styles.popup,
//             confirmButton: Styles.confirmButton,
//             icon: Styles.icon,
//             title: Styles.errorTitle,
//             htmlContainer: Styles.text,
//           },
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       if (!err.error) {
//         setError(true);
//       } else {
//         Swal.fire({
//           title: "error!",
//           html: "Unexpected error occured. Please try again!",
//           icon: "error",
//           customClass: {
//             popup: Styles.popup,
//             confirmButton: Styles.confirmButton,
//             icon: Styles.icon,
//             title: Styles.errorTitle,
//             htmlContainer: Styles.text,
//           },
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//         <section className={Styles.contactSection}>
//           <div className={Styles.container}>
//             <div className={Styles.sectionTitle}>
//               <h2>
//                 Login to your account <span>___</span>
//               </h2>
//               <p>
//                 Don’t have an account? <Link to="" onClick={onToggle}>Create a new account</Link>
//               </p>
//             </div>
//             <div className={Styles.contactForm}>
//               <div className={Styles.innerContainer}>
//                 <div className={Styles.formContainer}>
//                   <div className={Styles.form}>
//                     <form onSubmit={handleSubmit}>
//                       <div className={Styles.formGroupContainer}>
//                         <div className={Styles.formGroup}>
//                             <div className={`${emailError ? Styles.error : Styles.hidden}`} role="alert">
//                               {emailError}.
//                             </div>
//                           <input
//                             type="email"
//                             name="email"
//                             value={email}
//                             placeholder="Email *"
//                             onChange={(event) => {setEmail(event.target.value); setEmailError("")}}
//                           />
//                         </div>
//                         <div className={Styles.formGroup}>
//                             <div className={`${passwordError ? Styles.error : Styles.hidden}`} role="alert">
//                               {passwordError}.
//                             </div>
//                           <div className={Styles.passwordContainer}>
//                             <input
//                               type={showPassword ? "text" : "password"}
//                               name="password"
//                               value={password}
//                               placeholder="Password *"
//                               autoComplete="current-password"
//                               onChange={(event) =>
//                                 {setPassword(event.target.value); setPasswordError("")}
//                               }
//                             />
//                             <button
//                               type="button"
//                               className={Styles.togglePassword}
//                               onClick={() => setShowPassword(!showPassword)}
//                             >
//                               {showPassword ? <FaEyeSlash /> : <FaEye />}
//                             </button>
//                           </div>
//                         </div>
//                         <div className={Styles.formGroup}>
//                           <div className={Styles.forgotPassword}>
//                             <Link to="/forgot-password">Forgot password?</Link>
//                           </div>
//                           <button className={Styles.logInButton} type="submit" disabled={loading} >
//                             {loading ? (
//                               <PulseLoader color="white" size={12} />
//                             ) : (
//                               "LogIn"
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//   );
// };

// export default Login;

































import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import loginService from "../../services/login.service";
import Styles from "./Login.module.css";

const Login = ({ onToggle, setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpUser, setOtpUser] = useState({}); // store userId, userType, email
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------- LOGIN STEP 1 --------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

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
      setPasswordError("Please enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      setLoading(true);
      setError(false);

      const response = await loginService.logIn({ email, password });
      console.log("responsenow", response);

      if (response.status === "pending_2fa") {
        // OTP required
        setOtpUser({
          userId: response.userId,
          userType: response.userType,
          userEmail: response.userEmail,
        });
        console.log("otpUser", otpUser);
        setIsOtpStep(true);

        Swal.fire({
          title: "OTP Sent!",
          html: "A verification code has been sent to your email. Enter it to complete login.",
          icon: "info",
        });
        return;
      }

      if (response.status === "success") {
        Swal.fire({
          title: "Success!",

          html: "You have logged in successfully",
          icon: "success",
        });

                // Store the employee data in localStorage
                if (response.data.user_token) {
                  localStorage.setItem("user", JSON.stringify(response.data));
                }

                setTimeout(() => {window.location.href = "/dashboard"}, 2000);

        // localStorage.setItem("user", JSON.stringify(response.data));
        // setTimeout(() => {
        //   window.location.href = "/dashboard";
        // }, 2000);
      } else {
        Swal.fire({
          title: "Error!",
          html:
            response.message ||
            "Incorrect email or password. Please try again!",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
console.log("otpUser", otpUser);
  // -------------------- VERIFY OTP --------------------
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP code");
      return;
    }

    try {
      setLoading(true);
      setOtpError("");

      const response = await loginService.verifyOTP({
        userId: otpUser.userId,
        userEmail: otpUser.userEmail,
        userType: otpUser.userType,
        otp,
      });

      if (response.status === "success") {
        Swal.fire("Success!", "OTP verified successfully.", "success");
        localStorage.setItem("user", JSON.stringify(response.data));
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setOtpError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={Styles.contactSection}>
      <div className={Styles.container}>
        <div className={Styles.sectionTitle}>
          <h2>
            {isOtpStep ? "Verify OTP" : "Login to your account"}{" "}
            <span>___</span>
          </h2>
          {!isOtpStep && (
            <p>
              Don’t have an account?{" "}
              <Link to="" onClick={onToggle}>
                Create a new account
              </Link>
              
            </p>
          )}
        </div>

        <div className={Styles.contactForm}>
          <div className={Styles.innerContainer}>
            <div className={Styles.formContainer}>
              <div className={Styles.form}>
                {!isOtpStep ? (
                  <form onSubmit={handleSubmit}>
                    <div className={Styles.formGroupContainer}>
                      <div className={Styles.formGroup}>
                        {emailError && (
                          <div className={Styles.error} role="alert">
                            {emailError}
                          </div>
                        )}
                        <input
                          type="email"
                          name="email"
                          value={email}
                          placeholder="Email *"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                        />
                      </div>
                      <div className={Styles.formGroup}>
                        {passwordError && (
                          <div className={Styles.error} role="alert">
                            {passwordError}
                          </div>
                        )}
                        <div className={Styles.passwordContainer}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            placeholder="Password *"
                            autoComplete="current-password"
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError("");
                            }}
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
                        <button
                          className={Styles.logInButton}
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <PulseLoader color="white" size={12} />
                          ) : (
                            "LogIn"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className={Styles.formGroup}>
                      <label>Enter the OTP sent to your email</label>
                      <input
                        type="number"
                        value={otp}
                        placeholder="OTP code"
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      {otpError && (
                        <div className={Styles.error}>{otpError}</div>
                      )}
                    </div>
                    <div className={Styles.formGroup}>
                      <button
                        className={Styles.logInButton}
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                      >
                        {loading ? (
                          <PulseLoader color="white" size={12} />
                        ) : (
                          "Verify OTP"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;




