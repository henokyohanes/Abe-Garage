import React from 'react';
import AddEmployeeForm from '../../components/AddEmployeeForm/AddEmployeeForm';
import AdminMenu from '../../components/AdminMenu/AdminMenu';

function AddEmployee(props) {
  return (
    <div>
      <div>
        <AdminMenu />
      </div>
      <div>
        <AddEmployeeForm />
      </div>
    </div>
  );
}

export default AddEmployee;