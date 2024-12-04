import React from 'react';
import StyleS from "./AddEmployeeForm.module.css"

const AddEmployeeForm = () => {
  
  return (
    <section className={StyleS.contactSection}>
      <div className={StyleS.container}>
        <div className={StyleS.sectionTitle}>
          <h2>Add a new employee</h2>
        </div>
        <div className={StyleS.contactForm}>
          <div className={StyleS.innerContainer}>
            <div className={StyleS.formContainer}>
              <div className={StyleS.form}>
                <form>
                  <div className={StyleS.formGroupContainer}>
                    <div className={StyleS.formGroup}>
                      <input type="email" name="employee_email" placeholder="Employee email" />
                    </div>
                    <div className={StyleS.formGroup}>
                      <input type="text" name="employee_first_name" placeholder="Employee first name" />
                    </div>

                    <div className={StyleS.formGroup}>
                      <input type="text" name="employee_last_name" placeholder="Employee last name" required />
                    </div>

                    <div className={StyleS.formGroup}>
                      <input type="text" name="employee_phone" placeholder="Employee phone (555-555-5555)" required />
                    </div>

                    <div className={StyleS.formGroup}>
                      <select name="employee_role" className={StyleS.formControl}>
                        <option value="1">Employee</option>
                        <option value="2">Manager</option>
                        <option value="3">Admin</option>
                      </select>
                    </div>

                    <div className={StyleS.formGroup}>
                      <input type="password" name="employee_password" placeholder="Employee password" />
                    </div>

                    <div className={StyleS.formGroup}>
                      <button className={StyleS.submitButton} type="submit" data-loading-text="Please wait..."><span>Add employee</span></button>
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

export default AddEmployeeForm;