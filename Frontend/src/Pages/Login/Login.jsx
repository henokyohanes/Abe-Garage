import React from 'react';
// Import the Login component 
import LoginForm from '../../components/LoginForm/LoginForm';
import Layout from '../../Layout/Layout';

function Login(props) {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
}

export default Login;