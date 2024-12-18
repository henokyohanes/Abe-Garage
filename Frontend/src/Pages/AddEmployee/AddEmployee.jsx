import React from 'react';
import AdminMenu from '../../Components/AdminMenu/AdminMenu';
import Layout from '../../Layout/Layout';
import styles from "./AddEmployee.module.css";

const AddEmployee = () => {
  return (
    <Layout>
      <div className={`${styles.contactSection} row g-0`}>
        <div className="col-2">
          <AdminMenu />
        </div>
        <div className="col-9">
          <div className={styles.container}>
            <h2>Add a new employee <span>____</span></h2>
            <div className={styles.contactForm}>
              <div className={styles.innerContainer}>
                <div className={styles.formContainer}>
                  <div className={styles.form}>
                    <form>
                      <div className={styles.formGroupContainer}>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="email" name="employee_email" placeholder="Employee email" />
                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="text" name="employee_first_name" placeholder="Employee first name" />
                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="text" name="employee_last_name" placeholder="Employee last name" required />
                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="text" name="employee_phone" placeholder="Employee phone (555-555-5555)" required />
                        </div>
                        <div className={styles.formGroup}>
                          <div className={styles.selectContainer}>
                          <select name="employee_role" className={styles.formControl}>
                            <option value="1">Employee</option>
                            <option value="2">Manager</option>
                            <option value="3">Admin</option>
                          </select>
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <input className={styles.formControl} type="password" name="employee_password" placeholder="Employee password" />
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