import React from 'react';
import AddEmployeeForm from '../../components/AddEmployeeForm/AddEmployeeForm';
import AdminMenu from '../../components/AdminMenu/AdminMenu';
import Layout from '../../Layout/Layout';

function AddEmployee(props) {
  return (
    <Layout>
      <div>
        <AdminMenu />
      </div>
      <div>
        <AddEmployeeForm />
      </div>
    </Layout>
  );
}

export default AddEmployee;