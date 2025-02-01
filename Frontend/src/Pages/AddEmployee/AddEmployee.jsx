import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import employeeService from '../../services/employee.service';
import AdminMenu from '../../Components/AdminMenu/AdminMenu';
import AdminMenuMobile from '../../Components/AdminMenuMobile/AdminMenuMobile';
import Layout from '../../Layout/Layout';
import styles from "./AddEmployee.module.css";

const AddEmployee = () => {

  const [employee_email, setEmployee_email] = useState('');
  const [employee_first_name, setEmployee_first_name] = useState('');
  const [employee_last_name, setEmployee_last_name ] = useState('');
  const [employee_phone, setEmployee_phone] = useState('');
  const [employee_password, setPassword] = useState('');
  const [active_employee, setActive_employee] = useState(1);
  const [company_role_id, setCompany_role_id] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [firstNameRequired, setFirstNameRequired] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Create a variable to hold the user's token
  let loggedInEmployeeToken = '';

  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle client side validations  
    let valid = true;
    if (!employee_first_name) {
      setFirstNameRequired('First name is required');
      valid = false;
    } else {
      setFirstNameRequired('');
    }
    // Email is required
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
    const formData = {employee_email, employee_first_name, employee_last_name, employee_phone, employee_password, active_employee, company_role_id};

    // Pass the form data to the service 
    const newEmployee = employeeService.addEmployee(formData, loggedInEmployeeToken);

    newEmployee.then((data) => {
        if (data.error) {
          setServerError(data.error)
        } else {
          setSuccess(true);
          setServerError('')
          setTimeout(() => {
            navigate('/employees');
          }, 2000);
        }
      })
      // Handle Catch 
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      });
  }

  return (
    <Layout>
      <div className={`${styles.contactSection} row g-0`}>
        <div className="d-none d-md-block col-3">
          <AdminMenu />
        </div>
        <div className="d-block d-md-none">
          <AdminMenuMobile />
        </div>
        <div className="col-12 col-md-9">
          <div className={styles.container}>
            <h2>Add a new employee <span>____</span></h2>
            <div className={styles.contactForm}>
              <div className={styles.innerContainer}>
                <div className={styles.formContainer}>
                  <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                      <div className={styles.formGroupContainer}>
                        <div className={styles.formGroup}>
                      {serverError && <div className="validation-error" role="alert">{serverError}</div>}
                          <input className={styles.formControl} type="email" name="employee_email" placeholder="Employee email" onChange={(e) => setEmployee_email(e.target.value)}/>
                      {emailError && <div className="validation-error" role="alert">{emailError}</div>}

                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="text" name="employee_first_name" placeholder="Employee first name" onChange={(e) => setEmployee_first_name(e.target.value)}/>
                      {firstNameRequired && <div className="validation-error" role="alert">{firstNameRequired}</div>}

                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="text" name="employee_last_name" placeholder="Employee last name" required onChange={(e) => setEmployee_last_name(e.target.value)}/>
                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="text" name="employee_phone" placeholder="Employee phone (555-555-5555)" required onChange={(e) => setEmployee_phone(e.target.value)}/>
                        </div>
                        <div className={styles.formGroup}>
                          <div className={styles.selectContainer}>
                          <select name="employee_role" className={styles.formControl} onChange={(e) => setCompany_role_id(e.target.value)}>
                            <option value="1">Employee</option>
                            <option value="2">Manager</option>
                            <option value="3">Admin</option>
                          </select>
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="password" name="employee_password" placeholder="Employee password" onChange={(e) => setPassword(e.target.value)}/>
                      {passwordError && <div className="validation-error" role="alert">{passwordError}</div>}

                        </div>
                        <div className={styles.formGroup}>
                          <button className={styles.submitButton} type="submit" data-loading-text="Please wait...">Add employee</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddEmployee;