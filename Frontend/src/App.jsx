import React from 'react'
import Header from './Components/Header/Header'
import Home from './Pages/Home/Home';
import Footer from './Components/Footer/Footer'
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css'
import AdminMenu from './Components/AdminMenu/AdminMenu';
import AddEmployeeForm from './Components/AddEmployeeForm/AddEmployeeForm';

const App = () => {

  return (
    <>
      <Header />
      {/* <Home /> */}
      {/* <AdminMenu /> */}
      <AddEmployeeForm />
      <Footer />
    </>
  )
}

export default App
