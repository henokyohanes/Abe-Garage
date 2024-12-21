import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateAuthRoute from "../Auth/PrivateAuthRoute";
import Home from "../Pages/Home/Home";
import Orders from "../pages/Orders/Orders";
import Customers from "../Pages/Customers/Customers";
import AddEmployee from "../Pages/AddEmployee/AddEmployee";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import Login from "../Pages/Login/Login";
import AboutUs from "../Pages/AboutUs/AboutUs";
import ContactUs from "../Pages/ContactUs/ContactUs";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import Employees from "../Pages/Admin/Employees/Employees";
import AbeServices from "../Pages/AbeSevices/AbeServices";
import EmployeeUpdate from "../Pages/Admin/EmployeeUpdate/EmployeeUpdate";
import NewOrder from "../Pages/Admin/NewOrder/NewOrder";
import AddCustomer from "../Pages/AddCustomer/AddCustomer";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/contact-us" element={<ContactUs />} />
    <Route path="/Services" element={<AbeServices />} />

    {/* Protected Routes */}
    <Route
      path="/admin/orders"
      element={
        <PrivateAuthRoute roles={[1, 2, 3]}>
          <Orders />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/customers"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <Customers />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/add-customer"
      element={
        <PrivateAuthRoute roles={[2, 3]}>
          <AddCustomer />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/add-employee"
      element={
        <PrivateAuthRoute roles={[3]}>
          <AddEmployee />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/dashboard"
      element={
        <PrivateAuthRoute roles={[3]}>
          <Dashboard />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/employees"
      element={
        <PrivateAuthRoute roles={[3]}>
          <Employees />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/edit-employee/:id"
      element={
        <PrivateAuthRoute roles={[3]}>
          <EmployeeUpdate />
        </PrivateAuthRoute>
      }
    />
    <Route
      path="/admin/new-order"
      element={
        <PrivateAuthRoute roles={[3]}>
          <NewOrder />
        </PrivateAuthRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
